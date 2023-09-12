const Registration = require('../Models/RegistrationModel');
const Event = require('../Models/EventModel');
const { dir } = require('../server');
const path = require('path');

// Create a new event
module.exports.createEvents = async (req, res, next) => {
  try {
    const { name, location, description } = req.body;

    // Convert incoming date and time to appropriate format
    let date = new Date(req.body.date);
    let time = new Date(`1970-01-01T${req.body.time}:00Z`);
    date = date.toISOString().split('T')[0]; // Get date string in 'yyyy-mm-dd' format
    time = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); // Convert time to 24-hour format

    // Get the uploaded image from req.file
    let eventImage = req.file;

    // Get the path of the uploaded image file
    let eventImagePath = path.relative(dir, eventImage.path);
    eventImagePath = eventImagePath.replace(/\\/g, '/');

    const event = await Event.create({
      name,
      date,
      time,
      location,
      description,
      eventImage: eventImagePath, // Save the path of the uploaded image
    });

    res.status(201).json({
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};



// Get all events
module.exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();

    res.status(200).json({
      data: events,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Get a single event by id
module.exports.getEventById = async (req, res, next) => {
  const eventId = req.params.id; // Assuming your route has a parameter named "id"

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      data: event,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Register for an event
module.exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { referringMarketerId } = req.body;

    // Create a new registration record
    const registration = await Registration.create({
      eventId,
      referringMarketerId,
    });

    res.status(201).json({
      message: 'Registration successful',
      data: registration,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
