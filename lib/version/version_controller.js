// version controller
// simplemente muestra la versión de programa
var express = require('express');
var router = express.Router();
var pck = require('../../package.json');
var cfg = require('../../config.json');

router.get('/', function(req, res) {
    var message = "VRS: " + pck.version;
    var version = {
    	version: message,
        tipo: cfg.tipo
    };
    res.json(version);
	// another
});

module.exports = router;
