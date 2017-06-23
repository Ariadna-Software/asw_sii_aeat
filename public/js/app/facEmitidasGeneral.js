/*
 facEmitidas.js
 Funciones propias de la página FacEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiFacEmitidasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacEmitidasGeneral.datosPagina();
        ko.applyBindings(vm);

        $('#facEmitidas').attr('class', 'active');
        $('#facEmitidas-form').submit(function () { return false; });
        apiFacEmitidasGeneral.iniFacEmitidasTabla();

        $('#btnNuevo').click(apiFacEmitidasGeneral.nuevo);

        $('#cmbTiposBusqueda').select2(select2_languages[usuario.codigoIdioma]);
        apiFacEmitidasGeneral.cargarTiposBusqueda();
        $("#cmbTiposBusqueda").select2().on('change', function (e) {
            apiFacEmitidasGeneral.cambioTiposBusqueda(e.added);
        });
        var id = apiComunGeneral.gup("id");
        if (id && id != "") {
            apiFacEmitidasGeneral.cargarFacEmitidas(null, id);
        } else {
            apiFacEmitidasGeneral.cargarFacEmitidas("1");
        }
    },
    iniFacEmitidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facEmitidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "FacEmitidaId"
        }, {
            data: "NifEmisor"
        }, {
            data: "NombreEmisor"
        }, {
            data: "NifReceptor"
        }, {
            data: "NombreReceptor"
        }, {
            data: "NumFactura"
        }, {
            data: "FechaFactura",
            render: function (data, type, row) {
                var html = "";
                if (data) html = moment(data).format("DD/MM/YYYY");
                return html;
            }
        }, {
            data: "FechaOperacion",
            render: function (data, type, row) {
                var html = "";
                if (data) html = moment(data).format("DD/MM/YYYY");
                return html;
            }
        }, {
            data: "Importe"
        }, {
            data: "Enviada"
        }, {
            data: "Resultado"
        }, {
            data: "CSV"
        }, {
            data: "Mensaje"
        }, {
            data: "FacEmitidaId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacEmitidasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facEmitidas').DataTable(options);
        tabla.columns(0).visible(false);
        tabla.columns(11).visible(false);
        tabla.columns(12).visible(false);
    },
    datosPagina: function () {
        var self = this;
        // Tipos de búsqueda
        self.optionsTiposBusqueda = ko.observableArray([]);
        self.selectedTiposBusqueda = ko.observableArray([]);
        self.sTipoBusqueda = ko.observable();
    },
    cargarFacEmitidas: function (codigo, id) {
        var url = myconfig.apiUrl + "/api/facemitidas/";
        if (id) {
            url = myconfig.apiUrl + "/api/facemitidas/" + id;
        } else {
            switch (codigo) {
                case "1":
                    url = myconfig.apiUrl + "/api/facemitidas/pendientes/";
                    break;
                case "2":
                    url = myconfig.apiUrl + "/api/facemitidas/enviadas-incorrectas/";
                    break;
                case "3":
                    url = myconfig.apiUrl + "/api/facemitidas/enviadas-correctas/";
                    break;
                case "4":
                    url = myconfig.apiUrl + "/api/facemitidas/";
                    break;
            }
        }
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            if (data.length == undefined) {
                var data2 = [];
                data2.push(data);
                data = data2;
            }
            apiFacEmitidasGeneral.cargarFacEmitidasTabla(data);
        });
    },
    cargarFacEmitidasTabla: function (data) {
        var dt = $('#dt_facEmitidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function () {
        window.open(sprintf('FacEmitidasDetalle.html?id=%s', 0), '_self');
    },
    editar: function (id) {
        window.open(sprintf('FacEmitidasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function (id) {
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"), function () {
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/facemitidas/" + id, null, function (err) {
                if (err) return;
                apiFacEmitidasGeneral.cargarFacEmitidas();
            })
        }, function () { })
    },
    cargarTiposBusqueda: function () {
        options = [
            { "codigo": 1, "nombre": "Facturas pendientes" },
            { "codigo": 2, "nombre": "Facturas enviadas incorrectas" },
            { "codigo": 3, "nombre": "Facturas enviadas correctas" },
            { "codigo": 4, "nombre": "Todos los registros" }
        ];
        vm.optionsTiposBusqueda(options);
        $("#cmbTiposBusqueda").val([1]).trigger('change');
    },
    cambioTiposBusqueda: function (data) {
        if (!data) return;
        var codigo = data.id;
        apiFacEmitidasGeneral.cargarFacEmitidas(codigo);
    }
}


