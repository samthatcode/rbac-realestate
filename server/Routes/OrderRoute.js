const express = require('express');
const router = express.Router();

const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require("../Controllers/OrderController");
const { grantAccess } = require('../Controllers/UserController');
const {
    allowIfAdmin,
    verifyTokenAndUser,
    allowIfLoggedin
} = require("../Middlewares/AuthMiddleware");

// Order Routes
router.post('/orders', verifyTokenAndUser, allowIfLoggedin, grantAccess('createAny', 'order'), createOrder);

router.get('/orders', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'order'), getOrders);

router.get('/orders/:orderId', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'order'), getOrderById);

router.put('/orders/:orderId', verifyTokenAndUser, allowIfLoggedin, grantAccess('updateAny', 'order'), updateOrder);

router.delete('/orders/:orderId', verifyTokenAndUser, allowIfLoggedin, grantAccess('deleteAny', 'order'), deleteOrder);

module.exports = router;