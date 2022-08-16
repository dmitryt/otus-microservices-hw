CREATE TABLE users
(id         SERIAL PRIMARY KEY NOT NULL,
 username   VARCHAR(1000) NOT NULL,
 first_name VARCHAR(1000),
 last_name  VARCHAR(1000),
 email      VARCHAR(1000),
 phone      VARCHAR(1000),
 CONSTRAINT username_unique UNIQUE (username)
);