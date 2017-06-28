ALTER TABLE `aswsii`.`envio_facturas_emitidas`   
  CHANGE `REG_FE_CNT_NombreRazon` `REG_FE_CNT_NombreRazon` VARCHAR(120) CHARSET utf8 COLLATE utf8_general_ci NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.';
ALTER TABLE `aswsii`.`envio_facturas_recibidas`   
  CHANGE `REG_FR_CNT_NombreRazon` `REG_FR_CNT_NombreRazon` VARCHAR(120) CHARSET utf8 COLLATE utf8_general_ci NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación. Proveedor en facturas recibidas';
