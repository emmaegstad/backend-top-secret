const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const secret = await Secret.insert(req.body);
      res.send(secret);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res) => {
    console.log('in controller');
    const secrets = await Secret.findAll();
    res.send(secrets);
  });
