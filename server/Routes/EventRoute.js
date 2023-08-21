const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 

const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');
const { createEvents, getEvents, getEventDetails, registerForEvent } = require('../Controllers/EventController');


// create an event
router.post('/events', upload.single('image'), allowIfLoggedin, createEvents);
// Get all events
router.get('/events', allowIfLoggedin, getEvents);
// get event details
router.get('/events:eventId', allowIfLoggedin, getEventDetails);
// Register for an event
router.post('/events/:eventId/registerations', allowIfLoggedin, registerForEvent);

module.exports = router;
