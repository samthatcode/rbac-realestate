const express = require('express');
const router = express.Router();
const { upload } = require('../server');


const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/ProductController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/UserController');

// Product Routes
router.post('/products', upload.array('images'), grantAccess('createAny', 'product'), createProduct);

router.get('/products', grantAccess('readAny', 'product'), getProducts);

router.get('/products/:productId', grantAccess('readAny', 'product'), getProductById);

router.put('/products/:productId', upload.array('images'), grantAccess('updateAny', 'product'), updateProduct);

router.delete('/products/:productId', grantAccess('deleteAny', 'product'), deleteProduct);

module.exports = router;