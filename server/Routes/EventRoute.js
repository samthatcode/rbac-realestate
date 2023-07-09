const express = require('express');
const router = express.Router();

const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');
const { getEvents, registerForEvent } = require('../Controllers/EventController');

// Get all events
router.get('/', allowIfLoggedin, getEvents);

// Register for an event
router.post('/:eventId/register', allowIfLoggedin, registerForEvent);

module.exports = router;
