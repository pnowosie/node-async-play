var fs = require('fs-extra');
var util = require('util');

var EOL = require('os').EOL;

var getExtension = function(fn) {
    if (!fn || typeof fn != 'string') throw new Error('file name cannot be empty');
    var pos = fn.indexOf('.');
    if (pos === -1) throw new Error('invalid file name');
    var ext = parseInt(fn.substring(1+pos));
    return {
        isValid: !isNaN(ext),
        index: ext,
        rawName: fn.substring(0, pos)
    };
};

var mkpath = function(dir, fn, ext) {
    var path = util.format('%s/%s', dir, fn);
    if (ext) path += '.'+ext;
    return path;
};


module.exports.Play = function(inputDir, outputDir) {
    fs.exists(outputDir, function(exists) {
        if (exists) throw new Error('Output directory already exists!');

        fs.mkdir(outputDir, function(err){
            if (err) throw err;

            var processed = {};
            var fsw = fs.watch(outputDir, function(evt, fn) {
                if (fn != null && evt === 'rename' && !processed[fn]) {
                    console.log('Receive event', evt, 'for file', fn);
                    processed[fn] = true;

                    var fExt = getExtension(fn);
                    console.log(fExt.index, '- ext is valid', fExt.isValid);

                    if (fExt.isValid) fs.readFile(mkpath(outputDir, fn), {encoding: 'utf8'}, function (err, data) {
                        if (err) throw err;

                        var value = Number(data);
                        console.log('READ', fn, value);
                        var nextIndex = fExt.index + 1,
                            nextValue = value - 1;
                        if (nextValue >= 0) {
                            var newFn = mkpath(outputDir, fExt.rawName, nextIndex);
                            fs.writeFile(newFn, nextValue.toString(), function (err) {
                                if (err) throw err;
                                console.log('WRITE', newFn);
                            })
                        } else {
                            console.log('STOP', fn);
                            var result = util.format(fExt.rawName, nextIndex, EOL);
                            fs.appendFile(mkpath(outputDir, 'game.txt'), result, function (err) {
                                if (err) throw err;
                                console.log('RESULT', result);
                            });
                        }
                    });
                }
            });

            fs.copySync(inputDir, outputDir);

        });
    });
};
