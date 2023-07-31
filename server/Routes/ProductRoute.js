const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 


const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/ProductController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/UserController');

// Product Routes
router.post('/products', upload.array('images'), verifyTokenAndUser, allowIfAdmin, grantAccess('createAny', 'product'), createProduct);

router.get('/products', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'product'), getProducts);

router.get('/products/:productId', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'product'), getProductById);

router.put('/products/:productId', upload.array('images'), verifyTokenAndUser, allowIfLoggedin, grantAccess('updateAny', 'product'), updateProduct);

router.delete('/products/:productId', verifyTokenAndUser, allowIfLoggedin, grantAccess('deleteAny', 'product'), deleteProduct);

module.exports = router;