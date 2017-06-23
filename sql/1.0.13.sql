/*
SQLyog Community
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

/*Table structure for table `facemitidas` */

DROP TABLE IF EXISTS `facemitidas`;

CREATE TABLE `facemitidas` (
  `FacEmitidaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la fcatura emitida',
  `NifEmisor` varchar(255) DEFAULT NULL COMMENT 'Nif del emisor',
  `NombreEmisor` varchar(255) DEFAULT NULL COMMENT 'Nombre del emisor',
  `NifReceptor` varchar(255) DEFAULT NULL COMMENT 'Nif del receptor',
  `NombreReceptor` varchar(255) DEFAULT NULL COMMENT 'Nombre del receptor',
  `NumFactura` varchar(255) DEFAULT NULL COMMENT 'Número de factura',
  `FechaFactura` date DEFAULT NULL COMMENT 'Fecha factura',
  `FechaOperacion` date DEFAULT NULL COMMENT 'Fecha operación',
  `Importe` decimal(14,2) DEFAULT NULL COMMENT 'Importe de la factura',
  `Enviada` tinyint(1) DEFAULT NULL COMMENT 'Indica si la factura ha sido enviada o nó',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado comunicado por la AEAT',
  `Mensaje` text COMMENT 'Mensaje de la AEAT',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación de la AEAT',
  `UltRegistroID` int(11) DEFAULT NULL COMMENT 'Código del último registro emitido',
  PRIMARY KEY (`FacEmitidaId`),
  KEY `ref_fac_envios` (`UltRegistroID`),
  CONSTRAINT `ref_fac_envios` FOREIGN KEY (`UltRegistroID`) REFERENCES `envio_facturas_emitidas` (`IDEnvioFacturasEmitidas`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Table structure for table `facrecibidas` */

DROP TABLE IF EXISTS `facrecibidas`;

CREATE TABLE `facrecibidas` (
  `FacRecibidaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la factura emitida',
  `NifEmisor` varchar(255) DEFAULT NULL COMMENT 'Nif del emisor',
  `NombreEmisor` varchar(255) DEFAULT NULL COMMENT 'Nombre del emisor',
  `NifReceptor` varchar(255) DEFAULT NULL COMMENT 'Nif del receptor',
  `NombreReceptor` varchar(255) DEFAULT NULL COMMENT 'Nombre del receptor',
  `NumFactura` varchar(255) DEFAULT NULL COMMENT 'Número de factura',
  `FechaFactura` date DEFAULT NULL COMMENT 'Fecha factura',
  `FechaOperacion` date DEFAULT NULL COMMENT 'Fecha operación',
  `Importe` decimal(14,2) DEFAULT NULL COMMENT 'Importe de la factura',
  `Enviada` tinyint(1) DEFAULT NULL COMMENT 'Indica si la factura ha sido enviada o nó',
  `Resultado` varchar(255) DEFAULT NULL COMMENT 'Resultado comunicado por la AEAT',
  `Mensaje` text COMMENT 'Mensaje de la AEAT',
  `CSV` varchar(255) DEFAULT NULL COMMENT 'Código seguro de verificación de la AEAT',
  `UltRegistroID` int(11) DEFAULT NULL COMMENT 'Código del último registro emitido',
  PRIMARY KEY (`FacRecibidaId`),
  KEY `ref_fac_recibidos` (`UltRegistroID`),
  CONSTRAINT `ref_fac_recibidos` FOREIGN KEY (`UltRegistroID`) REFERENCES `envio_facturas_recibidas` (`IDEnvioFacturasRecibidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `relfacemit` */

DROP TABLE IF EXISTS `relfacemit`;

CREATE TABLE `relfacemit` (
  `RelFacEmitId` int(11) NOT NULL AUTO_INCREMENT,
  `FacEmitidaId` int(11) DEFAULT NULL,
  `IDEnvioFacturasEmitidas` int(11) DEFAULT NULL,
  PRIMARY KEY (`RelFacEmitId`),
  KEY `rel_emitidas_reg1` (`FacEmitidaId`),
  KEY `rel_emitidas_reg2` (`IDEnvioFacturasEmitidas`),
  CONSTRAINT `rel_emitidas_reg1` FOREIGN KEY (`FacEmitidaId`) REFERENCES `facemitidas` (`FacEmitidaId`),
  CONSTRAINT `rel_emitidas_reg2` FOREIGN KEY (`IDEnvioFacturasEmitidas`) REFERENCES `envio_facturas_emitidas` (`IDEnvioFacturasEmitidas`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Table structure for table `relfacrec` */

DROP TABLE IF EXISTS `relfacrec`;

CREATE TABLE `relfacrec` (
  `RelFacRecId` int(11) NOT NULL AUTO_INCREMENT,
  `FacRecibidaId` int(11) DEFAULT NULL,
  `IDEnvioFacturasRecibidas` int(11) DEFAULT NULL,
  PRIMARY KEY (`RelFacRecId`),
  KEY `rel_recibidas_reg1` (`FacRecibidaId`),
  KEY `rel_recibidas_reg2` (`IDEnvioFacturasRecibidas`),
  CONSTRAINT `rel_recibidas_reg1` FOREIGN KEY (`FacRecibidaId`) REFERENCES `facrecibidas` (`FacRecibidaId`),
  CONSTRAINT `rel_recibidas_reg2` FOREIGN KEY (`IDEnvioFacturasRecibidas`) REFERENCES `envio_facturas_recibidas` (`IDEnvioFacturasRecibidas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
