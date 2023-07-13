CREATE TABLE IF NOT EXISTS `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `matricula` varchar(9) DEFAULT NULL,
  `curso` varchar(30) DEFAULT NULL,
  `foto` longblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Department` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `review_amount` int DEFAULT '0',
  `average_professor` float DEFAULT '0',
  `average_courses` float DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Professor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `average` float DEFAULT '0',
  `review_amount` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `professor_ibfk_1` (`department_id`),
  CONSTRAINT `professor_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `Department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Course` (
  `id` varchar(25) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` int NOT NULL,
  `average` float DEFAULT '0',
  `review_amount` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `review_ibfk_1_idx` (`department`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`department`) REFERENCES `Department` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `professor_id` int NOT NULL,
  `course_id` varchar(25) DEFAULT NULL,
  `average_professor` float DEFAULT '0',
  `average_course` float DEFAULT '0',
  `review_amount` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17094 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Adms` (
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `adms_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT '0',
  `class_id` int NOT NULL,
  `prof_score` float NOT NULL,
  `prof_txt` mediumtext,
  `course_score` float NOT NULL,
  `course_txt` mediumtext,
  PRIMARY KEY (`review_id`),
  KEY `review_ibfk_2_idx` (`class_id`),
  KEY `review_ibfk_1` (`user_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `Class` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `Report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `review_id` int NOT NULL,
  `reviewer_id` int DEFAULT NULL,
  `reason` mediumtext,
  `accepted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `report_ibfk_2_idx` (`review_id`),
  KEY `report_ibfk_3_idx` (`reviewer_id`),
  KEY `report_ibfk_1` (`user_id`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`),
  CONSTRAINT `report_ibfk_2` FOREIGN KEY (`review_id`) REFERENCES `Review` (`review_id`),
  CONSTRAINT `report_ibfk_3` FOREIGN KEY (`reviewer_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER ;;

CREATE TRIGGER `update_review_is_blocked` AFTER UPDATE ON `Report` FOR EACH ROW BEGIN
  IF NEW.accepted = 1 THEN
    UPDATE `Review`
    SET `is_blocked` = true
    WHERE `review_id` = NEW.review_id;
  END IF;
END ;;

CREATE TRIGGER `update_class_averages` AFTER INSERT ON `Review` FOR EACH ROW BEGIN
  UPDATE `Class`
  SET `average_professor` = (
    (`average_professor` * `review_amount` + NEW.prof_score) / (`review_amount` + 1)
  )
  WHERE `id` = NEW.class_id;

  UPDATE `Class`
  SET `average_course` = (
    (`average_course` * `review_amount` + NEW.course_score) / (`review_amount` + 1)
  ),
  `review_amount` = `review_amount` + 1
  WHERE `id` = NEW.class_id;
END ;;

CREATE TRIGGER `update_professor_averages` AFTER INSERT ON `Review` FOR EACH ROW BEGIN
  UPDATE `Professor`
  SET `average` = (
    (`average` * `review_amount` + NEW.prof_score) / (`review_amount` + 1)
  ),
  `review_amount` = `review_amount` + 1
  WHERE `id` IN (
    SELECT `professor_id`
    FROM `Class`
    WHERE `id` = NEW.class_id
  );
END ;;

CREATE TRIGGER `update_course_averages` AFTER INSERT ON `Review` FOR EACH ROW BEGIN
  UPDATE `Course`
  SET `average` = (
    (`average` * `review_amount` + NEW.prof_score) / (`review_amount` + 1)
  ),
  `review_amount` = `review_amount` + 1
  WHERE `id` IN (
    SELECT `course_id`
    FROM `Class`
    WHERE `id` = NEW.class_id
  );
END ;;

CREATE TRIGGER `update_depto_averages` AFTER INSERT ON `Review` FOR EACH ROW BEGIN
  UPDATE `Department`
  SET `average_professor` = (
    (`average_professor` * `review_amount` + NEW.prof_score) / (`review_amount` + 1)
  )
  WHERE `id` IN (
    SELECT `department_id`
    FROM `Professor`
    WHERE `id` IN (
      SELECT `professor_id`
      FROM `Class`
      WHERE `id` = NEW.class_id
    )
  );
END;;


 
