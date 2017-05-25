/*
 facturasEmitidas.js
 Funciones propias de la página FacturasEmitidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiFacturasEmitidasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacturasEmitidasGeneral.datosPagina();
        ko.applyBindings(vm);

        $('#facturasEmitidas').attr('class', 'active');
        $('#facturasEmitidas-form').submit(function () { return false; });
        apiFacturasEmitidasGeneral.iniFacturasEmitidasTabla();
        apiFacturasEmitidasGeneral.cargarFacturasEmitidas("1");
        $('#btnNuevo').click(apiFacturasEmitidasGeneral.nuevo);

        $('#cmbTiposBusqueda').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasEmitidasGeneral.cargarTiposBusqueda();
        $("#cmbTiposBusqueda").select2().on('change', function (e) {
            apiFacturasEmitidasGeneral.cambioTiposBusqueda(e.added);
        });
    },
    iniFacturasEmitidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facturasEmitidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "IDEnvioFacturasEmitidas"
        }, {
            data: "Origen"
        }, {
            data: "REG_PI_Ejercicio"
        }, {
            data: "REG_PI_Periodo"
        }, {
            data: "REG_IDF_IDEF_NIF"
        }, {
            data: "REG_IDF_NumSerieFacturaEmisor"
        }, {
            data: "FechaHoraCreacion",
            render: function (data, type, row) {
                var html = moment(data).format("DD/MM/YYYY");
                return html;
            }
        }, {
            data: "EnvioInmediato"
        }, {
            data: "Enviada"
        }, {
            data: "Resultado"
        }, {
            data: "CSV"
        }, {
            data: "Mensaje"
        }, {
            data: "IDEnvioFacturasEmitidas",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiFacturasEmitidasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacturasEmitidasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facturasEmitidas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    datosPagina: function () {
        var self = this;
        // Tipos de búsqueda
        self.optionsTiposBusqueda = ko.observableArray([]);
        self.selectedTiposBusqueda = ko.observableArray([]);
        self.sTipoBusqueda = ko.observable();
    },
    cargarFacturasEmitidas: function (codigo) {
        var url = myconfig.apiUrl + "/api/facturasEmitidas/";
        switch (codigo) {
            case "1":
                url = myconfig.apiUrl + "/api/facturasEmitidas/pendientes/";
                break;
            case "2":
                url = myconfig.apiUrl + "/api/facturasEmitidas/enviados-incorrectos/";
                break;
            case "3":
                url = myconfig.apiUrl + "/api/facturasEmitidas/enviados-correctos/";
                break;
            case "4":
                url = myconfig.apiUrl + "/api/facturasEmitidas/";
                break;
        }
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            apiFacturasEmitidasGeneral.cargarFacturasEmitidasTabla(data);
        });
    },
    cargarFacturasEmitidasTabla: function (data) {
        var dt = $('#dt_facturasEmitidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function () {
        window.open(sprintf('FacturasEmitidasDetalle.html?id=%s', 0), '_self');
    },
    editar: function (id) {
        window.open(sprintf('FacturasEmitidasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function (id) {
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"), function () {
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/facturasEmitidas/" + id, null, function (err) {
                if (err) return;
                apiFacturasEmitidasGeneral.cargarFacturasEmitidas();
            })
        }, function () { })
    },
    cargarTiposBusqueda: function () {
        options = [
            { "codigo": 1, "nombre": "Registros pendientes de envío" },
            { "codigo": 2, "nombre": "Registros enviados incorrectos" },
            { "codigo": 3, "nombre": "Registros enviados correctos" },
            { "codigo": 4, "nombre": "Todos los registros" }
        ];
        vm.optionsTiposBusqueda(options);
        $("#cmbTiposBusqueda").val([1]).trigger('change');
    },
    cambioTiposBusqueda: function (data) {
        if (!data) return;
        var codigo = data.id;
        apiFacturasEmitidasGeneral.cargarFacturasEmitidas(codigo);
    }
}


