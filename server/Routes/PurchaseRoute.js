const express = require('express');
const router = express.Router();

const { createPurchase, getPurchaseById, updatePurchase, deletePurchase } = require('../Controllers/PurchaseController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/UserController');

// Purchase Routes
router.post('/purchases', verifyTokenAndUser, allowIfAdmin, grantAccess('createAny', 'purchase'), createPurchase);

router.get('/purchases/:purchaseId', verifyTokenAndUser, grantAccess('readAny', 'purchase'), getPurchaseById);

router.put('/purchases/:purchaseId', verifyTokenAndUser, grantAccess('updateAny', 'purchase'), updatePurchase);

router.delete('/purchases/:purchaseId', verifyTokenAndUser, grantAccess('deleteAny', 'purchase'), deletePurchase);

module.exports = router;
