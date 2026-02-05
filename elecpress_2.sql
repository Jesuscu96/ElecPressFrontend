-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-02-2026 a las 10:46:05
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `elecpress_2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` bigint DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('inactive','active') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`id`, `first_name`, `last_name`, `company`, `phone`, `email`, `created_at`, `status`) VALUES
(1, 'Juan', 'García', 'HonyePop', 639136785, 'honeypop@official.com', '2023-01-10 12:50:43', 'active'),
(2, 'María', 'Pérez', 'ElectroVal', 612345678, 'maria.perez@electroval.com', '2024-08-15 14:55:43', 'active'),
(3, 'Carlos', 'Ruiz', 'NetPro', 69876543, 'carlos.ruiz@netpro.com', '2026-02-01 12:55:43', 'active'),
(4, 'Pedro', 'Murcia', NULL, 633182283, 'JuanMurcia55@gmail.com', '2026-02-01 12:55:43', 'active'),
(5, 'Lucía', 'Sánchez', 'Reformas LS', 655112233, 'lucia.sanchez@reformasls.com', '2026-02-01 10:25:49', 'active'),
(6, 'Ana', 'Ortiz', NULL, 635928156, 'anaortiz91@gmail.com', '2026-02-04 23:26:59', 'active');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipment`
--

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_category_equipment` int DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_category_equipment` (`id_category_equipment`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `id_category_equipment`, `image`) VALUES
(1, 'Taladro Eléctrico', 2, NULL),
(2, 'Arnes', 4, NULL),
(3, 'Radial', 2, NULL),
(4, 'Escalera 9 metros', 3, NULL),
(5, 'Ford Transit ', 1, NULL),
(6, 'Peugeot Partner', 1, NULL),
(7, 'Opel Combo', 1, NULL),
(8, 'Fiat Dobló', 1, NULL),
(9, 'Telurómetro', 5, NULL),
(10, 'Tester de Cables Redes RJ45', 5, NULL),
(11, 'Ponchadora Hidráulica-Eléctrica', 2, NULL),
(12, 'Soldador', 2, NULL),
(13, 'Sierra Eléctrica ', 2, NULL),
(14, 'Generador Portátil 3kW', 7, NULL),
(15, 'Juego de Destornilladores', 8, NULL),
(16, 'Casco de Seguridad', 9, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipment_categories`
--

DROP TABLE IF EXISTS `equipment_categories`;
CREATE TABLE IF NOT EXISTS `equipment_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipment_categories`
--

