const express = require('express');
const router = express.Router();
const { upload } = require('../server'); 


const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/ProductController');
const { allowIfAdmin, verifyTokenAndUser, allowIfLoggedin } = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/UserController');

// Product Routes
router.post('/products', upload.array('images'), allowIfLoggedin, allowIfAdmin, grantAccess('createAny', 'product'), createProduct);

router.get('/products', getProducts);

router.get('/products/:productId', allowIfLoggedin, allowIfAdmin, grantAccess('readAny', 'product'), getProductById);

router.put('/products/:productId', upload.array('images'), allowIfLoggedin, allowIfAdmin,  grantAccess('updateAny', 'product'), updateProduct);

router.delete('/products/:productId', allowIfLoggedin, allowIfAdmin, grantAccess('deleteAny', 'product'), deleteProduct);

module.exports = router;