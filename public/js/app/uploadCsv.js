/*
 index.js
 Funciones propias de la página index.html
*/

var usuario = apiComunGeneral.obtenerUsuario();

var apiUploadCsv = {
    ini: function () {
        apiComunGeneral.initPage(usuario);
        apiComunAjax.establecerClave(usuario.apiKey);
        
        vm = new apiUploadCsv.datosPagina();
        ko.applyBindings(vm);

        $('#inicio').attr('class', 'active');
        apiComunAjax.llamadaGeneral("GET", myconfig.apiUrl + "/version", null, function (err, data) {
            if (err) return;
        });
        $('#uploadcsv').submit(function () { return false; });
        $('#cmbTipos').select2(select2_languages[usuario.codigoIdioma]);
        apiUploadCsv.cargarTipos();
        $('#btnUpload').on('click', function () {
            $('#upload-input').click();
            $('.progress-bar').text('0%');
            $('.progress-bar').width('0%');
        });
        $('#upload-input').on('change', function () {

            var files = $(this).get(0).files;

            if (files.length > 0) {
                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                var formData = new FormData();

                // loop through all the selected files and add them to the formData object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    // add the files to formData object for the data payload
                    formData.append('uploads[]', file, file.name);
                }

                $.ajax({
                    url: '/api/upload',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log('upload successful!\n' + data);
                    },
                    xhr: function () {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();

                        // listen to the 'progress' event
                        xhr.upload.addEventListener('progress', function (evt) {

                            if (evt.lengthComputable) {
                                // calculate the percentage of upload completed
                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);

                                // update the Bootstrap progress bar with the new percentage
                                $('.progress-bar').text(percentComplete + '%');
                                $('.progress-bar').width(percentComplete + '%');

                                // once the upload reaches 100%, set the progress bar text to done
                                if (percentComplete === 100) {
                                    $('.progress-bar').html('Fichero subido');
                                }

                            }

                        }, false);

                        return xhr;
                    }
                });

            }
        });
    },
    datosPagina: function () {
        var self = this;
        self.optionsTipos = ko.observableArray([]);
        self.selectedTipos = ko.observableArray([]);
        self.sTipo = ko.observable();
    },
    cargarTipos: function () {
        options = [
            { "codigo": 1, "nombre": "Facturas emitidas" },
            { "codigo": 2, "nombre": "Facturas recibidas" }
        ];
        vm.optionsTipos(options);
        $("#cmbTipos").val([1]).trigger('change');
    }
}


