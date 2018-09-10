function bundleResource (inPath, outPath) {
    return new Promise((resolve, reject) => {
        var bundler = browserify(inPath)
        bundler.bundle().pipe(fs.createWriteStream(outPath))
        .once('finish', () => {
        resolve()
    })
.once('error', (e) => {
        reject(e)
    })
})
}