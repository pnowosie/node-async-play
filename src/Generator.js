var isNumber = function(value) {
    return isFinite(value) && !isNaN(parseInt(value));
};

var Generator = module.exports = function Generator(seed, lower, upper) {
    if (!(isNumber(lower) && isNumber(upper)))
        throw new Error('Lower and Upper bounds have to be numbers');

    var self = this;
    var validate = function(value) {
        value = isNumber(value) ? Number(value) : NaN;
        return lower <= value && value <= upper;
    };

    if (validate(seed))
        self.current = Number(seed);
};

Generator.prototype.next = function() {
    var canGenerate = !this._isStopCondMet();
    if (canGenerate)
        this._generateNext();
    return canGenerate;
};

Generator.prototype._isStopCondMet = function() {
    return true;
};

Generator.prototype._generateNext = function() {
    // do nothing
};