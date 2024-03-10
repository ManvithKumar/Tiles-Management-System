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
INSERT INTO tiles VALUES(2006,'Black Marble','Floor',300,30,'uploads\1709981989525-black-marbled-surface.jpg');
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
INSERT INTO reviews VALUES(1,1000,2000,'not good',4,'9th March 2024');
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
INSERT INTO sqlite_sequence VALUES('reviews',1);
INSERT INTO sqlite_sequence VALUES('orders',2);
INSERT INTO sqlite_sequence VALUES('payment',0);
INSERT INTO sqlite_sequence VALUES('tiles',2006);
COMMIT;
