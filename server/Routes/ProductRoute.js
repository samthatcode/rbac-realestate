const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 


const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/ProductController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/UserController');

// Product Routes
router.post('/products', upload.array('images'), createProduct);

router.get('/products', getProducts);

router.get('/products/:productId', getProductById);

router.put('/products/:productId', upload.array('images'), updateProduct);

router.delete('/products/:productId', deleteProduct);

module.exports = router;