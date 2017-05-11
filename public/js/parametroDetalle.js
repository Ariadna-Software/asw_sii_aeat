/*-------------------------------------------------------------------------- 
parametroDetalle.js
Funciones js par la página ParametroDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmParametro").submit(function() {
        return false;
    });

    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros/0",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // hay que mostrarlo en la zona de datos
            loadData(data);
        },
                        error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
    });
}

function admData() {
    var self = this;
    self.parametroId = ko.observable();
    self.tituloPush = ko.observable();
    self.appId = ko.observable();
    self.restApi = ko.observable();
    self.gcm = ko.observable();
}

function loadData(data) {
    vm.parametroId(data.parametroId);
    vm.tituloPush(data.tituloPush);
    vm.appId(data.appId);
    vm.restApi(data.restApi);
    vm.gcm(data.gcm);
}

function datosOK() {

    $('#frmParametro').validate({
        rules: {
            txtTituloPush: {
                required: true
            },
            txtAppId: {
                required: true
            },
            txtGcm: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtTituloPush: {
                required: 'Introduzca el titulo push'
            },
            txtAppId: {
                required: 'Introduzca la id de app'
            },
            txtGcm: {
                required: 'Introduzca el correo'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmParametro").validate().settings;
    return $('#frmParametro').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            parametro: {
                "parametroId": 0,
                "appId": vm.appId(),
                "gcm": vm.gcm(),
                "tituloPush": vm.tituloPush(),
                "restApi": vm.restApi()
            }
        };

        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/parametros/0",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                // Nos volvemos al general
                var url = "Index.html";
                window.open(url, '_self');
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "Index.html";
        window.open(url, '_self');
    }
    return mf;
}
