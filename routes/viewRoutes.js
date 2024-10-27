const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use('/', authController.isLoggedIn);

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
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData,
// );

module.exports = router;
