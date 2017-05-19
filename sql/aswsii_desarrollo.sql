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

/*Table structure for table `anulacion_bienes_inversion` */

DROP TABLE IF EXISTS `anulacion_bienes_inversion`;

CREATE TABLE `anulacion_bienes_inversion` (
  `IDAnulacionBienesInversion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\nACPERR: Aceptado con errores. A pesar de que el envío ha sido aceptado contiene \n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRBajaBienesInversion - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRBajaBienesInversion - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NombreRazon` varchar(9) NOT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - IDEmisorFactura - NombreRazon\nNombre / Razón solicial del emisor de la factura recibida',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRBajaBienesInversion - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  PRIMARY KEY (`IDAnulacionBienesInversion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `anulacion_bienes_inversion` */

/*Table structure for table `anulacion_cobros_metalico` */

DROP TABLE IF EXISTS `anulacion_cobros_metalico`;

CREATE TABLE `anulacion_cobros_metalico` (
  `IDAnulacionCobrosMetalico` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRCobrosMetalico - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRCobrosMetalico - PeriodoImpositivo - Periodo\nPeridod que se informa, al ser anual debe ser 0A\n0A  = Anual',
  `REG_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  PRIMARY KEY (`IDAnulacionCobrosMetalico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `anulacion_cobros_metalico` */

/*Table structure for table `anulacion_facturas_emitidas` */

DROP TABLE IF EXISTS `anulacion_facturas_emitidas`;

CREATE TABLE `anulacion_facturas_emitidas` (
  `IDAnulacionFacturasEmitidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.7' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.7'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - IDEmisorFactura - NIF\nNIF asociado al emisor de la factura.',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  PRIMARY KEY (`IDAnulacionFacturasEmitidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `anulacion_facturas_emitidas` */

/*Table structure for table `anulacion_facturas_recibidas` */

DROP TABLE IF EXISTS `anulacion_facturas_recibidas`;

CREATE TABLE `anulacion_facturas_recibidas` (
  `IDAnulacionFacturasrecibidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRBajaRecibidas - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRBajaRecibidas - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NombreRazon` varchar(9) NOT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - IDEmisorFactura - NombreRazon\nNombre / Razón solicial del emisor de la factura recibida',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRBajaRecibidas - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  PRIMARY KEY (`IDAnulacionFacturasrecibidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `anulacion_facturas_recibidas` */

/*Table structure for table `anulacion_operaciones_intracomunitarias` */

DROP TABLE IF EXISTS `anulacion_operaciones_intracomunitarias`;

CREATE TABLE `anulacion_operaciones_intracomunitarias` (
  `IDAnulacionOperacionesIntracomunitarias` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NombreRazon` varchar(9) NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - NombreRazon\nNombre / Razón solicial del emisor de la factura recibida',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRBajaDetOperacionIntracomunitaria - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  PRIMARY KEY (`IDAnulacionOperacionesIntracomunitarias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `anulacion_operaciones_intracomunitarias` */

/*Table structure for table `anulacion_operaciones_seguros` */

DROP TABLE IF EXISTS `anulacion_operaciones_seguros`;

CREATE TABLE `anulacion_operaciones_seguros` (
  `IDAnulacionOperacionesSeguros` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLROperacionesSeguros - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLROperacionesSeguros - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:0A  = Anual',
  `REG_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_ClaveOperacion` decimal(14,2) NOT NULL COMMENT 'RegistroLROperacionesSeguros - ClaveOperacion\n Posibles valores: \nA = Indemnizaciones o prestaciones satisfechas superiores a 3005,06 \nB = Primas o contraprestaciones percibidas superiores a 3005,06',
  PRIMARY KEY (`IDAnulacionOperacionesSeguros`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `anulacion_operaciones_seguros` */

/*Table structure for table `emisores` */

DROP TABLE IF EXISTS `emisores`;

CREATE TABLE `emisores` (
  `emisorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) DEFAULT NULL,
  `nif` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`emisorId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `emisores` */

insert  into `emisores`(`emisorId`,`nombre`,`nif`) values (2,'Ariadna Software SL','B96470190');

/*Table structure for table `envio_bienes_inversion` */

DROP TABLE IF EXISTS `envio_bienes_inversion`;

CREATE TABLE `envio_bienes_inversion` (
  `IDEnvioBienesInversion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRBienesInversion - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRBienesInversion - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NombreRazon` varchar(9) NOT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - IDEmisorFactura - NombreRazon\nNombre / Razón solicial del emisor de la factura recibida',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRBienesInversion - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_BI_IdentificacionBien` varchar(40) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - IdentificacionBien\nDescripción de los bienes objeto de la operación',
  `REG_BI_FechaInicioUtilizacion` date DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - FechaInicioUtilizacion\nFecha de inicio de la utilización del mismo. Aunque en la base de datos se guarda en formato DATE, se informa como ''DD-MM-YYYY''',
  `REG_BI_ProrrataAnualDefinitiva` decimal(4,2) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - ProrrataAnualDefinitiva',
  `REG_BI_RegularizacionAnualDeduccion` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - RegularizacionAnualDeduccion',
  `REG_BI_IdentificacionEntrega` varchar(40) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - IdentificacionEntrega',
  `REG_BI_RegularizacionDeduccionEfectuada` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRBienesInversion - BienInversion - RegularizacionDeduccionEfectuada',
  PRIMARY KEY (`IDEnvioBienesInversion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `envio_bienes_inversion` */

/*Table structure for table `envio_cobros_emitidas` */

DROP TABLE IF EXISTS `envio_cobros_emitidas`;

CREATE TABLE `envio_cobros_emitidas` (
  `IDEnvioCobrosEmitidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRCobros - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRCobros - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRCobros - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_COBS_COB_Fecha` date NOT NULL COMMENT 'RegistroLRCobros - Cobros - Cobro - Fecha\nFecha de realización del cobro. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma "DD-MM-YYYY"',
  `REG_COBS_COB_Importe` decimal(14,2) NOT NULL COMMENT 'RegistroLRCobros - Cobros - Cobro - Importe\nImporte cobrado',
  `REG_COBS_COB_Medio` varchar(2) NOT NULL COMMENT 'RegistroLRCobros - Cobros - Cobro - Medio\nMedio de cobro utilizado. Posibles valores:\n01 =  Transferencia\n02  = Cheque\n03 =  No se cobra / paga (fecha límite de devengo / devengo forzoso en concurso de acreedores)\n04 =  Otros medios de cobro / pago',
  `REG_COBS_COB_Cuenta_O_Medio` varchar(34) DEFAULT NULL COMMENT 'RegistroLRCobros - Cobros - Cobro - Cuenta_O_Medio\nCuenta bancaria o medio de cobro utilizado',
  PRIMARY KEY (`IDEnvioCobrosEmitidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `envio_cobros_emitidas` */

/*Table structure for table `envio_cobros_metalico` */

DROP TABLE IF EXISTS `envio_cobros_metalico`;

CREATE TABLE `envio_cobros_metalico` (
  `IDEnvioCobrosMetalico` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRCobrosMetalico - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRCobrosMetalico - PeriodoImpositivo - Periodo\nPeridod que se informa, al ser anual debe ser 0A\n0A  = Anual',
  `REG_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRCobrosMetalico - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_ImporteTotal` decimal(14,2) NOT NULL COMMENT 'RegistroLRCobrosMetalico - ImporteTotal\n Importes superiores a 6.000 euros que se hubieran percibido en metálico de la misma persona o entidad por las operaciones realizadas durante el año natural.',
  PRIMARY KEY (`IDEnvioCobrosMetalico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_cobros_metalico` */

/*Table structure for table `envio_facturas_emitidas` */

DROP TABLE IF EXISTS `envio_facturas_emitidas`;

CREATE TABLE `envio_facturas_emitidas` (
  `IDEnvioFacturasEmitidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje"\nCORRECTO: El envio ha sido correctamente registrado\nACPERR: El envio ha sido aceptado, pero contiene errores, ver el campo "Mensaje"\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.7' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.7'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(120) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - IDEmisorFactura - NIF\nNIF asociado al emisor de la factura.',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida',
  `REG_IDF_NumSerieFacturaEmisorResumenFin` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - NumSerieFacturaEmisorResumenFin\nNúmero+serie que identifica a la ultima factura cuando el Tipo de Factura es un asiento resumen de facturas.',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRFacturasEmitidas - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_FE_TipoFactura` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoFactura\nEspecificación del tipo de factura a dar de alta: factura normal, factura rectificativa, tickets, factura emitida en sustitución de facturas. Posibles valores:\nF1 = Factura\nF2  = Factura Simplificada (ticket)\nR1 = Factura Rectificativa (Art 80.1 y 80.2 y error fundado en derecho)\nR2 = Factura Rectificativa (Art. 80.3)\nR3 = Factura Rectificativa (Art. 80.4)\nR4 = Factura Rectificativa (Resto)\nR5 =  Factura Rectificativa en facturas simplificadas\nF3 = Factura emitida en sustitución de facturas simplificadas facturadas y declaradas\nF4 = Asiento resumen de facturas',
  `REG_FE_TipoRectificativa` varchar(1) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoRectificativa\nCampo que identifica si el tipo de factura rectificativa es por sustitución o por diferencia. Posibles valores:\nS =  Por sustitución\nI  = Por diferencias\n',
  `REG_FE_FA_IDFA_NumSerieFacturaEmisor` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - FacturasAgrupadas - IDFacturaAgrupada - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida.',
  `REG_FE_FA_IDFA_FechaExpedicionFacturaEmisor` date DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - FacturasAgrupadas - IDFacturaAgrupada - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura',
  `REG_FE_FR_IDR_NumSerieFacturaEmisor` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - FacturasRectificadas - IDFacturaRectificada - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida de la que se va a hacer la rectificación.\n',
  `REG_FE_FR_IDR_FechaExpedicionFacturaEmisor` date DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - FacturasRectificadas - IDFacturaRectificada - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura de la que se va a hacer la recitificación. Aunque se guarda como columna tipo DATE, en el momento del envio este campo se informa con el formato ''DD-MM-YYYY''.\n',
  `REG_FE_IR_BaseRectificada` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ImporteRectificacion - BaseRectificada\nBase imponible de la factura sustituidas. Es decir, la base original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria.\n',
  `REG_FE_IR_CuotaRectificada` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ImporteRectificacion - CuotaRectificada\nCuota de la factura sustituidas. Es decir, la cuota original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria.\n',
  `REG_FE_IR_CuotaRecargoRectificado` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ImporteRectificacion - CuotaRecargoRectificado\nCuota de recargo de la factura sustituidas. Es decir, la cuota de recargo original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria, en el caso de que haya cuota de recargo.\n',
  `REG_FE_FechaOperacion` date DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - FechaOperacion\nFecha en la que se ha realizado la operación siempre que sea diferente a la fecha de expedición. La columna es tipo DATE y se informa como ''DD-MM-YYYY''\n',
  `REG_FE_ClaveRegimenEspecialOTrascendencia` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ClaveRegimenEspecialOTrascendencia\nClave que identificará el tipo de operación o el régimen especial con transcendencia tributaria. Posibles valores:\n01 = Operación de régimen general.\n02  = Exportación.\n03  = Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección.\n04  = Régimen especial del oro de inversión.\n05  = Régimen especial de las agencias de viajes.\n06  = Régimen especial grupo de entidades en IVA (Nivel Avanzado)\n07  = Régimen especial del criterio de caja.\n08  = Operaciones sujetas al IPSI / IGIC (Impuesto sobre la Producción, los Servicios y la Importación / Impuesto General Indirecto Canario).\n09  = Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (D.A.4ª RD1619/2012)\nXX = Hay mas tipos, consultar docs....',
  `REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional1` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ClaveRegimenEspecialOTrascendencia\nClave que identificará el tipo de operación o el régimen especial con transcendencia tributaria. Posibles valores:\n01 = Operación de régimen general.\n02  = Exportación.\n03  = Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección.\n04  = Régimen especial del oro de inversión.\n05  = Régimen especial de las agencias de viajes.\n06  = Régimen especial grupo de entidades en IVA (Nivel Avanzado)\n07  = Régimen especial del criterio de caja.\n08  = Operaciones sujetas al IPSI / IGIC (Impuesto sobre la Producción, los Servicios y la Importación / Impuesto General Indirecto Canario).\n09  = Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (D.A.4ª RD1619/2012)\nXX = Hay mas tipos, consultar docs....',
  `REG_FE_ClaveRegimenEspecialOTrascendenciaAdicional2` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ClaveRegimenEspecialOTrascendencia\nClave que identificará el tipo de operación o el régimen especial con transcendencia tributaria. Posibles valores:\n01 = Operación de régimen general.\n02  = Exportación.\n03  = Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección.\n04  = Régimen especial del oro de inversión.\n05  = Régimen especial de las agencias de viajes.\n06  = Régimen especial grupo de entidades en IVA (Nivel Avanzado)\n07  = Régimen especial del criterio de caja.\n08  = Operaciones sujetas al IPSI / IGIC (Impuesto sobre la Producción, los Servicios y la Importación / Impuesto General Indirecto Canario).\n09  = Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (D.A.4ª RD1619/2012)\nXX = Hay mas tipos, consultar docs....',
  `REG_FE_ImporteTotal` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ImporteTotal\nImporte total de la factura. No es obligatorio su cumplimentación, AEAT obtiene sus totales de la suma de bases y cuotas.',
  `REG_FE_BaseImponibleACoste` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - BaseImponibleACoste\nSe utiliza sólo en los grupos de IVA.',
  `REG_FE_DescripcionOperacion` text COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - DescripcionOperacion\nDescripción del objeto de la factura. Aunque es un campo TEXT, en realidad el máximo de caracteres en la comunicación serán 500.',
  `REG_FE_DI_DT_SituacionInmueble` int(1) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - DatosInmueble - DetalleInmueble - SituacionInmueble\nIdentificador que especifica la situación del inmueble. Posibles valores:\n1 = Inmueble con referencia catastral situado en cualquier punto del territorio español, excepto País Vasco y Navarra\n2 = Inmueble situado en la Comunidad Autónoma del País Vasco o en la Comunidad Foral de Navarra\n3 = Inmueble en cualquiera de las situaciones anteriores pero sin referencia catastral\n4 = Inmueble situado en el extranjero',
  `REG_FE_DI_DT_ReferenciaCatastral` varchar(25) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - DatosInmueble - DetalleInmueble - ReferenciaCatastral\nReferencia catastral del inmueble',
  `REG_FE_ImporteTransmisionSujetoAIVA` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - ImporteTransmisionSujetoAIVA\nImporte por este concepto, si es aplicable.',
  `REG_FE_EmitidaPorTercero` varchar(1) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - EmitidaPorTeceros\nIdentificador que especifica si la factura ha sido emitida por un tercero. Si no se informa este campo se entenderá que tiene valor “N”.\nPosibles valores:\nS = Si\nN = No',
  `REG_FE_VariosDestinatarios` varchar(1) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida -VariosDestinatarios\nIdentificador que especifica si la factura tiene varios destinatarios. Si no se informa este campo se entenderá que tiene valor “N”.\nPosibles valores:\n"S" = Si / "N" = No',
  `REG_FE_Cupon` varchar(1) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Cupon\nIdentificador que especifica si la factura tipo R1, R5 o F4 tiene minoración de la base imponible por la concesión de cupones, bonificaciones o descuentos cuando solo se expide el original de la factura. Si no se informa este campo se entenderá "N"\nPosibles valores:\n"S" = Si / "N" = No',
  `REG_FE_CNT_NombreRazon` varchar(120) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_FE_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_FE_CNT_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_FE_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_FE_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_FE_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_FE_TD_DF_SU_EX_CausaExencion` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - Exenta -CausaExencion\nCampo que especifica la causa de la exención en los supuestos que aplique. Posibles valores:\nE1 = Exenta por el artículo 20\nE2 = Exenta por el artículo 21\nE3 = Exenta por el artículo 22\nE4 = Exenta por el artículo 24\nE5 = Exenta por el artículo 25\nE6 = Exenta por otros\nE6 = Exenta por otros.\nE6 = Exenta por Otros',
  `REG_FE_TD_DF_SU_EX_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - Exenta - BaseImponible\nImporte en euros correspondiente a la parte Sujeta / Exenta',
  `REG_FE_TD_DF_SU_NEX_TipoNoExenta` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta -TipoNoExenta\nTipo de operación sujeta y no exenta para la diferenciación de inversión de sujeto pasivo. Posibles valores:\nS1 = Sujeta – No Exenta\nS2 = Sujeta – No Exenta - Inv. Suj. Pasivo\nS3 = No exenta - Sin inversión sujeto pasivo y con inversión de sujeto pasivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT1_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetallaIVA1 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT1_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT1_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT1_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_SU_NEX_DI_DT2_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT2_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT2_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT2_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta -  NoExenta - DesgloseIVA - DetalleIVA2 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_SU_NEX_DI_DT3_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetallaIVA3 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT3_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta -DesgloseIVA - DetalleIVA3 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT3_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose -  DesgloseFactura -  Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT3_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta -DesgloseIVA - DetalleIVA3 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_SU_NEX_DI_DT4_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT4_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - BaseImponible\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT4_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT4_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_SU_NEX_DI_DT5_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetallaIVA5 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT5_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT5_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT5_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_SU_NEX_DI_DT6_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetallaIVA6 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DF_SU_NEX_DI_DT6_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DF_SU_NEX_DI_DT6_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FE_TD_DF_SU_NEX_DI_DT6_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - Sujeta - NoExenta -DesgloseIVA - DetalleIVA6 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FE_TD_DF_NSU_ImportePorArticulos7_14_Otros` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - NoSujeta - ImportePorArticulos7_14_Otros\nImporte en euros si la sujeción es por el art. 7,14, otros',
  `REG_FE_TD_DF_NSU_ImporteTAIReglasLocalizacion` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseFactura - NoSujeta - ImporteTAIReglasLocalizacion\nImporte en euros si la sujeción es por operaciones no sujetas en el TAI porreglas de localización',
  `REG_FE_TD_DTS_SU_EX_CausaExencion` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujenta - Exenta - CausaExencion\nCampo que especifica la causa de la exención en los supuestos que aplique. Posibles valores:\nE1 = Exenta por el artículo 20\nE2 = Exenta por el artículo 21\nE3 = Exenta por el artículo 22\nE4 = Exenta por el artículo 24\nE5 = Exenta por el artículo 25\nE6 = Exenta por otros\nE6 = Exenta por otros.\nE6 = Exenta por Otros',
  `REG_FE_TD_DTS_SU_EX_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - Exenta - BaseImponible\nImporte en euros correspondiente a la parte Sujeta / Exenta',
  `REG_FE_TD_DTS_SU_NEX_TipoNoExenta` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - TipoNoExenta\nTipo de operación sujeta y no exenta para la diferenciación de inversión de sujeto pasivo. Posibles valores:\nS1 = Sujeta – No Exenta\nS2 = Sujeta – No Exenta - Inv. Suj. Pasivo\nS3 = No exenta - Sin invesrión sujeto pasivo y con inversión sujeto pasivo.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT1_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT1_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT1_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT2_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT2_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT2_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT3_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetallaIVA3 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT3_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT3_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT4_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT4_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT4_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT5_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetallaIVA5 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT5_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT5_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT6_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistrp - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetallaIVA6 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTS_SU_NEX_DI_DT6_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTS_SU_NEX_DI_DT6_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTS_NSU_ImportePorArticulos7_14_Otros` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose -> DesgloseTipoOperacion -> Servicios -> NoSujeta - ImportePorArticulos7_14_Otros\nImporte en euros si la sujeción es por el art. 7,14, otros',
  `REG_FE_TD_DTS_NSU_ImporteTAIReglasLocalizacion` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Servicios - NoSujeta - ImporteTAIReglasLocalizacion\nImporte en euros si la sujeción es por operaciones no sujetas en el TAI porreglas de localización',
  `REG_FE_TD_DTE_SU_EX_CausaExencion` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion -> Entrega - Sujeta - Exenta - CausaExencion\nCampo que especifica la causa de la exención en los supuestos que aplique. Posibles valores:\nE1 = Exenta por el artículo 20\nE2 = Exenta por el artículo 21\nE3 = Exenta por el artículo 22\nE4 = Exenta por el artículo 24\nE5 = Exenta por el artículo 25\nE6 = Exenta por otros\nE6 = Exenta por Otros',
  `REG_FE_TD_DTE_SU_EX_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - Exenta - BaseImponible\nImporte en euros correspondiente a la parte Sujeta / Exenta',
  `REG_FE_TD_DTE_SU_NEX_TipoNoExenta` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - TipoNoExenta\nTipo de operación sujeta y no exenta para la diferenciación de inversión de sujeto pasivo. Posibles valores:\nS1 = Sujeta – No Exenta\nS2 = Sujeta – No Exenta - Inv. Suj. Pasivo\nS3 = No exenta - Sin inversión sujeto pasivo y con inversión del sujeto pasivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT1_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetallaIVA1 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT1_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT1_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT2_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT2_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA2 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT2_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT3_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetallaIVA3 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT3_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT3_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA3 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT4_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT4_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT4_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA4- CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT5_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT5_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT5_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA5 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT6_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetallaIVA6 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FE_TD_DTE_SU_NEX_DI_DT6_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FE_TD_DTE_SU_NEX_DI_DT6_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - Sujeta - NoExenta - DesgloseIVA - DetalleIVA6 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FE_TD_DTE_NSU_ImportePorArticulos7_14_Otros` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - NoSujeta - ImportePorArticulos7_14_Otros\nImporte en euros si la sujeción es por el art. 7,14, otros',
  `REG_FE_TD_DTE_NSU_ImporteTAIReglasLocalizacion` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaExpedida - TipoDesglose - DesgloseTipoOperacion - Entrega - NoSujeta - ImporteTAIReglasLocalizacion\nImporte en euros si la sujeción es por operaciones no sujetas en el TAI porreglas de localización',
  PRIMARY KEY (`IDEnvioFacturasEmitidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_facturas_emitidas` */

/*Table structure for table `envio_facturas_recibidas` */

DROP TABLE IF EXISTS `envio_facturas_recibidas`;

CREATE TABLE `envio_facturas_recibidas` (
  `IDEnvioFacturasRecibidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas recibidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - IDEmisorFactura - NIF\nNIF asociado al emisor de la factura.',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida',
  `REG_IDF_NumSerieFacturaEmisorResumenFin` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - NumSerieFacturaEmisorResumenFin\nNúmero+serie que identifica a la ultima factura cuando el Tipo de Factura es un asiento resumen de facturas.',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRFacturasRecibidas - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_FR_TipoFactura` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - TipoFactura\nEspecificación del tipo de factura a dar de alta: factura normal, factura rectificativa, tickets, factura emitida en sustitución de facturas. Posibles valores:\nF1 = Factura\nF2  = Factura Simplificada (ticket)\nR1 = Factura Rectificativa (Art 80.1 y 80.2 y error fundado en derecho)\nR2 = Factura Rectificativa (Art. 80.3)\nR3 = Factura Rectificativa (Art. 80.4)\nR4 = Factura Rectificativa (Resto)\nR5 =  Factura Rectificativa en facturas simplificadas\nF3 = Factura emitida en sustitución de facturas simplificadas facturadas y declaradas\nF4 = Asiento resumen de facturas',
  `REG_FR_TipoRectificativa` varchar(1) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - TipoRectificativa\nCampo que identifica si el tipo de factura rectificativa es por sustitución o por diferencia. Posibles valores:\nS =  Por sustitución\nI  = Por diferencias\n',
  `REG_FR_FA_IDFA_NumSerieFacturaEmisor` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaRecibida - FacturasAgrupadas - IDFacturaAgrupada - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida.',
  `REG_FR_FA_IDFA_FechaExpedicionFacturaEmisor` date DEFAULT NULL COMMENT 'RegistroLRFacturasEmitidas - FacturaRecibida - FacturasAgrupadas - IDFacturaAgrupada - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura',
  `REG_FR_FR_IDR_NumSerieFacturaEmisor` varchar(60) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - FacturasRectificadas - IDFacturaRectificada - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida de la que se va a hacer la rectificación.\n',
  `REG_FR_FR_IDR_FechaExpedicionFacturaEmisor` date DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - FacturasRectificadas - IDFacturaRectificada - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura de la que se va a hacer la recitificación. Aunque se guarda como columna tipo DATE, en el momento del envio este campo se informa con el formato ''DD-MM-YYYY''.\n',
  `REG_FR_IR_BaseRectificada` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - ImporteRectificacion - BaseRectificada\nBase imponible de la factura sustituidas. Es decir, la base original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria.\n',
  `REG_FR_IR_CuotaRectificada` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - ImporteRectificacion - CuotaRectificada\nCuota de la factura sustituidas. Es decir, la cuota original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria.\n',
  `REG_FR_IR_CuotaRecargoRectificado` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - ImporteRectificacion - CuotaRecargoRectificado\nCuota de recargo de la factura sustituidas. Es decir, la cuota de recargo original de la factura que se quiere rectificar. Aunque el campo admite nulos si el tipo de la factura es rectificativa, entonces su información es obligatoria, en el caso de que haya cuota de recargo.\n',
  `REG_FR_FechaOperacion` date DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - FechaOperacion\nFecha en la que se ha realizado la operación siempre que sea diferente a la fecha de expedición. La columna es tipo DATE y se informa como ''DD-MM-YYYY''\n',
  `REG_FR_ClaveRegimenEspecialOTrascendencia` varchar(2) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - ClaveRegimenEspecialOTrascendencia\nClave que identificará el tipo de operación o el régimen especial con transcendencia tributaria. Posibles valores:\n01 = Operación de régimen común\n02 = Exportación\n03 = Operaciones a las que se aplique el régimen especial de bienes usados, objetos de arte, antigüedades y objetos de colección (135-139 de LIVA)\n04 = Régimen especial oro de inversión\n05 = Régimen especial agencias de viajes\n06 = Régimen especial grupo de entidades en IVA\n07 = Régimen especial grupo de entidades en IVA (Nivel Avanzado)\n08 = Régimen especial criterio de caja\n09 = Operaciones sujetas al IPSI / IGIC\n10 = Facturación de las prestaciones de servicios de agencias de viaje que actúan como mediadoras en nombre y por cuenta ajena (D.A.4ª RD1619/2012)\n11 = Cobros por cuenta de terceros de honorarios profesionales ....\n12 = Operaciones de seguros\n13 = Op. de arrendamiento sujetas a retención\n14 = Op. de arrendamiento no sujetos a retención\n15 = Op. de arren',
  `REG_FR_ImporteTotal` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - ImporteTotal\nImporte total de la factura. No es obligatorio su cumplimentación, AEAT obtiene sus totales de la suma de bases y cuotas.',
  `REG_FR_BaseImponibleACoste` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - BaseImponibleACoste\nSe utiliza sólo en los grupos de IVA.',
  `REG_FR_DescripcionOperacion` text COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - DescripcionOperacion\nDescripción del objeto de la factura. Aunque es un campo TEXT, en realidad el máximo de caracteres en la comunicación serán 500.',
  `REG_FR_AD_NumeroDUA` varchar(40) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Aduanas - NumeroDUA\nNúmero de DUA',
  `REG_FR_AD_FechaRegContableDUA` date DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Aduanas - FechaRegContableDUA\nFecha de registro contable del DUA. Guardado en formato DATE se informa en formato ''DD-MM-YY''',
  `REG_FR_DF_ISP_DI_DT1_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - InversionSujetoPasivo - DetallaIVA1 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT1_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA1 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT1_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT1_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA1 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT1_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -DesgloseFactura - InversionSujetoPasivo - DetalleIVA1 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_ISP_DI_DT2_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA2 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT2_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - InversionSujetoPasivo - DetalleIVA2 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT2_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA2 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT2_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA2 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT2_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA2 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_ISP_DI_DT3_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetallaIVA3 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT3_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA3 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT3_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA3 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT3_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA3 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT3_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DetalleIVA3 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_ISP_DI_DT4_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -DesgloseFactura - InversionSujetoPasivo - DetalleIVA4 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT4_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nFacturaRecibida - DesgloseFactura - InversionSujetoPasivo - DesgloseIVA - DetalleIVA4 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT4_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - InversionSujetoPasivo - DesgloseIVA - DetalleIVA4 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT4_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA4 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT4_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA4 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_ISP_DI_DT5_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetallaIVA5 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT5_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA5 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT5_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - InversionSujetoPasivo - DesgloseIVA - DetalleIVA5 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT5_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA5 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT5_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - InversionSujetoPasivo - DesgloseIVA - DetalleIVA5 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_ISP_DI_DT6_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetallaIVA6 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_ISP_DI_DT6_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA6 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT6_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA6 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_ISP_DI_DT6_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA6 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_ISP_DI_DT6_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  InversionSujetoPasivo - DesgloseIVA - DetalleIVA6 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT1_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - DesgloseIVA - DetallaIVA1 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT1_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA1 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT1_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - DesgloseIVA - DetalleIVA1 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT1_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA1 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT1_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 1 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA1 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT2_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA2 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT2_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - DesgloseIVA - DetalleIVA2 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT2_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA2 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT2_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida -  DesgloseFactura - DesgloseIVA - DetalleIVA2 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT2_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 2 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA2 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT3_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetallaIVA3 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT3_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura -DesgloseIVA - DetalleIVA3 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT3_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA3 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT3_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA3 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT3_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 3 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA3 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT4_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA4 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT4_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nFacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA4 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT4_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA4 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT4_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA4 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT4_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 4 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA4 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT5_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetallaIVA5 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT5_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA5 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT5_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA5 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT5_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA5 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT5_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 5 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA5 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_DF_DGI_DI_DT6_TipoImpositivo` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetallaIVA6 - TipoImpositivo.\nPorcentaje aplicado sobre la Base Imponible para calcular la cuota.',
  `REG_FR_DF_DGI_DI_DT6_BaseImponible` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA6 - BaseImponible.\nMagnitud dineraria sobre la cual se aplica un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT6_CuotaRepercutida` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA6 - CuotaRepercutida.\nCuota resultante de aplicar a la base imponible un determinado tipo impositivo',
  `REG_FR_DF_DGI_DI_DT6_TipoREquivalencia` decimal(5,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura - DesgloseIVA - DetalleIVA6 - TipoRecargoEquivalencia.\nPorcentaje asociado en función del tipo de IVA',
  `REG_FR_DF_DGI_DI_DT6_CuotaREquivalencia` decimal(14,2) DEFAULT NULL COMMENT 'IVA 6 DE 6 POSIBLES\nRegistroLRFacturasRecibidas - FacturaRecibida - DesgloseFactura -DesgloseIVA - DetalleIVA6 - CuotaRecargoEquivalencia.\nCuota resultante de aplicar a la base imponible el tipo de recargo de equivalencia',
  `REG_FR_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación. Proveedor en facturas recibidas',
  `REG_FR_CNT_NIFRepresentante` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - NIFReepresentante\nNIF del representante de la contraparte de la operación. Proveedor en facturas recibidas',
  `REG_FR_CNT_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - NIF\nIdentificador del NIF de la contraparte de la operación. Proveedor en facturas recibidas',
  `REG_FR_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_FR_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_FR_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_FR_FechaRegContable` date DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - FechaRegContable\nFecha del registro contable de la operación. Se utilizará para el plazo de remisión de las facturas recibidas\nSe guarda como DATE, se informa como ''DD-MM-YYYY''',
  `REG_FR_CuotaDeducible` decimal(14,2) DEFAULT NULL COMMENT 'RegistroLRFacturasRecibidas - FacturaRecibida - CuotaDeducible\nCuota deducible',
  PRIMARY KEY (`IDEnvioFacturasRecibidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_facturas_recibidas` */

/*Table structure for table `envio_operaciones_intracomunitarias` */

DROP TABLE IF EXISTS `envio_operaciones_intracomunitarias`;

CREATE TABLE `envio_operaciones_intracomunitarias` (
  `IDEnvioOperacionesIntracomunitarias` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_IDF_IDEF_NombreRazon` varchar(9) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - NombreRazon\nNombre / Razón solicial del emisor de la factura recibida',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_IDEF_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_IDF_IDEF_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_IDF_IDEF_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - IDEmisorFactura - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - NumSerieFacturaEmisor\nNúmero+Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_OI_TipoOperacion` varchar(1) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - TipoOperacion\nIdentificador del tipo de operación intracomunitaria. Posibles valores:\nA = El envío o recepción de bienes para la realización de los informes parciales o trabajos mencionados en el artículo 70, apartado uno, número 7º, de la Ley del Impuesto (Ley\n37/1992).\nB = Las transferencias de bienes y las adquisiciones intracomunitarias de bienes comprendidas en los artículos 9, apartado 3º, y 16, apartado 2º, de la Ley del Impuesto (Ley 37/1992).',
  `REG_OI_ClaveDeclarado` varchar(1) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - ClaveDeclarado\nIdentificación de declarante o declarado. Posibles valores:\nD =  Declarante\nR = Remitente',
  `REG_OI_EstadoMiembro` varchar(2) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - EstadoMiembro\nCódigo del Estado miembro de origen o de envío',
  `REG_OI_PlazoOperacion` int(3) DEFAULT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - PlazoOperacion\n',
  `REG_OI_DescripcionBienes` varchar(40) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - TipoOperacion\nDescripción de los bienes adquiridos',
  `REG_OI_DireccionOperador` varchar(1) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - DireccionOperador\nDirección del operador intracomunitario',
  `REG_OI_FacturasODocumentacion` varchar(1) NOT NULL COMMENT 'RegistroLRDetOperacionIntracomunitaria - OperacionIntracomunitaria - FacturasODocumentacion\nOtras facturas o documentación relativas a las operaciones de que se trate',
  PRIMARY KEY (`IDEnvioOperacionesIntracomunitarias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_operaciones_intracomunitarias` */

/*Table structure for table `envio_operaciones_seguros` */

DROP TABLE IF EXISTS `envio_operaciones_seguros`;

CREATE TABLE `envio_operaciones_seguros` (
  `IDEnvioOperacionesSeguros` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_PI_Ejercicio` int(4) NOT NULL COMMENT 'RegistroLROperacionesSeguros - PeriodoImpositivo - Ejercicio\nEjercicio impositivo de la factura, normalmente el año.',
  `REG_PI_Periodo` varchar(2) NOT NULL COMMENT 'RegistroLROperacionesSeguros - PeriodoImpositivo - Periodo\nPeriodo impositivo de la factura. Posibles valores:\n01 = Enero\n02  = Febrero\n03  = Marzo\n04  = Abril\n05  = Mayo\n06  = Junio\n07  = Julio\n08  = Agosto\n09  = Septiembre\n10 =  Octubre\n11 =  Noviembre\n12  = Diciembre\n0A  = Anual',
  `REG_CNT_NombreRazon` varchar(40) NOT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - NombreRazon\nNombre-razón social de la contraparte de la operación (cliente) de facturas expedidas.',
  `REG_CNT_NIFRepresentante` varchar(45) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - NIFRepresentante\nNIF del representante de la contraparte de la operación',
  `REG_CNT_NIF` varchar(9) NOT NULL COMMENT 'Registrp - Contraparte - NIF\nIdentificador del NIF contraparte de la operación (cliente) de facturas expedidas',
  `REG_CNT_IDOtro_CodigoPais` varchar(2) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - CodigoPais\nIDOtro, solo es de obligado cumplimiento si hay que proporcionar información adicional de la contraparte. Si aun no siendo obligado se cumplimenta esta información aparece en la consulta directa de la web de AEAT.\nCódigo del país asociado contraparte de la operación (cliente) de facturas expedidas (ISO 3166-1 alpha-2 codes)',
  `REG_CNT_IDOtro_IDType` varchar(2) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - IDType\nClave para establecer el tipo de identificación en el pais de residencia. Posibles valores:\n02 = NIF-IVA\n03 = PASAPORTE\n04 = DOCUMENTO OFICIAL DE IDENTIFICACIÓN EXPEDIDO POR EL PAIS O TERRITORIO DE RESIDENCIA\n05 = CERTIFICADO DE RESIDENCIA\n06 = OTRO DOCUMENTO PROBATORIO\n',
  `REG_CNT_IDOtro_ID` varchar(20) DEFAULT NULL COMMENT 'RegistroLROperacionesSeguros - Contraparte - IDOtro - ID\nNúmero de identificación en el país de residencia',
  `REG_ClaveOperacion` decimal(14,2) NOT NULL COMMENT 'RegistroLROperacionesSeguros - ClaveOperacion\n Posibles valores: \nA = Indemnizaciones o prestaciones satisfechas superiores a 3005,06 \nB = Primas o contraprestaciones percibidas superiores a 3005,06',
  `REG_ImporteTotal` decimal(14,2) NOT NULL COMMENT 'RegistroLROperacionesSeguros - ImporteTotal\n Importe anual de las operaciones de seguros.',
  PRIMARY KEY (`IDEnvioOperacionesSeguros`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='En esta tabla se guardan los mensajes que debe de procesar la utilidad de envío de facturas emitidas al sistema SII. Debe grabar un registro por cada una de las facturas que quiera enviar o modificar tras su envío.';

/*Data for the table `envio_operaciones_seguros` */

/*Table structure for table `envio_pagos_recibidas` */

DROP TABLE IF EXISTS `envio_pagos_recibidas`;

CREATE TABLE `envio_pagos_recibidas` (
  `IDEnvioPagosRecibidas` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Es un identificador único autoincremental para cualquier registro de la tabla.',
  `Origen` varchar(255) NOT NULL COMMENT 'Indica el origen del registro. Es un campo libre y su intención es reflejar el sistema que creó esta información.\nPor ejemplo si proviene de la carga de un fichero Excel o CSV, aquí se indicará el nombre de fichero con extensión',
  `FechaHoraCreacion` datetime NOT NULL COMMENT 'Fecha y hora en la que el sistema de alimentación creó el registro.',
  `EnvioInmediato` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indica si se desea que el servicio de envío presente la factura inmediatamaente. Posibles valores:\n1 = Tan pronto como el sistema detecte el registro lo comunicará a la AEAT\n0 = Espera a la intervención manual del operador por el interfaz Web para proceder al envío',
  `Enviada` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Indica si la factura ha sido enviada a la AEAT, independientemente de si ese envío ha provocado errores o no. Posibles valores:\n0 = Factura no enviada\n1 = Factura enviada\n\n',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado del envío. Posibles valores:\nERROR: Se ha producido un error, bien porque la plataforma ha fallado o porque alguno de los campos es incorrecto, ver el campo "Mensaje para comprobar la razón"\nINCORRECTO: El envio ha sido incorrecto, ver el campo "Mensaje para comprobar la razón"\nCORRECTO: El envio ha sido correctamente registrado\n',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación. Equivale al número de registro en los envios CORRECTO',
  `Mensaje` text COMMENT 'Mensaje resultado del envío, de transcendencia en envío con ERROR o INCORRECTO',
  `XML_Enviado` text COMMENT 'XML SOAP del último envío realizado',
  `CAB_IDVersionSii` varchar(3) NOT NULL DEFAULT '0.5' COMMENT 'Cabecera - IDVersionSii\nIdentificación de la versión del esquema utilizado para el intercambio de información. La versión actual es ''0.5'' por eso tiene ese valor por defecto.\n',
  `CAB_Titular_NombreRazon` varchar(40) NOT NULL COMMENT 'Cabecera - Titular - NombreRazon\nNombre-razón social del Titular del libro de registro de facturas expedidas',
  `CAB_Titular_NIFRepresentante` varchar(9) DEFAULT NULL COMMENT 'Cabecera - Titular - NIFRepresentante\nNIF del representante del titular del libro de registro',
  `CAB_Titular_NIF` varchar(9) NOT NULL COMMENT 'Cabecera - Titular - NIF\nNIF asociado al titular del libro de registro',
  `CAB_TipoComunicacion` varchar(2) NOT NULL COMMENT 'Cabecera - Titular - TipoComunicacion\nTipo de operación (alta, modificación). Posibles valores:\nA0 = Alta de facturas/registro\nA1 = Modificación de facturas/registros (errores registrales)\nA4 = Modificación Factura Régimen de Viajeros',
  `REG_IDF_IDEF_NIF` varchar(9) NOT NULL COMMENT 'RegistroLRPagos - IDFactura - IDEmisorFactura - NIF\nNIF del emisor de la factura recibida',
  `REG_IDF_NumSerieFacturaEmisor` varchar(60) NOT NULL COMMENT 'RegistroLRPagos - IDFactura - NumSerieFacturaEmisor\nNúmero+ Serie que identifica a la factura emitida',
  `REG_IDF_FechaExpedicionFacturaEmisor` date NOT NULL COMMENT 'RegistroLRPagos - IDFactura - FechaExpedicionFacturaEmisor\nFecha de expedición de la factura. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma ''DD-MM-YYYY''',
  `REG_PAGS_PAG_Fecha` date NOT NULL COMMENT 'RegistroLRPagos - Pagos - Pago - Fecha\nFecha de realización del pago. En la base de datos se guarda como un tipo date, en el envío se trasmite en la forma "DD-MM-YYYY"',
  `REG_PAGS_PAG_Importe` decimal(14,2) NOT NULL COMMENT 'RegistroLRPagos - Pagos - Pago - Importe\nImporte pagado',
  `REG_PAGS_PAG_Medio` varchar(2) NOT NULL COMMENT 'RegistroLRPagos - Pagos - Pago - Medio\nMedio de pago utilizado',
  `REG_PAGS_PAG_Cuenta_O_Medio` varchar(34) DEFAULT NULL COMMENT 'RegistroLRPagos - Pagos - Pago - Cuenta_O_Medio\nCuenta bancaria o medio de pago utilizado',
  PRIMARY KEY (`IDEnvioPagosRecibidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `envio_pagos_recibidas` */

/*Table structure for table `grupos_usuarios` */

DROP TABLE IF EXISTS `grupos_usuarios`;

CREATE TABLE `grupos_usuarios` (
  `grupoUsuarioId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del grupo de usuario',
  `nombre` varchar(255) NOT NULL COMMENT 'Nombre del grupo',
  PRIMARY KEY (`grupoUsuarioId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Esta es la tabla que contiene los grupos de usuarios';

/*Data for the table `grupos_usuarios` */

insert  into `grupos_usuarios`(`grupoUsuarioId`,`nombre`) values (1,'Administradores');

/*Table structure for table `titulares` */

DROP TABLE IF EXISTS `titulares`;

CREATE TABLE `titulares` (
  `titularId` int(11) NOT NULL AUTO_INCREMENT,
  `nombreRazon` varchar(40) DEFAULT NULL,
  `nifTitular` varchar(9) DEFAULT NULL,
  `nifRepresentante` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`titularId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `titulares` */

insert  into `titulares`(`titularId`,`nombreRazon`,`nifTitular`,`nifRepresentante`) values (2,'Ariadna Software SL','B96470190','25375586P');

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `usuarioId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario',
  `grupoUsuarioId` int(11) DEFAULT NULL COMMENT 'Grupo al que pertenece',
  `nombre` varchar(255) DEFAULT NULL COMMENT 'Nombre del usuario',
  `codigoIdioma` varchar(255) DEFAULT NULL COMMENT 'Codigo de idioma según 639-1',
  `login` varchar(255) DEFAULT NULL COMMENT 'Login con el que se presenta el usuario',
  `password` varchar(255) DEFAULT NULL COMMENT 'Contraseña del usuario (por el moento en texto plano, luego será codificada)',
  `getKeyTime` datetime DEFAULT NULL COMMENT 'Fecha y hora en la que se obtuvo la última clave API',
  `expKeyTime` datetime DEFAULT NULL COMMENT 'Fecha y hora en la que expira la clave API',
  `apiKey` varchar(255) DEFAULT NULL COMMENT 'Clave API utilizada para identificar al usuario en las llamadas',
  `esAdministrador` tinyint(1) DEFAULT '0' COMMENT 'Indica si el usuario es administrador',
  PRIMARY KEY (`usuarioId`),
  KEY `usuarios_grupos` (`grupoUsuarioId`),
  CONSTRAINT `usuarios_grupos` FOREIGN KEY (`grupoUsuarioId`) REFERENCES `grupos_usuarios` (`grupoUsuarioId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Tabla de usuarios. Todos los usuarios pertenecen a un grupo';

/*Data for the table `usuarios` */

insert  into `usuarios`(`usuarioId`,`grupoUsuarioId`,`nombre`,`codigoIdioma`,`login`,`password`,`getKeyTime`,`expKeyTime`,`apiKey`,`esAdministrador`) values (1,1,'Administrador','es','admin','admin','2017-05-17 08:35:29','2017-05-17 13:35:29','WDsjh',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
