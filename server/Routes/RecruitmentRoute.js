const express = require('express');
const router = express.Router();

const {
    createRecruitment,
    getRecruitments,
    getRecruitmentById,
    updateRecruitment,
    deleteRecruitment,
} = require('../Controllers/RecruitmentController');

const {
    verifyTokenAndUser,
    allowIfLoggedin,
    allowIfAdmin,
} = require('../Middlewares/AuthMiddleware');

const { grantAccess } = require('../Controllers/UserController');

// Recruitment Routes
router.post(
    '/recruitments',
    verifyTokenAndUser,
    allowIfLoggedin,
    allowIfAdmin,
    grantAccess('createAny', 'recruitment'),
    createRecruitment
);

router.get(
    '/recruitments',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('readAny', 'recruitment'),
    getRecruitments
);

router.get(
    '/recruitments/:recruitmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('readAny', 'recruitment'),
    getRecruitmentById
);

router.put(
    '/recruitments/:recruitmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('updateAny', 'recruitment'),
    updateRecruitment
);

router.delete(
    '/recruitments/:recruitmentId',
    verifyTokenAndUser,
    allowIfLoggedin,
    grantAccess('deleteAny', 'recruitment'),
    deleteRecruitment
);

module.exports = router;
