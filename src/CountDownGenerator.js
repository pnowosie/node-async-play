var util = require('util');
var Generator = require('./Generator');

var CountDownGenerator = module.exports = function CountDownGenerator(seed) {
    Generator.call(this, seed, 0, 20);
};

util.inherits(CountDownGenerator, Generator);

CountDownGenerator.prototype._isStopCondMet = function() {
    return this.current <= 0;
};

CountDownGenerator.prototype._generateNext = function() {
    this.current--;
};