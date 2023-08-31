const express = require('express');
const router = express.Router();
const { upload } = require('../server');
const { createLand, getLands, getLandById, updateLand, deleteLand } = require('../Controllers/LandController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedIn } = require('../Middlewares/AuthMiddleware');
const { grantAccess } = require('../Controllers/UserController');

// Land Routes
router.post('/lands', upload.array('images'), createLand);

router.get('/lands', getLands);

router.get('/lands/:landId', getLandById);

router.put('/lands/:landId', upload.array('images'), updateLand);

router.delete('/lands/:landId', deleteLand);

module.exports = router;
