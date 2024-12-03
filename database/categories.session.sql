--@block 
CREATE TABLE categories(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL,
    slug VARCHAR(225) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    UNIQUE (slug, deletedAt)
);
--@block 
SELECT *
FROM categories --@block 
INSERT INTO categories(name, slug)
VALUES ("Women", "woman"),
    ("Men", "men"),
    ("Kids", "kids"),
    ("Fashion", "fashion") 
    --@block 
    drop table categories 
    --@block 
    TRUNCATE categories