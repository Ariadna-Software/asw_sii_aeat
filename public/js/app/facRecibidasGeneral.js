/*
 facRecibidas.js
 Funciones propias de la página FacRecibidas.html
*/

var usuario = apiComunGeneral.obtenerUsuario();
var data = null;

var apiFacRecibidasGeneral = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);

        vm = new apiFacRecibidasGeneral.datosPagina();
        ko.applyBindings(vm);

        $('#facRecibidas').attr('class', 'active');
        $('#facRecibidas-form').submit(function () { return false; });
        apiFacRecibidasGeneral.iniFacRecibidasTabla();

        $("#process").hide();
        $('#btnEnviar').click(apiFacRecibidasGeneral.enviar);

        $('#cmbTiposBusqueda').select2(select2_languages[usuario.codigoIdioma]);
        apiFacRecibidasGeneral.cargarTiposBusqueda();
        $("#cmbTiposBusqueda").select2().on('change', function (e) {
            apiFacRecibidasGeneral.cambioTiposBusqueda(e.added);
        });
        var id = apiComunGeneral.gup("id");
        if (id && id != "") {
            apiFacRecibidasGeneral.cargarFacRecibidas(null, id);
        } else {
            apiFacRecibidasGeneral.cargarFacRecibidas("1");
        }
    },
    iniFacRecibidasTabla: function () {
        var options = apiComunGeneral.initTableOptions('dt_facRecibidas', usuario.codigoIdioma);
        options.data = data;
        options.columns = [{
            data: "FacRecibidaId"
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
            data: "FacRecibidaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-primary' onclick='apiFacRecibidasGeneral.enviarUna(" + data + ");' title='Enviar registro'> <i class='fa fa-paper-plane fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='apiFacRecibidasGeneral.editar(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        options.fnRowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.Enviada == "0") {
                $('td', nRow).css('background-color', '#99ffbb');
            }
            if (aData.Resultado == "Incorrecto") {
                $('td', nRow).css('background-color', '#ffcccc');
            }
        }
        var tabla = $('#dt_facRecibidas').DataTable(options);
        // Apply the filter
        $("#dt_facRecibidas thead th input[type=text]").on('keyup change', function () {
            tabla
                .column($(this).parent().index() + ':visible')
                .search(this.value)
                .draw();
        });
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
    cargarFacRecibidas: function (codigo, id) {
        var url = myconfig.apiUrl + "/api/facrecibidas/";
        if (id) {
            url = myconfig.apiUrl + "/api/facrecibidas/" + id;
        } else {
            switch (codigo) {
                case "1":
                    url = myconfig.apiUrl + "/api/facrecibidas/pendientes/";
                    break;
                case "2":
                    url = myconfig.apiUrl + "/api/facrecibidas/enviadas-incorrectas/";
                    break;
                case "3":
                    url = myconfig.apiUrl + "/api/facrecibidas/enviadas-correctas/";
                    break;
                case "4":
                    url = myconfig.apiUrl + "/api/facrecibidas/";
                    break;
            }
        }
        if (!usuario.esAdministrador && usuario.nifTitular) {
            url += "?nifTitular=" + usuario.nifTitular;
        }
        apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
            if (err) return;
            if (data.length == undefined) {
                var data2 = [];
                data2.push(data);
                data = data2;
            }
            apiFacRecibidasGeneral.cargarFacRecibidasTabla(data);
        });
    },
    cargarFacRecibidasTabla: function (data) {
        var dt = $('#dt_facRecibidas').dataTable();
        dt.fnClearTable();
        if (data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },
    enviar: function () {
        $("#btnEnviar").hide();
        $("#process").show();
        var url = myconfig.apiUrl + "/api/facrecibidas/enviar";
        if (!usuario.esAdministrador && usuario.nifTitular) {
            url += "?nifTitular=" + usuario.nifTitular;
        }
        apiComunAjax.llamadaGeneral("POST", url, null, function (err, data) {
            if (err) return;
            $("#btnEnviar").show();
            $("#process").hide();
            apiComunNotificaciones.mensajeAyuda("Se han procesado todos los registros de presentación, seguirá viendo en pendientes aquellos que hayna dado algún tipo de error.");
            url = myconfig.apiUrl + "/api/facrecibidas/pendientes/";
            if (!usuario.esAdministrador && usuario.nifTitular) {
                url += "?nifTitular=" + usuario.nifTitular;
            }
            apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
                if (err) return;
                if (data.length == undefined) {
                    var data2 = [];
                    data2.push(data);
                    data = data2;
                }
                apiFacRecibidasGeneral.cargarFacRecibidasTabla(data);
            });
        });
    },
    editar: function (id) {
        window.open(sprintf('FacRecibidasDetalle.html?id=%s', id), '_self');
    },
    eliminar: function (id) {
        apiComunNotificaciones.mensajeAceptarCancelar(i18n.t("eliminar_pregunta"), function () {
            apiComunAjax.llamadaGeneral("DELETE", myconfig.apiUrl + "/api/facrecibidas/" + id, null, function (err) {
                if (err) return;
                apiFacRecibidasGeneral.cargarFacRecibidas();
            })
        }, function () { })
    },
    cargarTiposBusqueda: function () {
        options = [
            { "codigo": 1, "nombre": "Facturas pendientes" },
            { "codigo": 2, "nombre": "Facturas enviadas incorrectas" },
            { "codigo": 3, "nombre": "Facturas enviadas correctas" },
            { "codigo": 4, "nombre": "Todos las facturas" }
        ];
        vm.optionsTiposBusqueda(options);
        $("#cmbTiposBusqueda").val([1]).trigger('change');
    },
    cambioTiposBusqueda: function (data) {
        if (!data) return;
        var codigo = data.id;
        apiFacRecibidasGeneral.cargarFacRecibidas(codigo);
    },
    enviarUna: function (id) {
        $("#btnEnviar").hide();
        $("#process").show();
        var url = myconfig.apiUrl + "/api/facrecibidas/enviar";
        url += "?facId=" + id;
        apiComunAjax.llamadaGeneral("POST", url, null, function (err, data) {
            if (err) return;
            $("#btnEnviar").show();
            $("#process").hide();
            apiComunNotificaciones.mensajeAyuda("Se han procesado todos los registros de presentación, seguirá viendo en pendientes aquellos que hayna dado algún tipo de error.");
            url = myconfig.apiUrl + "/api/facrecibidas/pendientes/";
            if (!usuario.esAdministrador && usuario.nifTitular) {
                url += "?nifTitular=" + usuario.nifTitular;
            }
            apiComunAjax.llamadaGeneral("GET", url, null, function (err, data) {
                if (err) return;
                if (data.length == undefined) {
                    var data2 = [];
                    data2.push(data);
                    data = data2;
                }
                apiFacRecibidasGeneral.cargarFacRecibidasTabla(data);
            });
        });
    },    
}


