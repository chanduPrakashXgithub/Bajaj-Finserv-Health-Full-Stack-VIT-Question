require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const FULL_NAME = process.env.FULL_NAME || 'N.Chandu Prakash Reddy'; 
const DOB = process.env.DOB || '27102002';            
const EMAIL = process.env.EMAIL || 'chandupersonal0@gmail.com';
const ROLL_NUMBER = process.env.ROLL_NUMBER || '22BCE20415';

function buildUserId(fullName, dob) {
  const clean = String(fullName).trim().toLowerCase().replace(/\s+/g, '_');
  return `${clean}_${dob}`;
}

function isIntegerString(s) {
  return /^-?\d+$/.test(s);
}
function isNumericString(s) {
  return /^-?\d+(\.\d+)?$/.test(s);
}
function isAlphaString(s) {
  return /^[A-Za-z]+$/.test(s);
}

app.post('/bfhl', (req, res) => {
  const user_id = buildUserId(FULL_NAME, DOB);

  try {
    const payload = req.body;
    if (!payload || !Array.isArray(payload.data)) {
      return res.status(400).json({
        is_success: false,
        user_id,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        message: '`data` must be an array'
      });
    }

    const input = payload.data;

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    const letters = []; 
    let sum = 0;

    for (const item of input) {
      const str = String(item).trim();

      if (isIntegerString(str)) {
        const n = parseInt(str, 10);
        if (Math.abs(n) % 2 === 1) odd_numbers.push(String(n));
        else even_numbers.push(String(n));
        sum += n;
        continue;
      }

      if (isNumericString(str)) {
        const f = parseFloat(str);
        sum += f;
        continue;
      }

      if (isAlphaString(str)) {
        alphabets.push(str.toUpperCase());
        const chars = str.match(/[A-Za-z]/g) || [];
        letters.push(...chars);
        continue;
      }

      special_characters.push(str);

      const mixedLetters = str.match(/[A-Za-z]/g);
      if (mixedLetters) letters.push(...mixedLetters);
    }

    const reversed = letters.slice().reverse();
    const concat_string = reversed
      .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');

    const sumString = Number.isInteger(sum) ? String(sum) : String(sum);

    const response = {
      is_success: true,
      user_id,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sumString,
      concat_string
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      is_success: false,
      user_id: buildUserId(FULL_NAME, DOB),
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      message: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
