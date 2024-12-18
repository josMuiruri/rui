const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router
  .route('/most-costly')
  .get(productController.aliasCostlyProducts, productController.getAllProducts);

router
  .route('/top-10-cheapest')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-stats').get(productController.getProductStats);

router
  .route('/montly-plan/:year')
  .get(
    authController.protect,
    authController.restrictPro('admin', 'chief-cashier', 'cashier'),
    productController.getMonthlyPlan,
  );

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictPro('admin', 'chief-cashier'),
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.createProduct,
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictPro('admin', 'chief-cashier'),
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictPro('admin', 'chief-cashier'),
    productController.deleteProduct,
  );

module.exports = router;
