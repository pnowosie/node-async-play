var moment = require('moment');

module.exports.get = function() {

    return moment().format('YYYYMMDD_HHmmss');
};