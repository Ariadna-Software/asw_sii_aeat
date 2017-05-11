// Initialize utilities
numeral.language('es', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    currency: {
        symbol: '€'
    }
});

// // switch between languages
numeral.language('es');

// Own utilities
var roundToTwo = function (num) {    
    return +(Math.round(num + "e+2")  + "e-2");
};