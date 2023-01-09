CREATE TABLE transaction_locks
(id         SERIAL PRIMARY KEY NOT NULL,
 hash   VARCHAR(100) NOT NULL,
 inserted_at TIMESTAMP DEFAULT NOW(),
 CONSTRAINT hash_unique UNIQUE (hash)
);
