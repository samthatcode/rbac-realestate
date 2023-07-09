const Client = require('../Models/ClientModel');

// Create a new client
module.exports.createClient = async (req, res, next) => {
  try {
    const { name, email, associatedMarketerId, referralCode } = req.body;

    // Check if the referral code is unique before creating the client
    const existingClient = await Client.findOne({ referralCode });
    if (existingClient) {
      return res.status(400).json({ error: 'Referral code already exists' });
    }

    const client = await Client.create({
      name,
      email,
      associatedMarketer: associatedMarketerId,
      referralCode
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
    const clientId = req.params.id;
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
    const clientId = req.params.id;
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

