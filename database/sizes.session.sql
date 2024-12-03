CREATE TABLE sizes(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
)
--@block 
SELECT *
FROM sizes --@block 
INSERT INTO sizes(name)
VALUES ("Women"),
    --@block 
    drop table sizes 
    --@block 
    TRUNCATE sizes