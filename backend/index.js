const express = require('express');
const cors = require('cors');
const { connection } = require('./config/db');
require('dotenv').config();
const transactionsRouter = require('./routes/transactionRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionsRouter);

app.get('/', async (req, res) => {
  console.log('hello');
  res.send('hldlalf');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log('server is running on port ', PORT);
  } catch (err) {
    console.error(err);
  }
});
