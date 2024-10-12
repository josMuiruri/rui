const express = require('express');
const viewsController = require('./../controllers/viewsController');

const router = express.Router();

// overview
router.get('/', viewsController.getOverview);
router.get('/product/:slug', viewsController.getProduct);
router.get('/login', viewsController.getLoginForm);
router.get('/sign-up', viewsController.getSignUpForm);

module.exports = router;
