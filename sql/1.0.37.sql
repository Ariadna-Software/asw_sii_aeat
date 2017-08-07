ALTER TABLE `facemitidas`   
  ADD COLUMN `Ejercicio` VARCHAR(4) NULL AFTER `UltRegistroID`,
  ADD COLUMN `Periodo` VARCHAR(2) NULL AFTER `Ejercicio`;

ALTER TABLE `facrecibidas`   
  ADD COLUMN `Ejercicio` VARCHAR(4) NULL AFTER `UltRegistroID`,
  ADD COLUMN `Periodo` VARCHAR(2) NULL AFTER `Ejercicio`;
  
  
 UPDATE facemitidas AS f, envio_facturas_emitidas AS rf
 SET f.Ejercicio = rf.REG_PI_Ejercicio, f.Periodo = rf.REG_PI_Periodo
 WHERE rf.IDEnvioFacturasEmitidas = f.UltRegistroID;
 
  UPDATE facrecibidas AS f, envio_facturas_recibidas AS rf
 SET f.Ejercicio = rf.REG_PI_Ejercicio, f.Periodo = rf.REG_PI_Periodo
 WHERE rf.IDEnvioFacturasRecibidas = f.UltRegistroID;