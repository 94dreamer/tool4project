
const fs = require('fs');
const path = require('path');

function isFile (fileName) {
    return fs.lstatSync(fileName).isFile();
};

/**
 * @param {*} url
 */
function deleteFolderRecursive(url) {
    let files = [];
    /**
     * 判断给定的路径是否存在
     */
    if (fs.existsSync(url)) {
        /**
         * 返回文件和子目录的数组
         */
        if (isFile(url)) {
            fs.unlinkSync(url);
            return;
        }

        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
            let curPath = path.join(url, file);
            /**
             * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
             */
            if (fs.statSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        /**
         * 清除文件夹
         */
        fs.rmdirSync(url);
    } else {
        console.log('给定的路径不存在，请给出正确的路径');
    }
}

function childrenFiles(folderPath, moduleArr, unusedArr) {
    fs.readdirSync(folderPath).forEach(fileName => {
        const childrenFile = path.join(folderPath, fileName);

        if (!moduleArr.some(m =>m.indexOf(childrenFile) !== -1)) {
            unusedArr.push(childrenFile);
        } else if (!isFile(childrenFile)) {
            arguments.callee(childrenFile, moduleArr, unusedArr);
        }
    });
}

function read4StepOne(){
    fs.readFile(path.resolve(process.cwd(), './stats.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const moduleArr = JSON.parse(data)
            .modules.map(n => n.name)
            .filter(n => /^\.\/src\/|\.\/shared\//.test(n));

        fs.writeFile(path.resolve(process.cwd(), './moduleArr.json'), JSON.stringify(moduleArr, null, 4), err => {
            if (err) {
                console.error(err);
            }
            console.log('文件写入成功。');
        });
    });
}

function out4StepTwo(cate){ 
    fs.readFile(path.resolve(process.cwd(), './moduleArr.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        const file = path.resolve(process.cwd(), `./${cate || 'src'}`);
        
        const moduleArr = JSON.parse(data
            .replace( /\.\//g , process.cwd()+'/')
        );

        const unusedArr = [];
        childrenFiles(file, moduleArr, unusedArr);

        fs.writeFile(path.resolve(process.cwd(), './unusedArr.json'), JSON.stringify(unusedArr, null, 4), err => {
            if (err) {
                console.error(err);
            }
            console.log('文件写入成功。');
        });
    });
}

function del4StepThree(){
    fs.readFile(path.resolve(process.cwd(), './unusedArr.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('del4StepThree error');
        }
        const unusedArr = JSON.parse(data);
        unusedArr.forEach(fileName => {
            deleteFolderRecursive(fileName);
        });
    });
}

module.exports={
    read4StepOne,
    out4StepTwo,
    del4StepThree
}