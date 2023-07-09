const express = require('express');
const router = express.Router();

const {
  updateUserRole
} = require('../Controllers/AdminController');


const {
  verifyTokenAndUser,
  allowIfLoggedin,
  allowIfAdmin,
} = require('../Middlewares/AuthMiddleware');

router.put('/users/:userId/role/admin', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'admin') });

router.put('/users/:userId/role/marketer', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'marketer') });

router.put('/users/:userId/role/user', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, (req, res) => { updateUserRole(req, res, 'user') });


module.exports = router;
