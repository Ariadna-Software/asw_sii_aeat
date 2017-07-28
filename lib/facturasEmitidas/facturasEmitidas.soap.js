// facturasEmitidas.soap.js
// envia el mensaje SOAP a la AEAT.

var soap = require('soap');
var fs = require('fs');
var cfg = require('../../config.json');

var facturasEmitidasSoapAPI = {
    sendXml: function (jsObject, done) {
        // es test o producción?
        var tipo = "TEST"; // test por defecto
        if (cfg.tipo && cfg.tipo == "PROD") {
            tipo = "PROD"
        }
        // comprobar que contamos con la configuración adecuada
        if (!cfg.wsdl || !cfg.wsdl.facturasEmitidas) {
            return done(new Error("Falta la configuración de la url WSDL para el envío de facturas emitidas"));
        }
        var urlWsdl = cfg.wsdl.facturasEmitidas;
        if (!cfg.xsd || !cfg.xsd.facturasEmitidas) {
            return done(new Error("Falta la configuración de la url XSD para el envío de facturas emitidas"));
        }
        var urlXsd = cfg.xsd.facturasEmitidas;
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
                client.siiService.SuministroFactEmitidas.SuministroLRFacturasEmitidas(jsObject, function (err, result, raw, soapHeader) {
                    if (err) return done(err);
                    result.xml = client.lastRequest;
                    done(null, result);
                });
            } else {
                //fs.writeFileSync('/tmp/jsSend.json', JSON.stringify(jsObject, null, 2));
                client.siiService.SuministroFactEmitidasPruebas.SuministroLRFacturasEmitidas(jsObject, function (err, result, raw, soapHeader) {
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

module.exports = facturasEmitidasSoapAPI;