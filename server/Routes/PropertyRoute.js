const express = require('express');
const router = express.Router();

const { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } = require('../Controllers/PropertyController');

const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");

const { grantAccess } = require('../Controllers/UserController');

// Create a new property
router.post('/properties', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, grantAccess('createAny', 'property'), createProperty);

// Get all properties
router.get('/properties', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'property'), getProperties);

// Get a single property by ID
router.get('/properties/:propertyId', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'property'), getPropertyById);

// Update a property
router.put('/properties/:propertyId', verifyTokenAndUser, allowIfLoggedin, grantAccess('updateAny', 'property'), updateProperty);

// Delete a property
router.delete('/properties/:propertyId', verifyTokenAndUser, allowIfLoggedin, grantAccess('deleteAny', 'property'), deleteProperty);

module.exports = router;
