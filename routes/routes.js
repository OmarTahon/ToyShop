const express = require('express');
const router = express.Router();

//import controllers
const ItemsController = require('../controllers/ItemsController');

/* define routes */
router.get('/', ItemsController.getItems);


// define route to go to the cart
router.get('/cart', ItemsController.getCartItems);

// define route to go to the cart
router.get('/add/to/cart/:item_id', ItemsController.addItemToCart);

// define route to go to the cart
router.get('/delete/from/cart/:item_id', ItemsController.deleteItemFromCart);


module.exports = router;