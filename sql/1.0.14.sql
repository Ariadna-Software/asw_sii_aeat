DROP TABLE relfacemit;
DROP TABLE reffacrec;
ALTER TABLE `aswsii`.`envio_facturas_emitidas`   
  CHANGE `REG_FE_CNT_NIF` `REG_FE_CNT_NIF` VARCHAR(9) CHARSET utf8 COLLATE utf8_general_ci NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas';
ALTER TABLE `aswsii`.`envio_facturas_recibidas`   
  CHANGE `REG_FR_CNT_NIF` `REG_FR_CNT_NIF` VARCHAR(9) CHARSET utf8 COLLATE utf8_general_ci NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - NIF\nIdentificador del NIF de la contraparte de la operación. Proveedor en facturas recibidas';
