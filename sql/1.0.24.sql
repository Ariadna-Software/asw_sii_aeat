# crear los titulares a partir de las faturas de pruebas.
INSERT INTO titulares (nifTitular, nombreRazon)
SELECT DISTINCT	 nifEmisor, nombreEmisor FROM facemitidas;

# crear los campos adicionales para control de emisarios
ALTER TABLE `aswsii`.`usuarios`   
  ADD COLUMN `titularId` INT(11) NULL AFTER `esAdministrador`,
  ADD COLUMN `verFacEmitidas` BOOL DEFAULT TRUE NULL AFTER `titularId`,
  ADD COLUMN `verFacRecibidas` BOOL DEFAULT TRUE NULL AFTER `verFacEmitidas`,
  ADD CONSTRAINT `usuarios_titulares` FOREIGN KEY (`titularId`) REFERENCES `aswsii`.`titulares`(`titularId`);
