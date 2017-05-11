// ------------------------------------------------------------------------------------------------
// comun.js:
// contiene las funciones comunes a todas páginas de la aplicación
// ------------------------------------------------------------------------------------------------

//-- Se ejecuta al inciio de todas las páginas

function comprobarLogin() {
    // buscar el cookie
    try {
        var user = JSON.parse(getCookie("usuario"));
    } catch (e) {
        // volver al login
        window.open('login.html', '_self');
    }
    if (!user) {
        window.open('login.html', '_self');
    } else {
        nivelesUsuario(user.nivel);
        // cargar el nombre en la zona correspondiente
        $('#userName').text(user.nombre);
    }
}

function nivelesUsuario(nivel) {
    // ahora hay que hacer las comprobaciones de proasistencia
}

function comprobarLoginTrabajador() {
    // buscar el cookie
    try {
        var trabajador = JSON.parse(getCookie("trabajador"));
    } catch (e) {
        // volver al login
        window.open('login.html', '_self');
    }
    return trabajador;
}

function mostrarMensaje(mens) {
    $("#mensaje").text(mens);
}

function mostrarMensajeSmart(mens) {
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            // no hacemos nada solo queríamos mostrar em mensaje
            return;
        }
    });
}

function mostrarMensajeSmartSiNo(mens) {
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            return 'S';
        }
        if (ButtonPressed === "Cancelar") {
            return 'N';
        }
    });
}

var errorAjax = function (xhr, textStatus, errorThrwon) {
    var m = xhr.responseText;
    if (!m) m = "Error general posiblemente falla la conexión";
    mostrarMensajeSmart(m);
}

var errorAjaxSerial = function (xhr) {
    var m = xhr.responseText;
    if (!m) m = "Error general posiblemente falla la conexión";
    mostrarMensajeSmart(m);
}

// gup stands from Get Url Parameters
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results === null)
        return "";
    else
        return results[1];
}

/*
 *   Set and Get Cookies
 *   this funtions come from http://www.w3schools.com/js/js_cookies.asp
 *   they are used in forms in order to and retrieve
 *   field's values in a cookie
 */
function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}

function setCookie(c_name, value, exdays) {
    if (!are_cookies_enabled()) {
        alert("NO COOKIES");
    }
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function deleteCookie(c_name) {
    if (!are_cookies_enabled()) {
        alert("NO COOKIES");
    }
    document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}


function getVersionFooter() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/version",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // Regresa el mensaje
            if (!data.version) {
                mostrarMensaje('No se pudo obtener la versión ');
            }
            var a = data.version;
            $("#versionFooter").text(a);

        },
        error: function (xhr, textStatus, errorThrwon) {
            var m = xhr.responseText;
            if (!m) m = "Error general posiblemente falla la conexión";
            mostrarMensaje(m);
        }
    });
}

function controlBotones(trabajador) {
    if (trabajador.evaluador == null) {
        $("#evaluacion").css("visibility", "hidden");
    }
}


// ---------------- Moment related functions

function spanishDate(v) {
    var rd = moment(v).format('DD/MM/YYYY');
    if (rd == 'Invalid date') {
        rd = null;
    }
    return rd;
}

function spanishDbDate(v) {
    if (!v) {
        return null;
    }
    //var rd = moment(v, 'DD/MM/YYYY').format('YYYY-MM-DD');
    //if (rd == 'Invalid date') {
    //   rd = null;
    //}
    var v2 = v.split('/');
    rd = v2[2] + "-" + v2[1] + "-" + v2[0];
    return rd;
}

//-------------- DatePicker in Spanish
function datePickerSpanish() {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '&#x3C;Ant',
        nextText: 'Sig&#x3E;',
        currentText: 'Hoy',
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['es']);
}

//-------------- Select2 in Spanish
function select2Spanish() {
    return {
        allowClear: true,
        language: {
            errorLoading: function () {
                return "La carga falló";
            },
            inputTooLong: function (e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function (e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function () {
                return "Cargando más resultados…";
            },
            maximumSelected: function (e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando…";
            }
        }
    }
}

//---- numreoDbf
// Toma un número en formato imprimible español y lo pasa
// a formato guardable en base de datos.
function numeroDbf(n) {
    return n.replace('.', '').replace(',', '.');
}

// Initialize utilities
numeral.language('es', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'mm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        var b = number % 10;
        return (b === 1 || b === 3) ? 'er' :
            (b === 2) ? 'do' :
                (b === 7 || b === 0) ? 'mo' :
                    (b === 8) ? 'vo' :
                        (b === 9) ? 'no' : 'to';
    },
    currency: {
        symbol: '€'
    }
});

// // switch between languages
numeral.language('es');

// Own utilities
var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};


// Returns number of months between two dates
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// Montar una cuenta contable
var montarCuentaContable = function (inicio, final, numdigitos) {
    var s1 = '' + inicio + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1 + 1;
    var s2 = Array(n2).join('0');
    var codmacta = '' + inicio + s2 + final;
    return codmacta;
}

var mensError = function (mens) {
    // Building html response
    var html = mens
    html += sprintf("<div><small>%s</small></div>", "Haga clic en el mensaje para cerrarlo");
    $.smallBox({
        title: "ERROR",
        content: html,
        color: "#C46A69",
        iconSmall: "fa fa-warning shake animated",
    });
}

var mensNormal = function (mens) {
    // Building html response
    var html = mens
    html += sprintf("<div><small>%s</small></div>", "Haga clic en el mensaje para cerrarlo");
    $.smallBox({
        title: "AVISO",
        content: html,
        color: "#4E8975",
        iconSmall: "fa fa-warning shake animated"
    });
}

var mensErrorAjax = function (err) {
    var ms = "ERROR";
    if (err.readyState == 0) {
        ms = "Error general. Posiblemente falle la conexión.";
    }
    if (err.status == 401) {
        ms = "ERROR de autorización";
    }
    // comprobar para mensajes de borrado
    if (err.responseText) {
        // buscar texto
        if (/key constraint fails (.*), CONSTRAINT/.test(err.responseText)) {
            var a = err.responseText.match("key constraint fails\(.*), CONSTRAINT");
            var a2 = a[1].substring(2);
            ms = "No se puede eliminar, hay registros que dependen de este en la tabla: " + a2;
        }
    }
    // Building html response
    var html = ms + "<hr/>"
    html += sprintf("<div><strong>readyState: </strong>%s</div>", err.readyState);
    if (err.responseText) {
        html += sprintf("<div><strong>responseText: </strong>%s</div>", err.responseText);
    }
    html += sprintf("<div><strong>status: </strong>%s</div>", err.status);
    html += sprintf("<div><strong>statusText: </strong>%s</div>", err.statusText);
    html += "<hr/>";
    html += sprintf("<div><small>%s</small></div>", "Haga clic en el mensaje para cerrarlo");
    $.smallBox({
        title: "ERROR",
        content: html,
        color: "#C46A69",
        iconSmall: "fa fa-warning shake animated",
    });
}


var llamadaAjax = function (verbo, url, datos, fretorno) {
    var opciones = {
        type: verbo,
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            fretorno(null, data);
        },
        error: function (err) {
            mensErrorAjax(err);
            fretorno(err);
        }
    };
    if (datos) {
        opciones.data = JSON.stringify(datos);
    }
    $.ajax(opciones);
}

var mensajeAceptarCancelar = function (mensaje, fnAceptar, fnCancelar) {
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mensaje,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            fnAceptar();
        }
        if (ButtonPressed === "Cancelar") {
            fnCancelar();
        }
    });
}

var errorGeneral = function(err, done){
    if (done) return done(err);
    return err;
}