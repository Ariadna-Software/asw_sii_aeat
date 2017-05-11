/*
 comun.ajax.js
 Funciones generales generales de llamadas ajax (JQUERY)
*/
var apiComunAjax = {
    llamadaGeneral: function (verbo, url, datos, fretorno) {
        var opciones = {
            type: verbo,
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                fretorno(null, data);
            },
            error: function (err) {
                apiComunNotificaciones.errorAjax(err);
                fretorno(err);
            }
        };
        if (datos) {
            opciones.data = JSON.stringify(datos);
        }
        $.ajax(opciones);
    },
    llamadaGeneralControlError: function (verbo, url, datos, fretorno) {
        var opciones = {
            type: verbo,
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                fretorno(null, data);
            },
            error: function (err) {
                fretorno(err);
            }
        };
        if (datos) {
            opciones.data = JSON.stringify(datos);
        }
        $.ajax(opciones);
    },
    establecerClave: function (clave) {
        $.ajaxSetup({
            headers: { 'x-apiKey': clave }
        });

    }
}