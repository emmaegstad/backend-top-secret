const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router().post('/', async (req, res) => {
  const secret = await Secret.insert(req.body);
  res.send(secret);
});
