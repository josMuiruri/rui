const express = require('express');
const productController = require('./../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllTours)
  .post(productController.createTour);

router
  .route('/:id')
  .get(productController.getTour)
  .patch(productController.updateTour)
  .delete(productController.deleteTour);

module.exports = router;
