var fs = require('fs-extra');
var DirMngr = require('./DirectoryManager');
var ResultManager = require('./ResultManager');


module.exports.Play = function(inputDir, outputDir, Generator) {
    fs.exists(outputDir, function(exists) {
        if (exists) throw new Error('Output directory already exists!');

        fs.mkdir(outputDir, function(err) {
            if (err) throw err;

            var processed = {},
                dm = new DirMngr(outputDir),
                rm = new ResultManager(Generator);

            var fsw = fs.watch(outputDir, function(evt, fn) {
                if (fn != null && evt === 'rename' && !processed[fn]) {
                    console.log('Receive event', evt, 'for file', fn);
                    processed[fn] = true;

                    var fi = dm.fileInfo(fn);
                    if (fi.isInputFile && !fi.processed) {
                        fs.readFile(fi.srcPath, {encoding: 'utf8'}, function (err, data) {
                            if (err) throw err;

                            var value = Number(data);
                            console.log('READ', fn, value);
                            var res = rm.nextResult(fi.basename, value);
                            if (res.canPlay) {
                                fs.writeFile(fi.outPath, res.value.toString(), function (err) {
                                    if (err) throw err;
                                    console.log('WRITE', fi.newFn);
                                })
                            } else {
                                console.log('STOP', fn);
                                var score = rm.getScore(fi.basename);
                                fs.appendFile(dm.fileInfo('game.txt').srcPath, score, function (err) {
                                    if (err) throw err;
                                    console.log('RESULT', score);
                                });

                                if (rm.isGameOver()) {
                                    fsw.close();
                                    console.log('GAME IS OVER! See', dm.fileInfo('game.txt').srcPath, 'for results');
                                }
                            }
                        });
                    }
                }
            });

            fs.copy(inputDir, outputDir);

        });
    });
};
