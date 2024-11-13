const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewsController.getProduct,
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/sign-up',
  authController.isLoggedIn,
  viewsController.getSignUpForm,
);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-products',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyProducts,
);

module.exports = router;
