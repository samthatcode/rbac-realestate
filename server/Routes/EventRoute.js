const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 

const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');
const { createEvents, getEvents, registerForEvent } = require('../Controllers/EventController');


// create an event
router.post('/events', upload.single('eventImage'), createEvents);
// Get all events
router.get('/events', getEvents);

// Register for an event
router.post('/events/:eventId/registerations', registerForEvent);

module.exports = router;
