var _ = require('lodash');

var Generator = module.exports = function Generator(seed, lower, upper) {
    if (!(_.isNumber(lower) && _.isNumber(upper)))
        throw new Error('Lower and Upper bounds have to be numbers');

    var validate = function(value) {
        value = _.isNumber(value) ? Number(value) : NaN;
        return lower <= value && value <= upper;
    };

    if (validate(seed))
        this.current = Number(seed);
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