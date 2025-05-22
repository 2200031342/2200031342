const express = require('express');
const app = express();
const port = 9876;

const { getNumbers } = require('./services/numberService');

app.get('/numbers/:numberid', async (req, res) => {
  const type = req.params.numberid;
  try {
    const result = await getNumbers(type);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
