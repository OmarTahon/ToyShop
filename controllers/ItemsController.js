const sqlQuery = require('../config/db');

function queryParamProcess(query) {
    var minVal = query.min;
    var maxVal = query.max;
    var brand = query.brand;
    var searchVal = query.search;
  
    var minQ, maxQ, brandQ, searchQ;
  
    if (minVal == undefined || minVal <= 0 || isNaN(minVal)) minQ = "true";
    else minQ = "price >= " + minVal;
  
    if (maxVal == undefined || maxVal <= 0 || isNaN(maxVal)) maxQ = "true";
    else maxQ = "price <= " + maxVal;
  
    if (brand == undefined || brand == "all") brandQ = "true";
    else brandQ = "brand = '" + brand + "'";
  
    if (searchVal == undefined || searchVal == "") searchQ = "true";
    else
      searchQ =
        "(name = '" +
        searchVal +
        "' or name like '" +
        searchVal +
        "%') or (brand = '" +
        searchVal +
        "' or brand like '" +
        searchVal +
        "%')";
  
    return [minQ, maxQ, brandQ, searchQ];
  }

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
