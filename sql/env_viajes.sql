/*
SQLyog Community v12.4.1 (64 bit)
MySQL - 5.7.17-log : Database - aswsii
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`aswsii` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `aswsii`;

/*Table structure for table `envio_agencias_viajes` */

DROP TABLE IF EXISTS `envio_agencias_viajes`;

CREATE TABLE `envio_agencias_viajes` (
  `IDEnvioAgenciasViajes` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.7' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.7'' por eso tiene ese valor por defecto.',
  `CAB_Titular_NombreRazon` varchar(120) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRAgenciasViajes - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRAgenciasViajes - PeriodoImpositivo - Periodo\nPeridod que se informa, al ser anual debe ser 0A\n0A  = Anual',
  `REG_CNT_NombreRazon` varchar(120) NOT NULL COMMENT 'RegistroLRAgenciasViajes - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLRAgenciasViajes - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRAgenciasViajes - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRAgenciasViajes - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRAgenciasViajes - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_ImporteTotal` decimal(14,2) NOT NULL COMMENT 'RegistroLRAgenciasViajes - ImporteTotal\n Importes superiores a 6.000 euros que se hubieran percibido en metálico de la misma persona o entidad por las operaciones realizadas durante el año natural.',
  PRIMARY KEY (`IDEnvioAgenciasViajes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de operaciones agencias viajes al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_agencias_viajes` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
