
var FsMock = module.exports = function FsMock(closeFun) {

    //TODO: Reset state
    this.fsw_close = closeFun || function(){};

};


FsMock.prototype.watch = function(dir, next) {
    next('rename', 'filename'); //TODO
    return { close: this.fsw_close };
}

FsMock.prototype.readFile = function(fn, encoding, next) {
    next(null, 'data');
}

FsMock.prototype.copy = function(inputDir, outputDir, next) {

}

FsMock.prototype.writeFile = function(fn, data, next) {
    next();
}

FsMock.prototype.appendFile = function(fn, data, next) {
    next();
}

FsMock.prototype.exists = function(dir, next) {
    return next(false);
}

FsMock.prototype.mkdir = function(dir, next) {
    next();
}


