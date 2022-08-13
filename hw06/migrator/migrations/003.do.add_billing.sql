CREATE TABLE items
(id         SERIAL PRIMARY KEY NOT NULL,
 title   VARCHAR(100) NOT NULL,
 price   DOUBLE PRECISION NOT NULL,
 created_at TIMESTAMP DEFAULT NOW(),
 updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE balances (
  id      SERIAL PRIMARY KEY NOT NULL,
  user_id int NOT NULL UNIQUE,
  balance   DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE orders (
  id      SERIAL PRIMARY KEY NOT NULL,
  user_id int NOT NULL,
  price   DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE orders_items (
  order_id int NOT NULL ,
  item_id int NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  purchased_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (order_id, item_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE
);

INSERT INTO items (title, price) VALUES ('Iron', 100);
INSERT INTO items (title, price) VALUES ('Smart Watch', 200);
INSERT INTO items (title, price) VALUES ('TV', 300);
INSERT INTO items (title, price) VALUES ('Washing mashine', 400);
INSERT INTO items (title, price) VALUES ('Laptop', 500);
