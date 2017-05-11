/*  
 comun.idiomas.js
 Funciones comunes de manejo de idiomas
*/
var apiComunIdiomas = {
    iniIdiomas: function () {
        i18n.init({}, function (t) {
            $('.I18N').i18n();
        });
        var lng = i18n.lng();
        validator_languages(lng);
    },
    cambiaIdioma: function (lg) {
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
        validator_languages(lgn);
    }
}