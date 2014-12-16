var should = require('should');
var path = require('path');
var rewire = require('rewire');
var CountDownGenerator = require('../src/CountDownGenerator');


var FsMock = require('./fs-mock');
var GameEngine = rewire('../src/GameEngine');

describe ('Game Engine', function() {

    var printGameLogHeader = function() {
        console.log();
        console.log('------------------------------------------');
        console.log('-             BEGIN GAME LOG             -');
        console.log('------------------------------------------');
    };

    describe ('One player', function() {
        var fs;
        before ('Initialization', function() {
            var input = {};
            input[path.join('t1', 'ala.0')] = '2';
         
            fs = new FsMock(input);
            GameEngine.__set__('fs', fs);
        });

        it ('Play the game', function(done) {
            fs.fsw_close = done;
            printGameLogHeader();
            GameEngine.Play('input', 't1', CountDownGenerator);
        });

        it ('Gets notified about new files in correct order', function() {
            var expected = ['ala.0', 'ala.1', 'ala.2'];
            expected.should.eql(fs.watchEvnts);
        });

        it ('Creates few files for player', function() {
            var dir = fs.outputDir;

            dir.should.have.property(path.join('t1', 'ala.0'), '2');
            dir.should.have.property(path.join('t1', 'ala.1'), '1');
            dir.should.have.property(path.join('t1', 'ala.2'), '0');
            dir.should.not.have.property(path.join('t1', 'ala.3'));
        });

        it ('Creates file with game result', function() {
            var dir = fs.outputDir,
                gamefile = path.join('t1', 'game.txt'),
                res = dir[gamefile];

            dir.should.have.property(gamefile);
            res.should.match(/^ala 2 /);
        });
    });

    describe ('Dumb player provide start value out of range', function() {
        var fs;
        before ('Initialization', function() {
            var input = {};
            input[path.join('t2', 'bob.0')] = '-1';
            fs = new FsMock(input);
            GameEngine.__set__('fs', fs);
        });

        it ('Game has normally ended', function(done) {
            fs.fsw_close = done;
            printGameLogHeader();
            GameEngine.Play('input', 't2', CountDownGenerator);
        });

        it ('Only initial input file was created', function() {
            var expected = ['bob.0'];
            expected.should.eql(fs.watchEvnts);
        });

        it ('and contains invalid value provided by a player', function() {
            var dir = fs.outputDir;

            dir.should.have.property(path.join('t2', 'bob.0'), '-1');
            dir.should.not.have.property(path.join('t2', 'bob.1'));
        });

        it ('Creates file with game result', function() {
            var dir = fs.outputDir,
                gamefile = path.join('t2', 'game.txt'),
                res = dir[gamefile];

            dir.should.have.property(gamefile);
            res.should.match(/^bob 0 /);
        });
    });

    describe ('Full game test', function() {
        var fs;
        before ('Initialization', function() {
            var input = {};
            input[path.join('t3', 'ala.0')] = '2';
            input[path.join('t3', 'bob.0')] = '1';
            input[path.join('t3', 'cleo.0')]= '0';
            
            fs = new FsMock(input);
            GameEngine.__set__('fs', fs);
        });

        it ('Play the game', function(done) {
            fs.fsw_close = done;
            printGameLogHeader();
            GameEngine.Play('input', 't3', CountDownGenerator);
        });

        it ('Gets notified about new files', function() {
            var events = fs.watchEvnts;
            events.should.containEql('ala.0');
            events.should.containEql('ala.1');
            events.should.containEql('ala.2');
            events.should.containEql('bob.0');
            events.should.containEql('bob.1');
            events.should.containEql('cleo.0');
        });

        it ('Creates file with game result', function() {
            var dir = fs.outputDir,
                gamefile = path.join('t3', 'game.txt'),
                res = dir[gamefile];

            dir.should.have.property(gamefile);
            res.should.match(/ala 2 /);
            res.should.match(/bob 1 /);
            res.should.match(/cleo 0 /);
        });
    });

    describe ('Full game - specified input files order', function() {
        var fs;
        before ('Initialization', function() {
            var input = {            
                __order__: ['cleo.0', 'bob.0', 'ala.0']
            };
            input[path.join('t4', 'ala.0')] = '2';
            input[path.join('t4', 'bob.0')] = '1';
            input[path.join('t4', 'cleo.0')]= '0';

            fs = new FsMock(input);
            GameEngine.__set__('fs', fs);
        });

        it ('Play the game', function(done) {
            fs.fsw_close = done;
            printGameLogHeader();
            GameEngine.Play('input', 't4', CountDownGenerator);
        });

        it ('Gets notified about new files', function() {
            var events = fs.watchEvnts;
            events.should.containEql('ala.0');
            events.should.containEql('ala.1');
            events.should.containEql('ala.2');
            events.should.containEql('bob.0');
            events.should.containEql('bob.1');
            events.should.containEql('cleo.0');
        });

        it ('Creates file with game result', function() {
            var dir = fs.outputDir,
                gamefile = path.join('t4', 'game.txt'),
                res = dir[gamefile];

            dir.should.have.property(gamefile);
            res.should.match(/ala 2 /);
            res.should.match(/bob 1 /);
            res.should.match(/cleo 0 /);
        });
    });
});