// facturasRecibidas.soap.js
// envia el mensaje SOAP a la AEAT.

var soap = require('soap');
var fs = require('fs');
var cfg = require('../../config.json');

var facturasRecibidasSoapAPI = {
    sendXml: function (jsObject, done) {
        // es test o producción?
        var tipo = "TEST"; // test por defecto
        if (cfg.tipo && cfg.tipo == "PROD") {
            tipo = "PROD"
        }
        // comprobar que contamos con la configuración adecuada
        if (!cfg.wsdl || !cfg.wsdl.facturasRecibidas) {
            return done(new Error("Falta la configuración de la url WSDL para el envío de facturas recibidas"));
        }
        var urlWsdl = cfg.wsdl.facturasRecibidas;
        if (!cfg.xsd || !cfg.xsd.facturasRecibidas) {
            return done(new Error("Falta la configuración de la url XSD para el envío de facturas recibidas"));
        }
        var urlXsd = cfg.xsd.facturasRecibidas;
        if (!cfg.certs || !cfg.certs[jsObject.Cabecera.Titular.NIF]) {
            return done(new Error("Falta la configuración de del certificado de presentación para el titular " + jsObject.Cabecera.Titular.NIF));
        }
        var cert = cfg.certs[jsObject.Cabecera.Titular.NIF];

        soap.createClient(urlWsdl, function (err, client) {
            if (err) return done(err);
            client.wsdl.definitions.xmlns.ns1 = urlXsd;
            client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()
            client.setSecurity(new soap.ClientSSLSecurityPFX(cert.url, cert.pass));
            if (tipo == "PROD") {
                client.siiService.SuministroFactRecibidas.SuministroLRFacturasRecibidas(jsObject, function (err, result, raw, soapHeader) {
                    if (err) return done(err);
                    result.xml = client.lastRequest;
                    done(null, result);
                });
            } else {
                // fs.writeFileSync('/tmp/jsSendRec.json', JSON.stringify(jsObject, null, 2));
                client.siiService.SuministroFactRecibidasPruebas.SuministroLRFacturasRecibidas(jsObject, function (err, result, raw, soapHeader) {
                    // fs.writeFileSync('/tmp/jsErrRec.json', JSON.stringify(err, null, 2));
                    // fs.writeFileSync('/tmp/jsResultRec.json', JSON.stringify(result, null, 2));
                    // fs.writeFileSync('/tmp/lastRequestRec.xml', client.lastRequest)
                    if (err) return done(err);
                    result.xml = client.lastRequest;
                    done(null, result);
                });
            }
        });
    },
    consultaXml: function(nif, filtro, done){
        var tipo = "TEST"; // test por defecto
        if (cfg.tipo && cfg.tipo == "PROD") {
            tipo = "PROD"
        }
        // comprobar que contamos con la configuración adecuada
        if (!cfg.wsdl || !cfg.wsdl.facturasRecibidas) {
            return done(new Error("Falta la configuración de la url WSDL para el envío de facturas recibidas"));
        }
        var urlWsdl = cfg.wsdl.facturasRecibidas;
        if (!cfg.xsd || !cfg.xsd.facturasRecibidas) {
            return done(new Error("Falta la configuración de la url XSD para el envío de facturas recibidas"));
        }
        var urlXsd = cfg.xsd.facturasEmitidas;
        if (!cfg.certs || !cfg.certs[nif]) {
            return done(new Error("Falta la configuración del certificado de presentación para el titular " + nif));
        }
        var cert = cfg.certs[nif];

        soap.createClient(urlWsdl, function (err, client) {
            if (err) return done(err);
            client.wsdl.definitions.xmlns.ns1 = urlXsd;
            client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()
            client.setSecurity(new soap.ClientSSLSecurityPFX(cert.url, cert.pass));
            
            if (tipo == "PROD") {
                client.siiService.SuministroFactRecibidas.ConsultaLRFacturasRecibidas(filtro, function (err, result, raw, soapHeader) {
                    if (err) return done(err);
                    result.xml = client.lastRequest;
                    done(null, result);
                });
            } else {
                //fs.writeFileSync('/tmp/jsSend.json', JSON.stringify(jsObject, null, 2));
                client.siiService.SuministroFactRecibidasPruebas.ConsultaLRFacturasRecibidas(filtro, function (err, result, raw, soapHeader) {
                    // fs.writeFileSync('/tmp/jsErr.json', JSON.stringify(err, null, 2));
                    // fs.writeFileSync('/tmp/jsResult.json', JSON.stringify(result, null, 2));
                    // fs.writeFileSync('/tmp/lastRequest.xml', client.lastRequest)
                    if (err) return done(err);
                    result.xml = client.lastRequest;
                    done(null, result);
                });
            }
        });        
    }
};

module.exports = facturasRecibidasSoapAPI;