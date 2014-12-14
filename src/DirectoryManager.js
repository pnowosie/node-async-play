var path = require('path');


var DirectoryManager = module.exports = function DirectoryManager(outputDir) {
    var processed = {};

    var getExtension = function(fn) {
        return parseInt(path.extname(fn).substring(1));
    };


    this.fileInfo = function(fn) {
        if (!fn || typeof fn != 'string') throw new Error('file name cannot be empty');

        var index = getExtension(fn);
        var result = {
            index: index,
            isInputFile: !isNaN(index),
            srcPath: path.join(outputDir, fn)
        };

        if (result.isInputFile) {
            result.basename = path.basename(fn, path.extname(fn));
            result.newFn = result.basename + '.' + (index+1);
            result.outPath = path.join(outputDir, result.newFn);
            result.processed = !!processed[fn];
            processed[fn] = true;
        }

        return result;
    };

};