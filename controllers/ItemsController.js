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
          var queryProcess = queryParamProcess(req.query);
    
          q =
            "SELECT * FROM items WHERE " +
            queryProcess[0] +
            " and " +
            queryProcess[1] +
            " and " +
            queryProcess[2] +
            " and " +
            queryProcess[3];
          console.log(q);
          const items = await sqlQuery(q);
          //   console.log(items)
          // shuffle items at random
          //   for (let i = items.length - 1; i > 0; i--) {
          //     const j = Math.floor(Math.random() * (i + 1));
          //     [items[i], items[j]] = [items[j], items[i]];
          //   }
    
          const availableBrands = await sqlQuery(
            "SELECT DISTINCT brand FROM items"
          );
          res.render("items/index", { items, availableBrands });
        } catch (err) {
          res.status(500).send(err);
        }
      },

      getCartItems: async (req, res) => {
        try {
          q = "SELECT * FROM shopping_cart sc JOIN items i ON i.id = sc.itemId ";
          const cartItems = await sqlQuery(q);
          const availableBrands = await sqlQuery(
            "SELECT DISTINCT brand FROM items"
          );
          res.render("cart/index", { cartItems, availableBrands });
        } catch (err) {
          res.status(500).send(err);
        }
      },
      addItemToCart: async (req, res) => {
        try {
          var item_id = req.params.item_id;
    
          q = "Select count(*) as c from shopping_cart where itemId = " + item_id;
          const countItems = await sqlQuery(q);
    
          if (countItems[0].c == 0) {
            q =
              "INSERT INTO shopping_cart (itemId, quantity) VALUES (" +
              item_id +
              ", 1) ";
            await sqlQuery(q);
          } else {
            q =
              "UPDATE shopping_cart SET quantity = quantity + 1 WHERE itemId = " +
              item_id;
    
            await sqlQuery(q);
          }
    
          res.redirect(req.headers.referer);
        } catch (err) {
          res.status(500).send(err);
        }
      },
      deleteItemFromCart: async (req, res) => {
        try {
          var item_id = req.params.item_id;
    
          q = "Select quantity as q from shopping_cart where itemId = " + item_id;
          const countItems = await sqlQuery(q);
          if (countItems.length != 0) {
            var quantity = countItems[0].q;
            console.log(quantity);
    
            if (quantity > 1)
              qry =
                "UPDATE shopping_cart SET quantity = " +
                (quantity - 1) +
                " WHERE itemId = " +
                item_id;
            else qry = "DELETE FROM shopping_cart WHERE itemId = " + item_id;
    
            await sqlQuery(qry);
          }
          res.redirect(req.headers.referer);
        } catch (err) {
          res.status(500).send(err);
        }
      },
    };