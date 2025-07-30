-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ca2_dealeshipapp
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer_info`
--

DROP TABLE IF EXISTS `customer_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_info` (
  `first name` varchar(45) NOT NULL,
  `last name` varchar(45) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(20) NOT NULL,
  `dob` date NOT NULL,
  `contact` int NOT NULL,
  `license` varchar(10) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `role` tinytext NOT NULL,
  `staffid` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_info`
--

LOCK TABLES `customer_info` WRITE;
/*!40000 ALTER TABLE `customer_info` DISABLE KEYS */;
INSERT INTO `customer_info` VALUES ('Thomas','Jason','ThoJas','thomas@jason.com','123456789','2004-03-24',98765432,'T12345678J',1,'staff','T1231E'),('Russel','Soh','RusSoh','Russel@gmail.com','987654321','2006-09-16',98765678,'R21345367S',2,'user',''),('gamer','smily','smilyplays','smily@yahoo.com','gamsil','1998-04-20',87695453,'G12356748S',3,'user',''),('Peter','Parker','peter Park','Peterparker@unknownCo.com','p123p456','1998-06-20',90462924,'G12386748P',4,'staff','T09672P'),('kiefer','loh','Kieloh','kiefer@loh.com','password20','2024-03-30',98765432,'K12356748L',5,'admin','T09672P'),('sendilcoumar','Aathithyan','Aathi','sendilcoumar@aathithyan.com','123456','2006-04-20',90856723,'A12386748A',6,'admin','T04682P');
/*!40000 ALTER TABLE `customer_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealership`
--

DROP TABLE IF EXISTS `dealership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_name` varchar(45) NOT NULL,
  `pricetag` decimal(20,2) NOT NULL,
  `description` text NOT NULL,
  `owner` varchar(45) NOT NULL,
  `date_of_publish` date NOT NULL,
  `image` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealership`
--

LOCK TABLES `dealership` WRITE;
/*!40000 ALTER TABLE `dealership` DISABLE KEYS */;
INSERT INTO `dealership` VALUES (1,'Volkswagon',20000.00,'...','Alice','2024-01-14','volks.png'),(3,'BMW',65000.00,'new','Charlie','2024-03-08','BMW.png'),(4,'Toyota 13th edition',20000.00,'test 15','smil','2023-04-20','cars3.png'),(7,'Mercedes',40000.00,'updated descriptions','peter','2025-04-20','Mercedes.png'),(8,'customised Drag Pontiac',80000.00,'Fully customised Drag Pontiac','Peter ','2025-04-18','car4.png');
/*!40000 ALTER TABLE `dealership` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30 21:21:09
