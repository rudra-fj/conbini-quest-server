// --- 1. IMPORT YOUR PACKAGES ---
// This is like loading your tools from the toolbox.
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // This is the tool for connecting to PostgreSQL

// --- 2. SET UP YOUR SERVER ---
const app = express();
const PORT = 8080; // This is the "door number" your server will use

// This line allows your server to accept requests from your React front-end
app.use(cors());
app.use(express.json()); // This allows our server to read JSON from requests

// --- 3. CONNECT TO YOUR DATABASE ---
// IMPORTANT: Replace 'your_password' with the actual password you created for PostgreSQL
const pool = new Pool({
  user: 'postgres', // The default user for PostgreSQL
  host: 'localhost',
  database: 'conbini_quest',
  password: 'Gabbar@1234', // <<<< CHANGE THIS
  port: 5432, // The default port for PostgreSQL
});


// --- 4. CREATE YOUR API ENDPOINTS ---
// An "endpoint" is a specific URL that your server listens for.

// GET Endpoint for all stores
app.get('/api/stores', async (req, res) => {
  try {
    const allStores = await pool.query('SELECT * FROM stores');
    res.json(allStores.rows); // Send the list of stores back to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST Endpoint to add a new item
app.post('/api/items', async (req, res) => {
  try {
    // Get the data sent from the form
    const { name, description, store_id } = req.body;

    // Simple validation
    if (!name || !store_id) {
      return res.status(400).json({ error: 'Name and store_id are required' });
    }

    // The SQL query to insert a new item
    const newItem = await pool.query(
      'INSERT INTO items (name, description, store_id, date_spotted) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, description, store_id]
    );

    res.status(201).json(newItem.rows[0]); // Send the new item back
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET Endpoint for all items
app.get('/api/items', async (req, res) => {
  try {
    // Order by date_spotted to get the newest items first
    const allItems = await pool.query('SELECT * FROM items ORDER BY date_spotted DESC');
    res.json(allItems.rows); // Send the list of items back to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// --- 5. START YOUR SERVER ---
// This line "turns on" your server and makes it listen for requests on your chosen port.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});