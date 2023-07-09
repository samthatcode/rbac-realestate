const express = require('express');
const router = express.Router();

const { registerForEvent } = require('../Controllers/RegistrationController');

// Register for an event
router.post('/events/:eventId/register', registerForEvent);

module.exports = router;
