//=======================================
// Proasistencia (index.js)
// API to communicate to PROASISTENCIA
//========================================
// Author: Rafael Garcia (rafa@myariadna.com)
// 2015 [License CC-BY-NC-4.0]


// required modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var serveIndex = require('serve-index');
var moment = require('moment');

var pack = require('./package.json');
var config = require('./config.json');
var loginDb = require('./lib/login/login_db_mysql');


// starting express
var app = express();
// to parse body content
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// using cors for cross class
app.use(cors());

// servidor html estático
app.use(express.static(__dirname + "/public"));
app.use('/ficheros', serveIndex(__dirname + '/public/ficheros', { 'icons': true, 'view': 'details' }));



// mounting routes
var router = express.Router();

// -- common to all routes /API
router.use(function (req, res, next) {
    // check API KEY
    var clave = req.header('x-apiKey');
    if (!clave) return res.status(401).send('No se ha encontrado clave API');
    loginDb.verificarClave(clave, function (err, verificada) {
        if (err) return res.status(500).send(err.message);
        if (!verificada) return res.status(401).send('No autorizado');
        next();
    });
});


// -- general GET (to know if the server is up and runnig)
router.get('/', function (req, res) {
    res.json('ASWSII API / SERVER -- runnig');
});

// -- registering routes
app.use('/login', require('./lib/login/login_controller'));
app.use('/version', require('./lib/version/version_controller'));
app.use('/api', router);
app.use('/api/grupos-usuarios', require('./lib/grupos-usuarios/grupos-usuarios.controller'));
app.use('/api/usuarios', require('./lib/usuarios/usuarios.controller'));
app.use('/api/correoElectronico', require('./lib/correoElectronico/correoElectronico.controller'));

// -- start server
app.listen(config.apiPort);



// -- console message
console.log("-------------------------------------------");
console.log(" ASWSII ", moment(new Date()).format('DD/MM/YYYYY HH:mm:ss'));
console.log("-------------------------------------------");
console.log(' VERSION: ' + pack.version);
console.log(' PORT: ' + config.apiPort);
console.log("-------------------------------------------");
