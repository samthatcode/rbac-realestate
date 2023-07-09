const express = require('express');
const router = express.Router();
const {
    Signup,
    Login,
    Logout,
    grantAccess,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
} = require('../Controllers/UserController');

const {
    verifyTokenAndUser,
    rootControllerFunction,
    allowIfLoggedin,
    allowIfAdmin,
} = require("../Middlewares/AuthMiddleware");

router.post('/signup', Signup);

router.post('/login', Login);

router.post('/logout', Logout);

// authRoute
router.get('/user/:userId', verifyTokenAndUser, allowIfLoggedin, grantAccess('readOwn', 'profile'), getUserById);

router.get('/user', verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'profile'), getUsers);

router.put('/user/:userId', verifyTokenAndUser, allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/user/:userId', verifyTokenAndUser, allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

// router.put('/user/:userId/profile', verifyTokenAndUser, allowIfLoggedin, grantAccess('updateOwn', 'profile'), updateUser);



// Middlewares
router.post('/', verifyTokenAndUser, rootControllerFunction);

module.exports = router;
