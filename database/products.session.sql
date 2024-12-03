--@block 
CREATE TABLE products(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(225) NOT NULL,
    slug VARCHAR(225) NOT NULL,
    brand_id CHAR(36),
    descriptionBrief VARCHAR(225) NOT NULL,
    descriptionDetails VARCHAR(225) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    UNIQUE (slug, deletedAt),
    FOREIGN KEY (brand_id) REFERENCES brands(uuid)
)
--@block 
SELECT *
FROM products 

--@block 
    -- INSERT INTO products(name, slug)
    -- VALUES
    -- ("Women", "woman"), 

    --@block 
    drop table products 
    
    --@block 
    TRUNCATE products