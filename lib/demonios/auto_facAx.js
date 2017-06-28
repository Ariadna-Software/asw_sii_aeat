// auto_faAx.js
// Demonio que lanza cada cierto tiempo una búsqueda en la base de datos para enviar
// importar las fcaturas de AXAPTA
var mysql = require("mysql"),
    moment = require("moment"),
    comun = require("../comun/comun"),
    util = require("util"),
    async = require("async"),
    sprintf = require("sprintf-js").sprintf;

var config = require("../../configSQLServer.json");
var fs = require('fs');

var facemitidasDb = require("../facemitidas/facemitidas.db_mysql");
var facturasEmitidasDb = require("../facturasEmitidas/facturasEmitidas.db_mysql");
var facturasEmitidasDbToJs = require("../facturasEmitidas/facturasEmitidas.dbToJs");
var facturaEmitidasSoap = require("../facturasEmitidas/facturasEmitidas.soap");


var facrecibidasDb = require("../facrecibidas/facrecibidas.db_mysql");
var facturasRecibidasDb = require("../facturasRecibidas/facturasRecibidas.db_mysql");
var facturasRecibidasDbToJs = require("../facturasRecibidas/facturasRecibidas.dbToJs");
var facturaRecibidasSoap = require("../facturasRecibidas/facturasRecibidas.soap");
var sqlsDb = require("../sqls/sqls");

var sqlServer = require("mssql");
var axapta = require('../sqls/axapta2')

var isRunningAx = false;

var id = setInterval(function () {
    if (isRunningAx) return;
    var prMessage = "";
    isRunningAx = true;
    axapta.axCallSync(function (err) {
        if (err) {
            console.log("ERR AXAPTA: ", err.message);
        }
        isRunningAx = false;
    });
}, 5000); // lanzado cada 5 segundos


