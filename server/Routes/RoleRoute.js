const express = require('express');
const router = express.Router();


const { createRole, getRoles, updateRole, deleteRole } = require('../Controllers/RoleController');

const {
    allowIfAdmin,
    verifyTokenAndUser,
    allowIfLoggedin
} = require("../Middlewares/AuthMiddleware");

router.post('/roles', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, createRole);
router.get('/roles', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, getRoles);
router.put('/roles/:Id', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, updateRole);
router.delete('/roles/:Id', verifyTokenAndUser, allowIfLoggedin, allowIfAdmin, deleteRole);

module.exports = router;