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
      Authorization: 'Bearer {token}'
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