console.log("(C) Ariadna Software SL // SII");
console.log("-- NODE SII START --");
var soap = require('soap');
var fs = require('fs');


var url = 'http://www.agenciatributaria.es/static_files/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Modelos_y_formularios/Suministro_inmediato_informacion/FicherosSuministros/V_06/SuministroFactEmitidas.wsdl';
// var url = 'http://www.agenciatributaria.es/static_files/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Modelos_y_formularios/Suministro_inmediato_informacion/FicherosSuministros/V_06/SuministroPagosRecibidas.wsdl';
soap.createClient(url, function (err, client) {
    if (err) {
        console.log(err);
    } else {
        // var input = obb.siiService.SuministroFactEmitidasPruebas.ConsultaLRFacturasEmitidas.input;
        // var myInput = input;
        myInputConsultaFact = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                }
            },
            FiltroConsulta: {
                PeriodoImpositivo: {
                    Ejercicio: "2017",
                    Periodo: "02"
                }
            }
        };
        myInputFacNormal = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                },
                TipoComunicacion: "A1"
            },
            RegistroLRFacturasEmitidas: 
                {
                    PeriodoImpositivo: {
                        Ejercicio: "2017",
                        Periodo: "02"
                    },
                    IDFactura: {
                        IDEmisorFactura: {
                            NIF: "B96470190"
                        },
                        NumSerieFacturaEmisor: "PR00015",
                        FechaExpedicionFacturaEmisor: "21-02-2017"
                    },
                    FacturaExpedida: {
                        TipoFactura: "F1",
                        ClaveRegimenEspecialOTrascendencia: "01",
                        ImporteTotal: 26.70,
                        DescripcionOperacion: "PRUEBA 15",
                        Contraparte: {
                            NombreRazon: "CLIENTE DE PRUEBA",
                            NIF: "F46026696"
                        },
                        TipoDesglose: {
                            DesgloseFactura: {
                                Sujeta: {
                                    NoExenta: {
                                        TipoNoExenta: "S1",
                                        DesgloseIVA: {
                                            DetalleIVA: [
                                                {
                                                    TipoImpositivo: 21,
                                                    BaseImponible: 100,
                                                    CuotaRepercutida: 21,
                                                    TipoRecargoEquivalencia: 0,
                                                    CuotaRecargoEquivalencia: 0
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        };
        myInputFacAnula = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                }
            },
            RegistroLRBajaExpedidas: [
                {
                    PeriodoImpositivo: {
                        Ejercicio: "2017",
                        Periodo: "02"
                    },
                    IDFactura: {
                        IDEmisorFactura: {
                            NIF: "B96470190"
                        },
                        NumSerieFacturaEmisor: "PR00006",
                        FechaExpedicionFacturaEmisor: "25-02-2017"
                    }
                }
            ]
        };
        myInputFacDesglose = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                },
                TipoComunicacion: "A0"
            },
            RegistroLRFacturasEmitidas: [
                {
                    PeriodoImpositivo: {
                        Ejercicio: "2017",
                        Periodo: "02"
                    },
                    IDFactura: {
                        IDEmisorFactura: {
                            NIF: "B96470190"
                        },
                        NumSerieFacturaEmisor: "PR00009",
                        FechaExpedicionFacturaEmisor: "25-02-2017"
                    },
                    FacturaExpedida: {
                        TipoFactura: "F1",
                        ClaveRegimenEspecialOTrascendencia: "01",
                        DescripcionOperacion: "PRUEBA 8",
                        Contraparte: {
                            NombreRazon: "CLIENTE DE PRUEBA",
                            NIF: "F46026696"
                        },
                        TipoDesglose: {
                            DesgloseTipoOperacion: {
                                PrestacionServicios: {
                                    Sujeta: {
                                        NoExenta: {
                                            TipoNoExenta: "S1",
                                            DesgloseIVA: {
                                                DetalleIVA: {
                                                    TipoImpositivo: 21,
                                                    BaseImponible: 118.5,
                                                    CuotaRepercutida: 31.5
                                                }
                                            }
                                        }
                                    }
                                },
                                Entrega: {
                                    Sujeta: {
                                        NoExenta: {
                                            TipoNoExenta: "S2",
                                            DesgloseIVA: {
                                                DetalleIVA: {
                                                    TipoImpositivo: 21,
                                                    BaseImponible: 74.34,
                                                    CuotaRepercutida: 15.61
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        myInputFacSimplificada = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                },
                TipoComunicacion: "A0"
            },
            RegistroLRFacturasEmitidas: [
                {
                    PeriodoImpositivo: {
                        Ejercicio: "2017",
                        Periodo: "02"
                    },
                    IDFactura: {
                        IDEmisorFactura: {
                            NIF: "B96470190"
                        },
                        NumSerieFacturaEmisor: "SM00001",
                        FechaExpedicionFacturaEmisor: "10-02-2017"
                    },
                    FacturaExpedida: {
                        TipoFactura: "F2",
                        ClaveRegimenEspecialOTrascendencia: "01",
                        ImporteTotal: 26.70,
                        DescripcionOperacion: "Ticket SM00011",
                        TipoDesglose: {
                            DesgloseFactura: {
                                Sujeta: {
                                    NoExenta: {
                                        TipoNoExenta: "S1",
                                        DesgloseIVA: {
                                            DetalleIVA: [
                                                {
                                                    TipoImpositivo: 21,
                                                    BaseImponible: 22.07,
                                                    CuotaRepercutida: 4.63,
                                                    TipoRecargoEquivalencia: 0,
                                                    CuotaRecargoEquivalencia: 0
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        myInputFacRectificativa = {
            Cabecera: {
                IDVersionSii: "0.6",
                Titular: {
                    NombreRazon: "Ariadna Software SL",
                    NIF: "B96470190"
                },
                TipoComunicacion: "A1"
            },
            RegistroLRFacturasEmitidas: [
                {
                    PeriodoImpositivo: {
                        Ejercicio: "2017",
                        Periodo: "02"
                    },
                    IDFactura: {
                        IDEmisorFactura: {
                            NIF: "B96470190"
                        },
                        NumSerieFacturaEmisor: "REC00001",
                        FechaExpedicionFacturaEmisor: "21-02-2017"
                    },
                    FacturaExpedida: {
                        TipoFactura: "R1",
                        TipoRectificativa: "S",
                        FacturasRectificadas: {
                            IDFacturaRectificada: {
                                NumSerieFacturaEmisor: "PR00011",
                                FechaExpedicionFacturaEmisor: "21-02-2017"
                            }
                        },
                        ImporteRectificacion: {
                            BaseRectificada: 22.07,
                            CuotaRectificada: 4.63
                        },
                        ClaveRegimenEspecialOTrascendencia: "01",
                        DescripcionOperacion: "RECTIFICO UNA DE UN CLIENTE",
                        Contraparte: {
                            NombreRazon: "CLIENTE DE PRUEBA",
                            NIF: "F46026696"
                        },
                        TipoDesglose: {
                            DesgloseFactura: {
                                Sujeta: {
                                    NoExenta: {
                                        TipoNoExenta: "S1",
                                        DesgloseIVA: {
                                            DetalleIVA: [
                                                {
                                                    TipoImpositivo: 21,
                                                    BaseImponible: 22.07,
                                                    CuotaRepercutida: 4.63,
                                                    TipoRecargoEquivalencia: 0,
                                                    CuotaRecargoEquivalencia: 0
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
        client.wsdl.definitions.xmlns.ns1 = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/ssii/fact/ws/SuministroInformacion.xsd";
        client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap()
        client.setSecurity(new soap.ClientSSLSecurityPFX("/tmp/ariadna_sii.pfx", "passsii"));
        // client.siiService.SuministroFactEmitidasPruebas.AnulacionLRFacturasEmitidas(myInputFacAnula, function (err, result, raw, soapHeader) {
        //     if (err) {
        //     }
        //     console.log(client.lastRequest);
        // });        
        client.siiService.SuministroFactEmitidasPruebas.SuministroLRFacturasEmitidas(myInputFacNormal, function (err, result, raw, soapHeader) {
            if (err) {
            }
            console.log(client.lastRequest);
        });
        // client.siiService.SuministroFactEmitidasPruebas.ConsultaLRFacturasEmitidas(myInputConsultaFact, function (err, result, raw, soapHeader) {
        //     if (err) {
        //         // console.log(err);
        //         // console.log(raw);
        //     }
        //     fs.writeFileSync('/tmp/resultCons.json', JSON.stringify(result, null, 2));
        //     console.log(client.lastRequest);
        // })
    }
});