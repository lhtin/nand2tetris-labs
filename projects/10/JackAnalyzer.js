const fs = require('fs')
const path = require('path')
const {CompilationEngine} = require('./CompilationEngine')
const {JackTokenizer} = require('./JackTokenizer')

const fileList = []
const filePath = path.join(process.cwd(), process.argv[2])
const stat = fs.statSync(filePath)
if (stat.isDirectory()) {
    fs.readdirSync(filePath)
        .map((fileName) => path.join(filePath, fileName))
        .filter((file) => {
            return fs.statSync(file).isFile() && path.extname(file) === '.jack'
        }).forEach((filePath) => {
        fileList.push({
            src: filePath,
            dest: filePath.replace('.jack', '.xml')
        })
    })
} else {
    fileList.push({
        src: filePath,
        dest: filePath.replace('.jack', '.xml')
    })
}

fileList.forEach((item) => {
    // console.log(item)
    const t = new JackTokenizer(fs.readFileSync(item.src, 'utf-8'))
    const c = new CompilationEngine(t)
    fs.writeFileSync(item.dest, c.getXML(), 'utf-8')
})
