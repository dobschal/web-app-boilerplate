CREATE TABLE message (
       id INT NOT NULL AUTO_INCREMENT,
       chat_room_id INT NOT NULL,
       sender_id INT NOT NULL,
       type ENUM('text', 'image', 'file', 'audio', 'video'),
       content LONGTEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       PRIMARY KEY (id)
);