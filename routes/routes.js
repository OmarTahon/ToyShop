const express = require('express');
const router = express.Router();
var cookieParser = require('cookie-parser')
router.use(cookieParser())
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

// define route to sign Up
router.get('/signin', ItemsController.signin_page)

// define route to sign Up
router.post('/signin', ItemsController.signin)

// define route to Sign Out
router.get('/signout', ItemsController.signout)

// define route to Check out
router.get('/checkout', ItemsController.checkout)
module.exports = router;
    