INSERT INTO `equipment_categories` (`id`, `name`) VALUES
(1, 'Vehículo'),
(2, 'Herramientas Eléctricas '),
(3, 'Escalera'),
(4, 'Epis'),
(5, 'Herramientas de Medición '),
(7, 'Generadores'),
(8, 'Herramientas Manuales'),
(9, 'Equipos de Protección Extra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materials`
--

DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_category_material` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materials_ibfk_1` (`id_category_material`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materials`
--

INSERT INTO `materials` (`id`, `name`, `id_category_material`, `price`, `image`) VALUES
(1, 'Cinta azul 20x19', 10, 3.00, NULL),
(2, 'Cinta Marrón 20x19', 10, 3.00, NULL),
(3, 'Cinta Gris 20x19', 10, 3.00, NULL),
(4, 'Cinta Negra 20x19', 10, 3.00, NULL),
(5, 'Cinta TT 20x19', 10, 3.00, NULL),
(6, 'Tubo 20mm 30m', 1, 22.00, NULL),
(7, 'Tubo 25mm 30m', 1, 27.00, NULL),
(8, 'Canaleta 40x20 2m', 15, 4.50, NULL),
(9, 'Conector Wago 221 (x10)', 16, 6.90, NULL),
(10, 'Borne Regleta 12 polos', 17, 2.20, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material_categories`
--

DROP TABLE IF EXISTS `material_categories`;
CREATE TABLE IF NOT EXISTS `material_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `material_categories`
--

INSERT INTO `material_categories` (`id`, `name`) VALUES
(1, 'Tubo Corrugado'),
(2, 'Tubo PVC'),
(3, 'Tubos Acero Inoxidable '),
(4, 'Cables unifilares'),
(5, 'Magueras'),
(6, 'Interruptores'),
(7, 'Enchufes'),
(8, 'Regletas'),
(9, 'Bridas'),
(10, 'Cinta Aislante'),
(11, 'Cajas Empotrables'),
(12, 'Cajas de Superficie'),
(13, 'Tornilleria '),
(14, 'Magnetotérmico'),
(15, 'Canaleta'),
(16, 'Conectores'),
(17, 'Bornes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `budget` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','development','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `id_client` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_client` (`id_client`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `projects`
--

INSERT INTO `projects` (`id`, `name`, `created_at`, `budget`, `status`, `id_client`) VALUES
(1, 'Instalación Nave Industrial', '2026-01-11 14:47:00', 12000.00, 'pending', 2),
(2, 'Reforma Eléctrica Oficina', '2026-01-08 09:11:21', 4500.00, 'pending', 5),
(3, 'Cableado Red Local', '2026-01-27 08:27:17', 2800.00, 'pending', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project_equipment`
--

DROP TABLE IF EXISTS `project_equipment`;
CREATE TABLE IF NOT EXISTS `project_equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `equipment_id` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_equipment` (`project_id`,`equipment_id`),
  KEY `equipment_id` (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `project_equipment`
--

INSERT INTO `project_equipment` (`id`, `project_id`, `equipment_id`, `quantity`) VALUES
(1, 2, 1, 1),
(2, 3, 14, 1),
(3, 1, 10, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project_materials`
--

DROP TABLE IF EXISTS `project_materials`;
CREATE TABLE IF NOT EXISTS `project_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` decimal(10,2) NOT NULL DEFAULT '1.00',
  `material_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_material` (`project_id`,`material_id`),
  KEY `project_materials_ibfk_1` (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `project_materials`
--

INSERT INTO `project_materials` (`id`, `quantity`, `material_id`, `project_id`) VALUES
(1, 3.00, 6, 1),
(2, 4.00, 9, 3),
(3, 4.00, 8, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `project_users`
--

DROP TABLE IF EXISTS `project_users`;
CREATE TABLE IF NOT EXISTS `project_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_user` (`project_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `project_users`
--

INSERT INTO `project_users` (`id`, `user_id`, `project_id`) VALUES
(1, 4, 1),
(2, 5, 2),
(3, 4, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` enum('superAdmin','admin','user','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `first_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role`, `first_name`, `last_name`, `password`, `email`, `birth_date`, `created_at`, `image`, `phone`) VALUES
(1, 'superAdmin', 'Jesús', 'Clemente', '123456', 'jclementeuroz@gmail.com', '1996-09-12', '2025-11-20 10:44:26', '', 608164665),
(2, 'admin', 'Jose Miguel', 'López', '123456', 'jesemiguel@elecpress.com', '1988-04-02', '2026-01-13 14:22:18', '', 638125687),
(3, 'admin', 'Luis', 'Murcia', '123456', 'luismur@elecpress', '1978-07-15', '2026-01-09 07:35:39', '', 639195697),
(4, 'user', 'Antonio', 'Navarro', '123456', 'antonionav@elecpress.com', '1974-11-13', '2026-02-01 11:27:49', '', 672158627),
(5, 'user', 'Pablo', 'Gómez', '123456', 'pablo.gomez@elecpress.com', '1990-03-08', '2026-02-02 15:37:41', '', 611223344),
(6, 'admin', 'Sara', 'Linares', '123456', 'sara.linares@elecpress.com', '1994-06-21', '2025-12-17 08:33:21', '', 622334455),
(7, 'admin', 'David', 'Ortega', '123456', 'david.ortega@elecpress.com', '1986-12-05', '2025-11-28 12:41:52', '', 633445566),
(8, 'user', 'Juan', 'Perez', '$2y$10$wB7scYkBsJ7cxjKCpfPY1.gJWd4dl2d7qcKaZrKXGLPfb/szXvgmq', 'prueba6@test.com', '1992-05-11', '2026-02-03 19:01:20', NULL, 600123123),
(9, 'user', 'Agustin', 'Montesa', '$2y$10$C54vazDiqhxcVAlyPDTcXuFMBMwm6onxL0qd3xnVloYIxW7CZCE8S', 'agustin@elecpress.com', '1979-10-01', '2026-02-03 19:10:29', NULL, 603153729);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`id_category_equipment`) REFERENCES `equipment_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Filtros para la tabla `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`id_category_material`) REFERENCES `material_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Filtros para la tabla `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Filtros para la tabla `project_equipment`
--
ALTER TABLE `project_equipment`
  ADD CONSTRAINT `project_equipment_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `project_equipment_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Filtros para la tabla `project_materials`
--
ALTER TABLE `project_materials`
  ADD CONSTRAINT `project_materials_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `project_materials_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `project_users`
--
ALTER TABLE `project_users`
  ADD CONSTRAINT `project_users_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `project_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
