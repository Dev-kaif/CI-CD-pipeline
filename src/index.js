// index.js

const express = require('express');
const app = express();
const PORT = 3000; // You can change the port if needed

app.get('/', (req, res) => {
  res.send('Hello World! I am new here 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







