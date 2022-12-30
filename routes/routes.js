const express = require('express');
const router = express.Router();

//import controllers
const ItemsController = require('../controllers/ItemsController');

/* define routes */
router.get('/', ItemsController.getItems);

// define route to catch the items under which brand
router.get('/brand/:brand', ItemsController.getItemsByBrand);

// define route to go to the cart
router.get('/cart', ItemsController.getCartItems);

module.exports = router;
    

