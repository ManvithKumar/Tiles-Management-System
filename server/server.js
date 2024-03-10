const express = require('express');
const sqlite = require('sqlite3').verbose()
const cors = require('cors')
const multer = require('multer')
const colors = require('colors')
const moment = require('moment')

const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json());
app.use(cors())


const db = new sqlite.Database('./tms.db',sqlite.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message)
    else console.log("Database Connected".america)
})

//Get  Users
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


//Getuser
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json(row);
    });
});


// Create a new user  (Register)
app.post('/users', (req, res) => {
  const { username, email, password, address } = req.body;
  const role = "user";
  const createdOn = moment().format("Do MMMM YYYY");

  db.run("INSERT INTO users (username, email, password, address, createdOn, role) VALUES (?, ?, ?, ?, ?, ?)",
    [username, email, password, address, createdOn, role], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, username, email, address, createdOn, role });
  });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

//Tiles:

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Get all tiles
  app.get('/tiles', (req, res) => {
    db.all("SELECT * FROM tiles", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.get('/tiles/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM tiles WHERE tid = ?", id, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Tile not found' });
      }
      res.json(row);
    });
  });
  

  
  // Create a new tile
  app.post('/tiles', (req, res) => {
    const { tname, type, stock, price,image,description } = req.body;
    var tid;
    const  createdOn = moment().format("Do MMMM YYYY");
    db.run(`
      INSERT INTO tiles (tid,tname, type, stock, price, image,description)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `, [tid,tname, type, stock, price, image,description], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ tid: this.lastID });
    });
  });

  app.put('/tiles/:tid', (req, res) => {
    const tid = req.params.tid;
    const { tname, type, stock, price,image,description } = req.body;
    const createdOn = moment().format("Do MMMM YYYY");
    
    db.run(`
      UPDATE tiles
      SET tname = ?, type = ?, stock = ?, price = ?, image = ?,description = ?
      WHERE tid = ?
    `, [tname, type, stock, price, image,description, tid], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ tid });
    });
  });
  


  // Delete a tile
app.delete('/tiles/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM tiles WHERE tid = ?`, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Tile deleted successfully' });
  });
});




//Reviews :
app.get('/reviews', (req, res) => {
    db.all("SELECT * FROM reviews", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  // Get a review by ID
  app.get('/reviews/:rid', (req, res) => {
    const rid = req.params.rid;
    db.get("SELECT * FROM reviews WHERE rid = ?", [rid], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(row);
    });
  });
  
  // Create a new review
  app.post('/reviews', (req, res) => {
    const { uid, tid, comment, rating } = req.body;
    const  createdOn = moment().format("Do MMMM YYYY");
    db.run(`
      INSERT INTO reviews (uid, tid, comment, rating, createdOn)
      VALUES (?, ?, ?, ?, ?)
    `, [uid, tid, comment, rating, createdOn], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ rid: this.lastID });
    });
  });
  
  // Update a review by ID
  app.put('/reviews/:rid', (req, res) => {
    const rid = req.params.rid;
    const  createdOn = moment().format("Do MMMM YYYY");
    const { uid, tid, comment, rating } = req.body;
    db.run(`
      UPDATE reviews
      SET uid = ?, tid = ?, comment = ?, rating = ?, createdOn = ?
      WHERE rid = ?
    `, [uid, tid, comment, rating, createdOn, rid], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Review updated successfully' });
    });
  });
  
  // Delete a review by ID
  app.delete('/reviews/:rid', (req, res) => {
    const rid = req.params.rid;
    db.run("DELETE FROM reviews WHERE rid = ?", [rid], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Review deleted successfully' });
    });
  });

  app.get('/reviews/tiles/:tid', (req, res) => {
    const tid = req.params.tid;
    db.all("SELECT * FROM reviews WHERE tid = ?", tid, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });



//Orders

app.post('/orders', (req, res) => {
  const orderdOn = moment().format("Do MMMM YYYY");
  const { uid, tid, price, quantity, deliveredOn } = req.body;
  db.run(`
    INSERT INTO orders (uid, tid, price, quantity, orderdOn, deliveredOn)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [uid, tid, price, quantity, orderdOn, deliveredOn], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      // Select the inserted order from the database
      db.get(`SELECT * FROM orders WHERE oid = ?`, [orderId], (err, row) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ order: row }); // Return the inserted order
      });
  });
});

  
  // Read Orders (GET)
  app.get('/orders', (req, res) => {
    db.all("SELECT * FROM orders", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  // Update Order (PUT/PATCH)
  app.put('/orders/:oid', (req, res) => {
    const oid = req.params.oid;
    const  createdOn = moment().format("Do MMMM YYYY");
    const { uid, tid, price, quantity, deliveredOn } = req.body;
    db.run(`
      UPDATE orders
      SET uid = ?, tid = ?, price = ?, quantity = ?, orderedOn = ?, deliveredOn = ?
      WHERE oid = ?
    `, [uid, tid, price, quantity, orderedOn, deliveredOn, oid], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Order updated successfully' });
    });
  });
  
  // Delete Order (DELETE)
  app.delete('/orders/:oid', (req, res) => {
    const oid = req.params.oid;
    db.run("DELETE FROM orders WHERE oid = ?", oid, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Order deleted successfully' });
    });
  });


  //Payment

  // Create Payment (POST)
app.post('/payments', (req, res) => {
    const  createdOn = moment().format("Do MMMM YYYY");
    const { uid, oid, price, paymentType,address,phonenumber } = req.body;
    db.run(`
      INSERT INTO payment (uid, oid, price, paymentType, createdOn,address,phonenumber)
      VALUES (?, ?, ?, ?, ?)
    `, [uid, oid, price, paymentType, createdOn,address,phonenumber], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ pid: this.lastID });
    });
  });
  
  // Read Payments (GET)
  app.get('/payments', (req, res) => {
    db.all("SELECT * FROM payment", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  // Update Payment (PUT/PATCH)
  app.put('/payments/:pid', (req, res) => {
    const pid = req.params.pid;
    const  createdOn = moment().format("Do MMMM YYYY");
    const { uid, oid, price, paymentType } = req.body;
    db.run(`
      UPDATE payment
      SET uid = ?, oid = ?, price = ?, paymentType = ?, createdOn = ?
      WHERE pid = ?
    `, [uid, oid, price, paymentType, createdOn, pid], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Payment updated successfully' });
    });
  });
  
  // Delete Payment (DELETE)
  app.delete('/payments/:pid', (req, res) => {
    const pid = req.params.pid;
    db.run("DELETE FROM payment WHERE pid = ?", pid, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Payment deleted successfully' });
    });
  });


// External Quersies and APi


//get all orders by uid
app.get('/orders/:uid', (req, res) => {
    const uid = req.params.uid;
    db.all("SELECT * FROM orders WHERE uid = ?", uid, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

// Get Payments by User ID (UID)
app.get('/payments/:uid', (req, res) => {
    const uid = req.params.uid;
    db.all("SELECT * FROM payment WHERE uid = ?", uid, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });


  app.get('/orders/tileInfo/:oid/', (req, res) => {
    const oid = req.params.oid;
  
    db.get(`
      SELECT t.tname, t.type,t.price,t.image
      FROM orders AS o
      JOIN tiles AS t ON o.tid = t.tid
      WHERE o.oid = ?
    `, [oid], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (!row) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json({ tname: row.tname, type: row.type, image:row.image, price:row.price });
    });
  });
  



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
