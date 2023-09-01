const express = require('express');
const router = express.Router();

const {
    contactFormHandler
} = require('../Controllers/ContactController');

router.post('/contact', contactFormHandler);

module.exports = router;

