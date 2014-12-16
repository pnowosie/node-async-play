var _ = require('lodash');
var path = require('path');


var FsMock = module.exports = function FsMock(inFiles, closeFun) {

    //TODO: Reset state
    this.fsw_close = closeFun || function(){};
    this.inFiles = inFiles;
    this.outputDir = {};
    this.watchEvnts = [];
};


FsMock.prototype.watch = function(dir, next) {
    var watchIdx = 0, dryRunCnt = 0, self = this;
    this.stopWatch = false;

    process.nextTick(waitForFiles);

    return {
        close: function() {
            self.stopWatch = true;
            self.fsw_close();
        }
    };

    function waitForFiles() {
        console.log('File watcher, stop:', self.stopWatch, 'events in queue:', self.watchEvnts.length);

        if (watchIdx == self.watchEvnts.length) ++dryRunCnt;

        while (watchIdx < self.watchEvnts.length) {
            var fn = self.watchEvnts[watchIdx];
            next('rename', fn);
            ++watchIdx;
        }

        if (dryRunCnt > 5)
            throw new Error('Mock watcher stop by too many dry runs!');
        if (!self.stopWatch)
            process.nextTick(waitForFiles);

    }
};

FsMock.prototype.readdir = function(inputDir, next) {
    next(null, _.keys(this.inFiles));
};

FsMock.prototype.copy = function(inputDir, outputDir, next) {
    _.extend(this.outputDir, this.inFiles);
    this.watchEvnts =
        this.inFiles.__order__ || _.map(_.keys(this.inFiles), path.basename);
    if (next) next();
};

FsMock.prototype.readFile = function(fn, encoding, next) {
    if (this.outputDir[fn])
        return next(null, this.outputDir[fn]);
    next(new Error('File not found: '+ fn));
};

FsMock.prototype.writeFile = function(fn, data, next) {
    if (!this.outputDir[fn])
        this.watchEvnts.push(path.basename(fn));
    this.outputDir[fn] = data;
    next();
};

FsMock.prototype.appendFile = function(fn, data, next) {
    if (!this.outputDir[fn]) this.outputDir[fn] = '';
    this.outputDir[fn] += data;
    next();
};

FsMock.prototype.exists = function(dir, next) {
    return next(false);
};

FsMock.prototype.mkdir = function(dir, next) {
    next();
};


