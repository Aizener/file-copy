const fs = require('fs')
const path = require('path')

let [dir = 0, dirPath = "./"] = process.argv.slice(2)
dir = Boolean(+dir)

const baseDir = './out'
const targetDirPath = path.join(baseDir, dirPath)

if (dir) {
  mkdirs(targetDirPath)
} else {
  if (!isExsist(targetDirPath)) {
    fs.mkdirSync(baseDir)
  }
}

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
      console.log(targetPath + '拷贝完成...')
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

copyFile(dirPath)
