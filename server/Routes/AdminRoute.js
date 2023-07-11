const express = require('express');
const router = express.Router();

const {
  updateUserRole, getUsers, assignRole
} = require('../Controllers/AdminController');

const { grantAccess } = require('../Controllers/UserController');


const {
  verifyTokenAndUser,
  allowIfLoggedin,
  allowIfAdmin,
} = require('../Middlewares/AuthMiddleware');

// Get list of users (accessible only to admins)
router.get('/users', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, grantAccess('readAny', 'user'), getUsers);

// Assign role to a user (accessible only to admins)
router.put('/users/:userId/assign-role', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, grantAccess('updateAny', 'user'), assignRole);


router.put('/users/:userId/role/admin', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'admin') });

router.put('/users/:userId/role/marketer', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'marketer') });

router.put('/users/:userId/role/user', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'user') });


module.exports = router;
