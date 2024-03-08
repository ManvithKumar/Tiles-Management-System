PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `users` (`uid` INTEGER PRIMARY KEY AUTOINCREMENT, `username` TEXT, `email` TEXT, `address` TEXT, `password` TEXT, `createdOn` TEXT, `role` TEXT);
INSERT INTO users VALUES(1000,'manvith','kumarmanvith0@gmail.com','Mangalore','123456','06-03-2024','admin');
CREATE TABLE tiles(
    tid INTEGER PRIMARY KEY AUTOINCREMENT,
    tname TEXT,
    type TEXT,
    stock INTEGER,
    price INTEGER
    createdOn TEXT    
, `image` TEXT);
CREATE TABLE IF NOT EXISTS "reviews"(
    rid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    tid INTEGER,
    comment TEXT,
    rating INTEGER,
    createdOn TEXT , 
    FOREIGN KEY(uid) REFERENCES users(uid),
    FOREIGN KEY(tid) REFERENCES tiles(tid) 
);
CREATE TABLE IF NOT EXISTS "orders"(
    oid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    tid INTEGER,
    price INTEGER,
    quantity INTEGER,
    orderdOn TEXT,
    deliveredOn TEXT ,
    FOREIGN KEY(uid) REFERENCES  users(uid),
    FOREIGN KEY(tid) REFERENCES tiles(tid)   
);
CREATE TABLE IF NOT EXISTS "payment"(
    pid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    oid INTEGER,
    price INTEGER,
    paymentType TEXT,
    createdOn TEXT ,
    FOREIGN KEY(uid) REFERENCES users(uid),
    FOREIGN KEY(oid) REFERENCES orders(oid)   
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',1001);
INSERT INTO sqlite_sequence VALUES('reviews',0);
INSERT INTO sqlite_sequence VALUES('orders',0);
INSERT INTO sqlite_sequence VALUES('payment',0);
COMMIT;
