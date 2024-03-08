const express = require('express');
const sqlite = require('sqlite3').verbose()
const multer = require('multer')
const colors = require('colors')
const moment = require('moment')

const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json());

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
  var uid;
  var address;
  var role="user";
  const  createdOn = moment().format("Do MMMM YYYY");
  const { username, email,password } = req.body;
  db.run("INSERT INTO users (uid,username,email,address,password,createdOn,role) VALUES (?,?,?,?,?,?,?)", 
  [uid,username,email,address,password,createdOn,role], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
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
  
  // Create a new tile
  app.post('/tiles', upload.single('image'), (req, res) => {
    const { tname, type, stock, price } = req.body;
    const  createdOn = moment().format("Do MMMM YYYY");
    const image = req.file ? req.file.path : null;
    db.run(`
      INSERT INTO tiles (tname, type, stock, price, createdOn, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [tname, type, stock, price, createdOn, image], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ tid: this.lastID });
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


//Orders
app.post('/orders', (req, res) => {
    const  createdOn = moment().format("Do MMMM YYYY");
    const { uid, tid, price, quantity, deliveredOn } = req.body;
    db.run(`
      INSERT INTO orders (uid, tid, price, quantity, orderedOn, deliveredOn)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uid, tid, price, quantity, orderedOn, deliveredOn], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ oid: this.lastID });
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
    const { uid, oid, price, paymentType } = req.body;
    db.run(`
      INSERT INTO payment (uid, oid, price, paymentType, createdOn)
      VALUES (?, ?, ?, ?, ?)
    `, [uid, oid, price, paymentType, createdOn], function(err) {
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


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
