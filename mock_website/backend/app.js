const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Backend' });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});