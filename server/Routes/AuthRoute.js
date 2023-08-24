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
router.get('/users/:userId', grantAccess('readOwn', 'profile'), getUserById);

router.get('/users', getUsers);

router.put('/users/:userId', grantAccess('updateAny', 'profile'), updateUser);

router.delete('/users/:userId', grantAccess('deleteAny', 'profile'), deleteUser);

// router.put('/user/:userId/profile', verifyTokenAndUser, allowIfLoggedin, grantAccess('updateOwn', 'profile'), updateUser);



// Middlewares
router.post('/', verifyTokenAndUser, rootControllerFunction);

module.exports = router;
