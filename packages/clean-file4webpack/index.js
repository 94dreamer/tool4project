#!/usr/bin/env node

// 读取 stats.json 里面的 modules 的name
// 注意入口文件和图片

const { read4StepOne, out4StepTwo, del4StepThree } =require('./utils')

const argv = process.argv.slice(2)

switch(argv[0]){
    case '1':
        return read4StepOne()
    case '2':
        return out4StepTwo(argv[1])
    case '3':
        return del4StepThree()
    default:
        console.error('请检查 argv是否合法')
}


