/*
 comun.general.js
 Funciones comunes a todas las páginas de manera general
*/

// table managment related
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var apiComunGeneral = {
    obtenerUsuario: function () {
        var usuario = apiComunGeneral.getCookie('usuario');
        if (!usuario) return null;
        return JSON.parse(usuario);
    },
    iniLogin: function () {
        // Inicialización específica de la página de login
        apiComunIdiomas.iniIdiomas();
    },
    initPage: function (usuario) {
        if (!usuario || usuario == null) window.open('login.html', '_self');
        var expTime = moment(usuario.expKeyTime);
        var ahora = moment(new Date());
        if (ahora > expTime) window.open('login.html', '_self');

        pageSetUp();

        var lg = i18n.lng();
        if (usuario.codigoIdioma) lg = usuario.codigoIdioma;

        i18n.init({ lng: lg }, function (t) { $('.I18N').i18n(); });

        var flag = "flag flag-es";
        var lgn = "ES";
        switch (lg) {
            case "en":
                flag = "flag flag-us";
                lgn = "EN";
                break;
        };
        $('#language-flag').attr('class', flag);
        $('#language-abrv').text(lgn);
        validator_languages(lg);
        datepicker_languages(lg);

        apiComunGeneral.getVersion();
        $("#nombreUsuario").text(usuario.nombre);

        apiComunGeneral.controlPermisos(usuario);
    },
    getVersion: function () {
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/version", null, function (err, data) {
            if (err) return;
            if (!data.version) return this.mostrarMensaje('No se pudo obtener version');
            $("#version").text(data.version);
        });
    },
    mostrarMensaje: function (mensaje) {
        $("#mensaje").text(mens);
    },
    areCookiesEnabled: function () {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
            document.cookie = "testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
        }
        return (cookieEnabled);
    },
    setCookie: function (c_name, value, exdays) {
        if (!this.areCookiesEnabled()) {
            alert("NO COOKIES");
        }
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },
    deleteCookie: function (c_name) {
        if (!this.areCookiesEnabled()) {
            alert("NO COOKIES");
        }
        document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },
    initTableOptions: function (table, lang) {
        var options = {
            "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l C T >r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
            "oColVis": {
                "buttonText": "Mostrar / ocultar columnas"
            },
            "oTableTools": {
                "aButtons": [
                    {
                        "sExtends": "pdf",
                        "sTitle": "Registros Seleccionadas",
                        "sPdfMessage": "proasistencia PDF Export",
                        "sPdfSize": "A4",
                        "sPdfOrientation": "landscape",
                        "oSelectorOpts": { filter: 'applied', order: 'current' }
                    },
                    {
                        "sExtends": "copy",
                        "sMessage": "Registros filtradas <i>(pulse Esc para cerrar)</i>",
                        "oSelectorOpts": { filter: 'applied', order: 'current' }
                    },
                    {
                        "sExtends": "csv",
                        "sMessage": "Registros filtradas <i>(pulse Esc para cerrar)</i>",
                        "oSelectorOpts": { filter: 'applied', order: 'current' }
                    },
                    {
                        "sExtends": "xls",
                        "sMessage": "Registros filtradas <i>(pulse Esc para cerrar)</i>",
                        "oSelectorOpts": { filter: 'applied', order: 'current' }
                    },
                    {
                        "sExtends": "print",
                        "sMessage": "Registros filtradas <i>(pulse Esc para cerrar)</i>",
                        "oSelectorOpts": { filter: 'applied', order: 'current' }
                    }
                ],
                "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
            },
            "autoWidth": true,
            "preDrawCallback": function () {
                // Initialize the responsive datatables helper once.
                if (!responsiveHelper_dt_basic) {
                    responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#' + table), breakpointDefinition);
                }
            },
            "rowCallback": function (nRow) {
                responsiveHelper_dt_basic.createExpandIcon(nRow);
            },
            "drawCallback": function (oSettings) {
                responsiveHelper_dt_basic.respond();
            },
            "language": datatable_languages()[lang]
        };
        // change serach, it doesn't matter language
        options.language.search = '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>';
        return options;
    },
    gup: function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results === null)
            return "";
        else
            return results[1];
    },
    controlPermisos: function (usuario) {
        if (!usuario.esAdministrador) {
            $("#administracion").hide();
        }
    },
    redondeo2Decimales: function (num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
}