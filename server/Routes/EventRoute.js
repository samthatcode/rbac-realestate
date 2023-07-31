const express = require('express');
const router = express.Router();

const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');
const { createEvents, getEvents, getEventDetails, registerForEvent } = require('../Controllers/EventController');

// Get all events
router.get('/events', allowIfLoggedin, getEvents);
// get event details
router.get('/events:eventId', allowIfLoggedin, getEventDetails);
// create an event
router.post('/events', allowIfLoggedin, createEvents);

// Register for an event
router.post('/events/:eventId/registerations', allowIfLoggedin, registerForEvent);

module.exports = router;
