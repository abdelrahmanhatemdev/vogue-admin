--@block 
CREATE TABLE brands(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(225) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL, 
    slug VARCHAR(225) NOT NULL UNIQUE, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL
);

--@block 
SELECT * FROM brands

--@block 
-- INSERT INTO brands(name, slug)
-- VALUES
-- ("Women", "woman"), 


--@block 
drop table brands

--@block 
TRUNCATE brands


