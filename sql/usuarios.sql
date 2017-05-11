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
  `paisId` int(11) DEFAULT NULL COMMENT 'Pais por defecto para ofertas',
  `empresaId` int(11) DEFAULT NULL COMMENT 'Empresa por defecto para ofertas',
  `areaId` int(11) DEFAULT NULL COMMENT 'Área por defecto para ofertas',
  `centroId` int(11) DEFAULT NULL COMMENT 'Centro por defecto para ofertas',
  `esAdministrador` tinyint(1) DEFAULT '0' COMMENT 'Indica si el usuario tiene priviligeios de administrador en la aplicación',
  `verOfertasGrupo` tinyint(1) DEFAULT '0' COMMENT 'Indica si el usuario puede ver ofertas de otros responsables pretenecientes a su grupo',
  PRIMARY KEY (`usuarioId`),
  KEY `usuarios_grupos` (`grupoUsuarioId`),
  KEY `usuarios_paises` (`paisId`),
  KEY `usuarios_empresas` (`empresaId`),
  KEY `usuarios_areas` (`areaId`),
  KEY `usuarios_centros` (`centroId`),
  CONSTRAINT `usuarios_areas` FOREIGN KEY (`areaId`) REFERENCES `areas` (`areaId`),
  CONSTRAINT `usuarios_centros` FOREIGN KEY (`centroId`) REFERENCES `centros` (`centroId`),
  CONSTRAINT `usuarios_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `usuarios_grupos` FOREIGN KEY (`grupoUsuarioId`) REFERENCES `grupos_usuarios` (`grupoUsuarioId`),
  CONSTRAINT `usuarios_paises` FOREIGN KEY (`paisId`) REFERENCES `paises` (`paisId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COMMENT='Tabla de usuarios. Todos los usuarios pertenecen a un grupo';

/*Data for the table `usuarios` */

insert  into `usuarios`(`usuarioId`,`grupoUsuarioId`,`nombre`,`codigoIdioma`,`login`,`password`,`getKeyTime`,`expKeyTime`,`apiKey`,`paisId`,`empresaId`,`areaId`,`centroId`,`esAdministrador`,`verOfertasGrupo`) values 
(1,1,'Administrador','es','admin','admin','2017-05-05 08:50:34','2017-05-05 13:50:34','35NmD',4,7,7,0,1,0),
(2,5,'Antonio Martinez','es','a.martinez@gdes.com','1234','2017-02-02 09:05:52','2017-02-02 14:05:52','2tPqf',1,2,5,NULL,0,1),
(3,8,'Marceliano Curiel','es','m.curiel@gdes.com','1234','2017-03-29 13:06:23','2017-03-29 18:06:23','bP7iY',1,2,1,NULL,0,1),
(4,9,'Antonio Andrés','es','a.andres@gdes.com','1234','2017-04-26 17:18:42','2017-04-26 22:18:42','ldn2z',1,2,6,NULL,0,1),
(5,8,'Fernando de Pablo','es','f.pablo@gdes.com','1234',NULL,NULL,NULL,1,2,1,NULL,0,0),
(6,1,'Jose Tomás Ruiz','es','j.ruiz@gdes.com','1234',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0),
(7,10,'Joan Romeu','es','j.romeu@gdes.com','1234',NULL,NULL,NULL,1,2,NULL,NULL,0,1),
(8,11,'Ivan Maqueda','es','i.maqueda@gdes.com','1234',NULL,NULL,NULL,1,9,8,NULL,0,1),
(9,11,'Fernando Lázaro','es','f.lazaro@gdes.com','1234',NULL,NULL,NULL,1,9,8,NULL,0,1),
(10,12,'André Martínez','fr','an.martinez@gdes.com','1234',NULL,NULL,NULL,2,3,NULL,NULL,0,1),
(11,13,'Patrice Guerra','fr','p.guerra@gdes.com','1234',NULL,NULL,NULL,2,1,8,NULL,0,1),
(12,9,'Jorge Luis Uzcátegui','es','j.uzcategui@gdes.com','1234',NULL,NULL,NULL,4,4,6,NULL,0,0),
(13,2,'Fernando Fernandez','es','f.fernandez@gdes.com','1234',NULL,NULL,NULL,3,6,4,NULL,0,0),
(14,14,'Vassil Gueorguiev Hristov Georgiev','es','v.hristov@gdes.com','1234','2017-04-26 13:35:50','2017-04-26 18:35:50','yO7tf',4,7,7,NULL,0,1),
(15,14,'Ramses Anguizola','es','r.anguizola@gdes.com','1234',NULL,NULL,NULL,4,7,7,NULL,0,1),
(16,15,'Ramón Almoguera','es','r.almoguera_ext@gdes.com','1234',NULL,NULL,NULL,5,5,NULL,NULL,0,1),
(18,1,'Nelia Martínez','es','n.martinez@gdes.com','1234','2017-05-03 12:23:18','2017-05-03 17:23:18','OPnDB',NULL,NULL,NULL,NULL,1,0),
(19,14,'José Mariano Ríos','es','j.rios@gdes.com','1234','2017-02-02 09:49:30','2017-02-02 14:49:30','VJnVw',4,7,7,0,0,1),
(20,3,'Enrique Monzó Blasco','es','e.monzo@gdes.com','1234','2017-04-27 16:42:44','2017-04-27 21:42:44','z8ZjG',1,2,5,1,0,1),
(21,3,'Francisco Ruiz Sanchez','es','f.ruiz@gdes.com','1234','2017-03-27 12:21:37','2017-03-27 17:21:37','1bkN9',1,2,5,1,0,1),
(22,5,'Arturo Pascual','es',NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,0,1),
(23,13,'Catherine Paul','fr',NULL,NULL,NULL,NULL,NULL,2,1,8,NULL,0,0),
(24,2,'TEST1','es','t1','t1',NULL,NULL,NULL,1,1,1,1,0,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
