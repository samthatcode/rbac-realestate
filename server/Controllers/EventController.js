const Event = require('../Models/EventModel');
const Registration = require('../Models/RegistrationModel');

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
