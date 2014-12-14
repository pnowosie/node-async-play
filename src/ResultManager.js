var util = require('util');
var _ = require('lodash');

var EOL = require('os').EOL;

var ResultManager = module.exports = function ResultManager(Generator) {
    if (typeof Generator !== 'function') throw new Error('ResultManager needs Generator constructor to work.');

    var results = {};

    this.nextResult = function(player, value) {
        var pr = results[player] || (results[player] = { count: 0, gen: new Generator(value) });

        var hasNext = pr.gen.next(value);
        if (hasNext) ++pr.count;
        else pr.end = true;

        return {
            canPlay: hasNext,
            value  : pr.gen.current
        };
    };

    this.getScore = function(player) {
        var pr = results[player];
        if (!pr) return undefined;

        return util.format(player, pr.count, EOL);
    };

    this.isGameOver = function() {
        return _.all(results, { end: true});
    };
};