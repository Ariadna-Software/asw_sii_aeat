console.log("-- NODE SII START --");
var soap = require('soap');
var fs = require('fs');


var url = 'http://www.agenciatributaria.es/static_files/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Modelos_y_formularios/Suministro_inmediato_informacion/FicherosSuministros/V_07/SuministroFactEmitidas.wsdl';
soap.createClient(url, function (err, client) {
    if (err) {
        console.log(err);
    } else {
        var obb = client.describe();
        var input = obb.siiService.SuministroFactEmitidasPruebas.ConsultaLRFacturasEmitidas.input;
        var myInput = input;
        myInput = {
            Cabecera: {
                IDVersionSii: "1.1",
                Titular: {
                    NombreRazon: "B96470190",
                    NIF: "B96470190"
                }
            },
            FiltroConsulta: {
                PeriodoImpositivo: {
                    Ejercicio: "2017",
                    Periodo: "02"
                }
            }
        };
        client.setSecurity( new soap.ClientSSLSecurityPFX("./cert/ariadna2019.pfx","aritel"));
        client.siiService.SuministroFactEmitidasPruebas.ConsultaLRFacturasEmitidas(myInput, function (err, result, raw, soapHeader) {
            if (err) {
                // console.log(err);
                console.log(raw);
            } else {
                fs.writeFileSync('/tmp/resultCons.json', JSON.stringify(result, null, 2));
            }
        })
    }
});