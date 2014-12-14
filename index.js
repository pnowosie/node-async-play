var GameEngine = require('./src/GameEngine');
var CountDownGenerator = require('./src/CountDownGenerator');
var tbn = require('./src/TimeBasedName');

GameEngine.Play('input', tbn.get(), CountDownGenerator);