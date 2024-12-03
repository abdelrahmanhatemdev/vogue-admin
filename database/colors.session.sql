CREATE TABLE colors(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL,
    hex VARCHAR(225) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
)
--@block 
SELECT *
FROM colors --@block 
INSERT INTO colors(name)
VALUES ("Red"),

--@block 
    drop table colors 

    
    --@block 
    TRUNCATE colors