### Get Started

> 一个基于Node.js拷贝文件的工具

### 更新
- 2021-02-27: 把文件读写流改用`async/await`的方式同步执行，虽然效率变慢，~~但能解决报错：`Error: EMFILE, too many open files`~~；

  2021-02-27: 修改git全局用户信息；

- 2021-02-28：重新调整`async/await`的使用，这才解决`Error: EMFILE, too many open files`这个问题，但是发现速度明显变慢，而且同步性能确实较差，9200多个文件大概100M的目录，拷贝了一两分钟，估计还得看计算机的配置...

```git
git@github.com:Aizener/file-copy.git
```

### Run:

```shell
node index.js
```

or

```shell
node index.js 1|0  // 1表示是否新建对应目录，0则不是，默认0
```

or

```shell
node index.js 1|0 ./targetDir	// 拷贝当前目录指定的某个目录
```
