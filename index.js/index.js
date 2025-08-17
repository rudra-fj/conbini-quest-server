// --- 1. IMPORT YOUR PACKAGES ---
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// --- 2. SET UP YOUR SERVER ---
const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());

// --- 3. CONNECT TO YOUR DATABASE ---
// This has been updated with the SSL configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false // <-- THIS IS THE NEW SSL CONFIG
  }
});

// --- NEW: TEST DATABASE CONNECTION ON STARTUP ---
const checkDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('!!! DATABASE CONNECTION FAILED !!!', err);
    // We exit the process if the DB connection fails.
    // Render will see this and report an error.
    process.exit(1);
  }
};

// --- 4. CREATE YOUR API ENDPOINTS ---
app.get('/api/stores', async (req, res) => {
  try {
    const allStores = await pool.query('SELECT * FROM stores');
    res.json(allStores.rows);
  } catch (err) {
    console.error('ERROR FETCHING STORES:', err); // <-- Updated for more detailed logging
    res.status(500).send('Server error');
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const allItems = await pool.query('SELECT * FROM items ORDER BY date_spotted DESC');
    res.json(allItems.rows);
  } catch (err) {
    console.error('ERROR FETCHING ITEMS:', err); // <-- Updated for more detailed logging
    res.status(500).send('Server error');
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { name, description, store_id } = req.body;
    if (!name || !store_id) {
      return res.status(400).json({ error: 'Name and store_id are required' });
    }
    const newItem = await pool.query(
      'INSERT INTO items (name, description, store_id, date_spotted) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, description, store_id]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error('ERROR POSTING ITEM:', err); // <-- Updated for more detailed logging
    res.status(500).send('Server error');
  }
});

// --- 5. START YOUR SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Run the connection test after the server starts
  checkDbConnection();
});