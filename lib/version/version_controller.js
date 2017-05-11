// version controller
// simplemente muestra la versión de programa
var express = require('express');
var router = express.Router();
var pck = require('../../package.json')

router.get('/', function(req, res) {
    var message = "VRS: " + pck.version;
    var version = {
    	version: message
    };
    res.json(version);
	// another
});

module.exports = router;
