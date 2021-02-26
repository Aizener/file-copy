const fs = require('fs')
const path = require('path')

let [dir = 0, dirPath = "./"] = process.argv.slice(2)
dir = Boolean(+dir)

const targetDirPath = path.join('./out', dirPath)

if (dir) {
  mkdirs(targetDirPath)
} else {
  if (!isExsist(targetDirPath)) {
    fs.mkdirSync('./out')
  }
}

function copyFile (dirPath) {
  if (!isExsist(dirPath)) {
    // 判断需要copy的目录是否存在
    console.log(dirPath + '不存在!')
    return
  }

  const res = fs.readdirSync(dirPath)
  res.forEach(item => {
    // 获取当前相对路径
    const targetPath = path.join(dirPath, item)
    // 定义输出目标路径，dir表示终端传入的值（0为不生成对应文件夹）
    const wsPath = path.join('./out', dir ? targetPath : item)
    // 获取当前对象信息
    const target = fs.statSync(targetPath)
    if (target.isDirectory()) {
      if (!isExsist(wsPath) && item !== 'out') {
        dir && fs.mkdirSync(wsPath) // 创建对应文件夹
        copyFile(targetPath)
      }
    } else {
      if (item !== 'index.js') {
        // 创建管道写入数据
        const ws = fs.createWriteStream(wsPath)
        fs.createReadStream(targetPath).pipe(ws) 
      }
    }
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