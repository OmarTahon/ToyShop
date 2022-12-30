const sqlQuery = require('../config/db');

module.exports = {
    getItems: async (req, res) => {
        try {
            const items = await sqlQuery('SELECT * FROM items');
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.render('items/index', { items });
        } catch (err) {
            res.status(500).send(err);
        }
    },

    getItemsByBrand: async (req, res) => {
        
        try {   
            brand = req.params.brand
            q = "SELECT * FROM items WHERE items.brand = '" + brand + "'";
            const items = await sqlQuery(q);
            
            res.render('items/index', { items });
        } catch (err) {
            res.status(500).send(err);
        }
    },
    getCartItems : async (req, res) => {
        try {   
            q = "SELECT * FROM shopping_cart ";
            // const cartItems = await sqlQuery(q);
            cartItems = [{name:"toy"}, {name:"car"}]
            res.render('cart/index', {cartItems});
        } catch (err) {
            res.status(500).send(err);
        }
    }
}