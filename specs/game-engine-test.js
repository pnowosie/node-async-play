var rewire = require('rewire');
var CountDownGenerator = require('../src/CountDownGenerator');


var FsMock = require('./fs-mock');
var GameEngine = rewire('../src/GameEngine');

var Input = {
    'output\\ala.0': '3',
    'output\\bob.0': '0',
    'output\\eva.0': '1'
};

GameEngine.__set__('fs', new FsMock(Input));
GameEngine.Play('input', 'output', CountDownGenerator);