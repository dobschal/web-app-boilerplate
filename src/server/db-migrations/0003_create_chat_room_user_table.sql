CREATE TABLE chat_room_user (
    chat_room_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uc_ids UNIQUE (chat_room_id, user_id),
    PRIMARY KEY (chat_room_id, user_id)
);