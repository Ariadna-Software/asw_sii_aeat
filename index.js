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

var forever = require('forever-monitor');

var axapta = require('./lib/sqls/axapta')


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

app.use('/api/facturasEmitidas', require('./lib/facturasEmitidas/facturasEmitidas.controller'));
app.use('/api/facturasRecibidas', require('./lib/facturasRecibidas/facturasRecibidas.controller'));

app.use('/api/titulares', require('./lib/titulares/titulares.controller'));
app.use('/api/emisores', require('./lib/emisores/emisores.controller'));
app.use('/api/tipoComunicacion', require('./lib/tipoComunicacion/tipoComunicacion.controller'));
app.use('/api/periodo', require('./lib/periodo/periodo.controller'));
app.use('/api/tipoemitida', require('./lib/tipoemitida/tipoemitida.controller'));
app.use('/api/regimenemitida', require('./lib/regimenemitida/regimenemitida.controller'));
app.use('/api/tiporectificativa', require('./lib/tiporectificativa/tiporectificativa.controller'));
app.use('/api/situacioninmueble', require('./lib/situacioninmueble/situacioninmueble.controller'));
app.use('/api/causaexencion', require('./lib/causaexencion/causaexencion.controller'));
app.use('/api/tiponoexenta', require('./lib/tiponoexenta/tiponoexenta.controller'));
app.use('/api/tiporecibida', require('./lib/tiporecibida/tiporecibida.controller'));
app.use('/api/regimenrecibida', require('./lib/regimenrecibida/regimenrecibida.controller'));
app.use('/api/facrecibidas', require('./lib/facrecibidas/facrecibidas.controller'));
app.use('/api/facemitidas', require('./lib/facemitidas/facemitidas.controller'));
app.use('/api/facrecibidas', require('./lib/facrecibidas/facrecibidas.controller'));

// -- start server
app.listen(config.apiPort);



// -- console message
console.log("-------------------------------------------");
console.log(" ASWSII ", moment(new Date()).format('DD/MM/YYYYY HH:mm:ss'));
console.log("-------------------------------------------");
console.log(' VERSION: ' + pack.version);
console.log(' PORT: ' + config.apiPort);
console.log("-------------------------------------------");

// -- arranque de los demonios

// - Facturas emitidas
var childFacEnviadas = new (forever.Monitor)('./lib/demonios/auto_facEnviadas.js', {
    max: 3,
    args: []
});

childFacEnviadas.on('exit', function () {
    console.log('Demonio facEnviadas sin arrancar tras 3 intentos');
});

console.log("-- DEMONIO FACENVIADAS ARRANCADO --");
childFacEnviadas.start();

// - Facturas recibidas
var childFacRecibidas = new (forever.Monitor)('./lib/demonios/auto_facRecibidas.js', {
    max: 3,
    args: []
});

childFacRecibidas.on('exit', function () {
    console.log('Demonio facRecibidas sin arrancar tras 3 intentos');
});

console.log("-- DEMONIO FACRECIBIDAS ARRANCADO --");
childFacRecibidas.start();

if (config.Axapta == "S") {
    // - Axapta
    var childFacAx = new (forever.Monitor)('./lib/demonios/auto_facAx.js', {
        max: 3,
        args: []
    });

    childFacAx.on('exit', function () {
        console.log('Demonio AXAPTA sin arrancar tras 3 intentos');
    });

    console.log("-- DEMONIO AXAPTA ARRANCADO --");
    childFacAx.start();
}

// ----- QUITAR
console.log("-- AX --");
axapta.axCallSync(function(err){
    if (err) {
        console.log("ERR AX: ", err.message);
    }
    console.log("-- ACABOOOOOOOO !!!!! ----");
});