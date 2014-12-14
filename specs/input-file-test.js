var should = require('should');
var DM = require('../src/DirectoryManager');

var pathSep = require('path').sep;

describe ('Directory manager', function() {
    it ('should be well defined',  function() {
        should.exist(DM);
        DM.should.be.type('function');

        (new DM('dir')).should.be.instanceOf(DM);
    });
    
    var dm = new DM('dir');
    it ('should handle input files', function() {
        var fi = dm.fileInfo('ala.1122');

        should.exist(fi);
        fi.should.have.property('isInputFile', true);
        fi.should.have.property('index', 1122);
        fi.should.have.property('srcPath', 'dir'+pathSep+'ala.1122');
        fi.should.have.property('basename', 'ala');
        fi.should.have.property('newFn', 'ala.1123');
        fi.should.have.property('outPath', 'dir'+pathSep+'ala.1123');
        fi.should.have.property('processed', false);
    });

    it ('should remember whether file was processed', function() {
        dm.fileInfo('ala.1122').processed.should.be.true;
        dm.fileInfo('ala.1123').processed.should.be.false;
    });

    it ('should handle game result file', function() {
        var fi = dm.fileInfo('game.txt');
        should.exist(fi);
        fi.should.have.property('isInputFile', false);
        fi.should.have.property('index', NaN);
        fi.should.not.have.property('newFn');
        fi.should.not.have.property('processed');
        fi.should.have.property('srcPath', 'dir'+pathSep+'game.txt');
        fi.should.not.have.property('outPath', 'dir'+pathSep+'game.txt');
    });
});