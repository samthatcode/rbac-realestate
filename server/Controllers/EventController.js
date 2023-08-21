const Event = require('../Models/EventModel');
const Registration = require('../Models/RegistrationModel');

// Create an event
module.exports.createEvents = async (req, res, next) => {
  try {
    const { name, date, time, location, description } = req.body;

    let eventImagePath = req.file.path; // Get the path of the uploaded image
    imagePath = imagePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes if you are on Windows

    const event = await Event.create({
      name, date, time, location, description,
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


// Get event details
module.exports.getEventDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    res.status(200).json({
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
