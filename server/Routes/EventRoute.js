const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 

const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');
const { createEvents, getEvents, getEventById, registerForEvent } = require('../Controllers/EventController');


// create an event
router.post('/events', upload.single('eventImage'), createEvents);
// Get all events
router.get('/events', getEvents);

// Define a route to get a single event by id
router.get("/events/:id", getEventById);


// Register for an event
router.post('/events/:eventId/registerations', registerForEvent);

module.exports = router;
