const express = require('express');
const productController = require('./../controllers/productController');

const router = express.Router();

router
  .route('/most-costly')
  .get(productController.aliasCostlyProducts, productController.getAllProducts);

router
  .route('/top-10-cheapest')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-stats').get(productController.getProductStats);

router.route('/montly-plan/:year').get(productController.getMonthlyPlan);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
