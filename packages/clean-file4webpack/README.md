# clean-file4webpack
查找和清除(依赖mei-pc-webpack或者webpack作为构建工具的)项目中未使用的文件和模块

# 用法

1.安装工具

```
ynpm install -g clean-file4webpack
```

2.使用webpack获取stats.json文件并得到纯净的模块文件

```
// 如果是直接使用webpack的项目，如果config.js不是默认的，需要在webpack后面指定下
webpack --json > stats.json
// 如果是mei-pc-webpack的项目
npx cross-env NODE_ENV=production webpack --config node_modules/@youzan/mei-pc-webpack/config/webpack.prod.js --profile --json > stats.json
```

会得到一个`stats.json文件`，这个文件太大了，包含全部的打包完成的依赖关系。

```
clean-file 1 
```

得到一个`moduleArr.json`文件，这个是一个纯净版本的依赖文件数组json

3.找到未使用的文件和模块

```
clean-file 2
```
可传第二个参数，默认是`src`，得到一个`unusedArr.json`文件。


4.删除

执行命令之前，可以先去这个文件确认下，可以再不改变格式的前提下修改文件，真正的删除将会依照这个json文件进行。

```
clean-file 3
```

