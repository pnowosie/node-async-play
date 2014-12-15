var _ = require('lodash');
var path = require('path');


var FsMock = module.exports = function FsMock(inFiles, closeFun) {

    //TODO: Reset state
    this.fsw_close = closeFun || function(){};
    this.inFiles = inFiles;
    this.outFiles = {};
    this.watchEvnts = [];
};


FsMock.prototype.watch = function(dir, next) {
    var watchIdx = 0, self = this;
    this.stopWatch = false;

    process.nextTick(waitForFiles);

    next('rename', 'filename'); //TODO
    return {
        close: function() {
            self.stopWatch = true;
            self.fsw_close();
        }
    };

    function waitForFiles() {
        console.log('File waiter, stop:', self.stopWatch, 'events in queue:', self.watchEvnts.length);

        while (watchIdx < self.watchEvnts.length) {
            var fn = self.watchEvnts[watchIdx];
            process.nextTick(function() {
                next('rename', fn);
            });
            ++watchIdx;
        }

        if (!self.stopWatch)
            process.nextTick(waitForFiles);
    }
};

FsMock.prototype.readFile = function(fn, encoding, next) {
    if (this.outFiles[fn])
        return next(null, this.outFiles[fn]);
    next(new Error('File not found: '+ fn));
};

FsMock.prototype.copy = function(inputDir, outputDir, next) {
    _.extend(this.outFiles, this.inFiles);
    this.watchEvnts = _.map(_.keys(this.inFiles), path.basename);
};

FsMock.prototype.writeFile = function(fn, data, next) {
    if (!this.outFiles[fn])
        this.watchEvnts.push(path.basename(fn));
    this.outFiles[fn] = data;
    next();
};

FsMock.prototype.appendFile = function(fn, data, next) {
    if (!this.outFiles[fn]) this.outFiles[fn] = '';
    this.outFiles[fn] += data;
    next();
};

FsMock.prototype.exists = function(dir, next) {
    return next(false);
};

FsMock.prototype.mkdir = function(dir, next) {
    next();
};


