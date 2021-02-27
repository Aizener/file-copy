### Get Started

### 更新
- 2021-02-27: 把文件读写流改用`async/await`的方式同步执行，虽然效率变慢，但能解决报错：`Error: EMFILE, too many open files`

```git
git@github.com:Aizener/file-copy.git
```

### Run:

```shell
node index.js
```

or

```shell
node index.js 1|0
```

or

```shell
node index.js 1|0 ./targetDir
```
