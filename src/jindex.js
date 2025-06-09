// index.js

const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('I am gonna rule this world 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







