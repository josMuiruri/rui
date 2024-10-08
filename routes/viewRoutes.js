const express = require('express');
const viewsController = require('./../controllers/viewsController');

const router = express.Router();

// overview
router.get('/', viewsController.getOverview);
router.get('/product', viewsController.getProduct);

module.exports = router;
