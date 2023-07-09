const express = require('express');
const router = express.Router();

const {
    verifyTokenAndUser,
    allowIfLoggedin,
    allowIfAdmin } = require('../Middlewares/AuthMiddleware');

const { grantAccess } = require('../Controllers/UserController');

const {
    createInvestment,
    getInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment, } = require('../Controllers/InvestmentController');

router.post(
    '/investments',
    verifyTokenAndUser,
    allowIfLoggedin,
    allowIfAdmin,
    grantAccess('createAny', 'investment'),
    createInvestment
);

router.get(
    '/investments',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('readAny', 'investment'),
    getInvestments
);

router.get(
    '/investments/:investmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('readAny', 'investment'),
    getInvestmentById
);

router.put(
    '/investments/:investmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('updateAny', 'investment'),
    updateInvestment
);

router.delete(
    '/investments/:investmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('deleteAny', 'investment'),
    deleteInvestment
);


module.exports = router;
