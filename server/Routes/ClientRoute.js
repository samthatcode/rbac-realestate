const express = require('express');
const router = express.Router();

const {
  createClient,
  getClient,
  updateClient
} = require('../Controllers/ClientController');

// Create a new client
router.post('/clients', createClient);

// Get client information
router.get('/clients/:id', getClient);

// Update client details
router.put('/clients/:id', updateClient);

module.exports = router;
