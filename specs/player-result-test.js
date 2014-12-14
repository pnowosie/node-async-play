var should = require('should');
var CDGen = require('../src/CountDownGenerator');

var ResMngr = require('../src/ResultManager');

var pathSep = require('path').sep;

describe ('Result manager', function() {
    it('should be well defined', function () {
        should.exist(ResMngr);
        ResMngr.should.be.type('function');

        var rm = new ResMngr(CDGen);
        rm.should.be.instanceOf(ResMngr);
        rm.should.have.property('isGameOver').of.type('function');
        rm.isGameOver().should.be.type('boolean');
    });

    var rm = new ResMngr(CDGen), player = 'bob';
    it ('should register player on first call', function() {
        var res = rm.nextResult(player, 2);

        should.exist(res);
        res.should.have.property('canPlay', true);
        res.should.have.property('value', 1);
    });

    it ('should handle player results', function() {
        var res = rm.nextResult(player, 1);

        res.should.have.property('canPlay', true);
        res.should.have.property('value', 0);
    });

    it ('should track result of in-progress game', function() {
        rm.isGameOver().should.be.false;
    });

    it ('should handle player when game for player is over', function() {
        var res = rm.nextResult(player, 0);

        res.should.have.property('canPlay', false);
        res.should.have.property('value', 0);
    });

    it ('should track result of ended game', function() {
        rm.isGameOver().should.be.true;
    });

    it ('should present player score', function() {
        var bobScore = rm.getScore(player);
        bobScore.should.be.type('string');
        bobScore.trim().should.equal("bob 2");
    });

    it ('should return undefined as score for unknown user', function() {
        should.not.exist(rm.getScore('unknown'));
    });
});