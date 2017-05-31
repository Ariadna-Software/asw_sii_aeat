/*
 facturasRecibidas.js
 Funciones propias de la página FacturasRecibidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiFacturasRecibidasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacturasRecibidasGeneral.datosPagina();
        ko.applyBindings(vm);

        $('#facturasRecibidas').attr('class', 'active');
        $('#facturasRecibidas-form').submit(function () { return false; });
        apiFacturasRecibidasGeneral.iniFacturasRecibidasTabla();
        apiFacturasRecibidasGeneral.cargarFacturasRecibidas("1");
        $('#btnNuevo').click(apiFacturasRecibidasGeneral.nuevo);

        $('#cmbTiposBusqueda').select2(select2_languages[usuario.codigoIdioma]);
        apiFacturasRecibidasGeneral.cargarTiposBusqueda();
        $("#cmbTiposBusqueda").select2().on('change', function (e) {
            apiFacturasRecibidasGeneral.cambioTiposBusqueda(e.added);
        });
    },
    iniFacturasRecibidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facturasRecibidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "IDEnvioFacturasRecibidas"
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
            data: "IDEnvioFacturasRecibidas",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='apiFacturasRecibidasGeneral.eliminar(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='apiFacturasRecibidasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_facturasRecibidas').DataTable(options);
        tabla.columns(0).visible(false);
    },
    datosPagina: function () {
        var self = this;
        // Tipos de búsqueda
        self.optionsTiposBusqueda = ko.observableArray([]);
        self.selectedTiposBusqueda = ko.observableArray([]);
        self.sTipoBusqueda = ko.observable();
    },
    cargarFacturasRecibidas: function (codigo) {
        var url = myconfig.apiUrl + "/api/facturasRecibidas/";
        switch (codigo) {
            case "1":
                url = myconfig.apiUrl + "/api/facturasRecibidas/pendientes/";
                break;
            case "2":
                url = myconfig.apiUrl + "/api/facturasRecibidas/enviados-incorrectos/";
                break;
            case "3":
                url = myconfig.apiUrl + "/api/facturasRecibidas/enviados-correctos/";
                break;
            case "4":
                url = myconfig.apiUrl + "/api/facturasRecibidas/";
                break;
        }
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            apiFacturasRecibidasGeneral.cargarFacturasRecibidasTabla(data);
        });
    },
    cargarFacturasRecibidasTabla: function (data) {
        var dt = $('#dt_facturasRecibidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    nuevo: function () {
        window.open(sprintf('FacturasRecibidasDetalle.html?id=%s', 0), '_self');
    },
    editar: function (id) {
        window.open(sprintf('FacturasRecibidasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function (id) {
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"), function () {
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/facturasRecibidas/" + id, null, function (err) {
                if (err) return;
                apiFacturasRecibidasGeneral.cargarFacturasRecibidas();
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
        apiFacturasRecibidasGeneral.cargarFacturasRecibidas(codigo);
    }
}


