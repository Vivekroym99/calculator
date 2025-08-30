const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function calculate(num1, num2, operation) {
  switch (operation) {
    case 'add':
      return num1 + num2;
    case 'subtract':
      return num1 - num2;
    case 'multiply':
      return num1 * num2;
    case 'divide':
      if (num2 === 0) {
        throw new Error('Division by zero is not allowed');
      }
      return num1 / num2;
    default:
      throw new Error('Invalid operation');
  }
}

app.post('/api/calculate', (req, res) => {
  try {
    const { num1, num2, operation } = req.body;
    
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      return res.status(400).json({ error: 'Invalid numbers provided' });
    }
    
    const result = calculate(num1, num2, operation);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});