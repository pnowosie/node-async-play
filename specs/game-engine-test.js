var rewire = require('rewire');
var CountDownGenerator = require('../src/CountDownGenerator');


var FsMock = require('./fs-mock');
var GameEngine = rewire('../src/GameEngine');

GameEngine.__set__('fs', new FsMock());
GameEngine.Play('input', 'output', CountDownGenerator);