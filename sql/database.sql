-- DB 관리
CREATE DATABASE resmemory;

-- users 서비스
CREATE TABLE `Users` (
    `userId` BIGINT auto_increment NOT NULL , 
    `email` VARCHAR(255) NOT NULL, 
    `nickname` VARCHAR(255) NOT NULL, 
    `password` VARCHAR(255) NOT NULL, 
    `createdAt` DATETIME, 
    `updatedAt` DATETIME, 
    `deletedAt` DATETIME DEFAULT NULL,
    `kakaoId` VARCHAR(255) DEFAULT NULL ,  
    PRIMARY KEY (`userId`));
CREATE TABLE `Bookmarks` (
    `bookmarkId` BIGINT auto_increment NOT NULL , 
    `postId` BIGINT NOT NULL, 
    `userId` BIGINT NOT NULL,   
    `createdAt` DATETIME, 
    FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`bookmarkId`));

-- reports 서비스
CREATE TABLE `Reports` (
  `reportId` BIGINT  auto_increment,
  `userId` BIGINT NOT NULL,
  `reportType` ENUM('post', 'comment', 'thread') NOT NULL, 
  `contentId` BIGINT NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `isReport` ENUM('true', 'false', '2') DEFAULT 'false',
  `createdAt` DATETIME,
  PRIMARY KEY (`reportId`));

 -- threads 서비스
CREATE TABLE `Threads` (
    `threadId` BIGINT  auto_increment, 
    `userId` BIGINT NOT NULL, 
    `content` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME, 
    `deletedAt` DATETIME DEFAULT NULL, 
    PRIMARY KEY (`threadId`)
    );
    
 -- posts 서비스
    CREATE TABLE `Posts` (
  `postId` BIGINT auto_increment, 
  `userId` BIGINT NOT NULL, 
  `title` VARCHAR(255) NOT NULL, 
  `content` VARCHAR(500) NOT NULL, 
  `img` VARCHAR(255) DEFAULT NULL, 
  `viewCount` BIGINT DEFAULT 0, 
  `category` ENUM('1970', '1980', '1990', '2000', '2010', '2020', "notice") NOT NULL, 
  `createdAt` DATETIME, 
  `updatedAt` DATETIME, 
  `deletedAt` DATETIME DEFAULT NULL, 
  `notice` BOOLEAN DEFAULT FALSE, 
  `thumbnail` VARCHAR(255) DEFAULT NULL, 
  PRIMARY KEY (`postId`)
);

CREATE TABLE `Comments` (
  `commentId` BIGINT auto_increment, 
  `userId` BIGINT NOT NULL, 
  `postId` BIGINT NOT NULL, 
  `content` VARCHAR(255) NOT NULL, 
  `createdAt` DATETIME, 
  `updatedAt` DATETIME, 
  `deletedAt` DATETIME DEFAULT NULL, 
  FOREIGN KEY (`postId`) REFERENCES `Posts` (`postId`) 
    ON DELETE CASCADE ON UPDATE CASCADE, 
  PRIMARY KEY (`commentId`)
);