require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./src/config/db');
const routes = require('./src/routes/index');

const app = express();
//Middleware express.json() is used to parse incoming JSON requests and put the parsed data in req.body. This allows us to easily access the data sent by the client in the request body, which is essential for handling POST and PUT requests where data is often sent in JSON format.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Error:', error.message);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});