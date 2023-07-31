const Client = require('../Models/ClientModel');
const Marketer = require('../Models/MarketerModel');


// Create a new client
module.exports.createClient = async (req, res, next) => {
  try {
    const { name, email, referralLink } = req.body;

    // Find the marketer who has this referral link
    const associatedMarketer = await Marketer.findOne({ referralLink });

    if (!associatedMarketer) {
      return res.status(404).json({ error: 'Referral link not found' });
    }

    const client = await Client.create({
      name,
      email,
      associatedMarketer: associatedMarketer._id,
    });

    res.status(201).json({
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Get client information
module.exports.getClient = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ data: client });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update client details
module.exports.updateClient = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const { name, email } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { name, email },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

