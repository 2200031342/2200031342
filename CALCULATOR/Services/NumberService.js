const axios = require('axios');

let windowSize = 10;
let numberWindow = [];

const apiMap = {
  'p': 'http://20.244.56.144/evaluation-service/primes',
  'f': 'http://20.244.56.144/evaluation-service/fibo',
  'e': 'http://20.244.56.144/evaluation-service/even',
  'r': 'http://20.244.56.144/evaluation-service/rand'
};

async function getNumbers(type) {
  const url = apiMap[type];

  if (!url) {
    throw new Error('Invalid number type');
  }

  let windowPrevState = [...numberWindow];
  let numbers = [];

  try {
    const response = await Promise.race([
  axios.get(url, {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3ODkzOTgyLCJpYXQiOjE3NDc4OTM2ODIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImEwZWY3YmI1LWQ2MjktNGJmZS1iMTA4LWY0NGExNmM3YjI5MSIsInN1YiI6IjIyMDAwMzEzNDJjc2VoQGdtYWlsLmNvbSJ9LCJlbWFpbCI6IjIyMDAwMzEzNDJjc2VoQGdtYWlsLmNvbSIsIm5hbWUiOiJ2YW5kYW5hIHZpbmF5IHNhaSIsInJvbGxObyI6IjIyMDAwMzEzNDIiLCJhY2Nlc3NDb2RlIjoiYmVUSmpKIiwiY2xpZW50SUQiOiJhMGVmN2JiNS1kNjI5LTRiZmUtYjEwOC1mNDRhMTZjN2IyOTEiLCJjbGllbnRTZWNyZXQiOiJXRFVidnB1WFFGRlNoZHpQIn0.YWqbKOK6JQF_G4pl5O-oHnuauhhR4yPEOaB8PVTrtLI'
    }
  }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 500)
  )
]);

    numbers = response.data.numbers;

    const uniqueNewNumbers = numbers.filter(n => !numberWindow.includes(n));

    numberWindow = [...numberWindow, ...uniqueNewNumbers].slice(-windowSize);

    const avg =
      numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length;

    return {
      windowPrevState,
      windowCurrState: numberWindow,
      numbers,
      avg: parseFloat(avg.toFixed(2))
    };
  } catch (err) {
    return {
      windowPrevState,
      windowCurrState: numberWindow,
      numbers: [],
      avg: numberWindow.length
        ? parseFloat(
            (
              numberWindow.reduce((sum, num) => sum + num, 0) /
              numberWindow.length
            ).toFixed(2)
          )
        : 0
    };
  }
}

module.exports = { getNumbers };