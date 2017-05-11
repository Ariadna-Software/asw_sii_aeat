/*
 login.js
 Funciones propias de la página login.html
*/

var vm;

var apiPaginaLogin = {
    ini: function () {
        apiComunGeneral.iniLogin();
        vm = new this.datosPagina();
        ko.applyBindings(vm);
        $("#btnLogin").click(this.btnLogin);
        $("#login-form").submit(function () { return false; });
        apiPaginaLogin.getVersion();
    },
    datosPagina: function () {
        var self = this;
        self.login = ko.observable();
        self.password = ko.observable();
    },
    btnLogin: function () {
        if (!apiPaginaLogin.datosOK()) return;
        var data = {
            "usuario": {
                "login": vm.login(),
                "password": vm.password()
            }
        };
        apiPaginaLogin.lanzarLogin(data);
    },
    datosOK: function () {
        $('#login-form').validate({
            rules: {
                login: { required: true },
                password: { required: true }
            },
            messages: {
                login: {
                    required: i18n.t("login.valLogin")

                },
                password: {
                    required: i18n.t("login.valPassword")
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#login-form').valid();
    },
    lanzarLogin: function (data) {
        apiComunAjax.llamadaGeneral("POST", myconfig.apiUrl + "/login/clave", data, function (err, data) {
            if (err) return;
            if (!data) {
                this.mostrarMensaje('Login y/o password incorrectos');
            } else {
                var a = data;
                apiComunGeneral.setCookie("usuario", JSON.stringify(a), 1)
                window.open('Index.html', '_self');
            }
        });
    },
    mostrarMensaje: function (mensaje) {
        $("#mensaje").text(mens);
    },
    getVersion: function(){
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/version", null, function(err, data){
            if (err) return;
            if (!data.version) return this.mostrarMensaje('No se pudo obtener version');
            $("#version").text(data.version);
        });
    }
}




