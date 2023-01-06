const sqlQuery = require("../config/db");

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
      cookies = req.cookies;
      console.log(cookies)
      q =
        "SELECT * FROM items WHERE " +
        queryProcess[0] +
        " and " +
        queryProcess[1] +
        " and " +
        queryProcess[2] +
        " and " +
        queryProcess[3];
      // console.log(q);
      const items = await sqlQuery(q);

      const getUser = await sqlQuery("SELECT * FROM users WHERE id = " + cookies.userId)
      console.log(getUser)
      //   console.log(items)
      // shuffle items at random
      //   for (let i = items.length - 1; i > 0; i--) {
      //     const j = Math.floor(Math.random() * (i + 1));
      //     [items[i], items[j]] = [items[j], items[i]];
      //   }

      const availableBrands = await sqlQuery(
        "SELECT DISTINCT brand FROM items"
      );
      res.render("items/index", {
        items,
        availableBrands,
        isSignedIn: cookies.isSignedIn,
        user: getUser[0],
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getCartItems: async (req, res) => {
    try {
      cookies = req.cookies;
      console.log(cookies);
     
      if (cookies.isSignedIn == "true") {
        const getUser = await sqlQuery("SELECT * FROM users WHERE id = " + cookies.userId)
        const user = getUser[0];
        q =
          "SELECT * FROM shopping_cart sc JOIN items i ON i.id = sc.itemId and sc.userId = " +
          user.id;
        const cartItems = await sqlQuery(q);
        const totalCost = await sqlQuery(
          "SELECT SUM(i.price * sc.quantity) as total FROM shopping_cart sc JOIN items i ON i.id = sc.itemId and sc.userId = " +
            user.id
        );
        console.log(totalCost);
        res.render("cart/index", { cartItems, totalCost });
      } else {
        msg = "Please <a href='/signin'>Sign In</a>";
        res.status(400).send(msg);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  addItemToCart: async (req, res) => {
    try {
      var item_id = req.params.item_id;
      cookies = req.cookies;
      const getUser = await sqlQuery("SELECT * FROM users WHERE id = " + cookies.userId)
      const user = getUser[0];
      // console.log(cookies)

      q =
        "Select count(*) as c from shopping_cart where itemId = " +
        item_id +
        " and userId = " +
        user.id;
      const countItems = await sqlQuery(q);

      if (countItems[0].c == 0) {
        q =
          "INSERT INTO shopping_cart (itemId, quantity, userId) VALUES (" +
          item_id +
          ", 1, " +
          user.id +
          ") ";
        await sqlQuery(q);
      } else {
        q =
          "UPDATE shopping_cart SET quantity = quantity + 1 WHERE itemId = " +
          item_id +
          " and userId = " +
          user.id;

        await sqlQuery(q);
      }

      if (req.headers.referer == "http://localhost:3000/")
        res.status(204).send();
      else res.redirect(req.headers.referer);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteItemFromCart: async (req, res) => {
    try {
      var item_id = req.params.item_id;
      cookies = req.cookies;
      const getUser = await sqlQuery("SELECT * FROM users WHERE id = " + cookies.userId)
      const user = getUser[0];

      q =
        "Select quantity as q from shopping_cart where itemId = " +
        item_id +
        " and userId = " +
        user.id;
      const countItems = await sqlQuery(q);
      if (countItems.length != 0) {
        var quantity = countItems[0].q;
        console.log(quantity);

        if (quantity > 1)
          qry =
            "UPDATE shopping_cart SET quantity = " +
            (quantity - 1) +
            " WHERE itemId = " +
            item_id +
            " and userId = " +
            user.id;
        else
          qry =
            "DELETE FROM shopping_cart WHERE itemId = " +
            item_id +
            " and userId = " +
            user.id;

        await sqlQuery(qry);
      }
      if (req.headers.referer == "http://localhost:3000/")
        res.status(204).send();
      else res.redirect(req.headers.referer);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  signin_page: async (req, res) => {
    try {
      res.render("signin/index");
    } catch (err) {
      res.status(500).send(err);
    }
  },
  signin: async (req, res) => {
    try {
      // console.log(req.body)
      q =
        "SELECT * FROM users WHERE email = '" +
        req.body.email +
        "' and pword = '" +
        req.body.password +
        "'";

      const authenticate = await sqlQuery(q);
      if (authenticate.length == 1) {
        res.cookie("isSignedIn", true);
        res.cookie("userId", authenticate[0].id);

        res.redirect("/");
      } else {
        res.cookie("isSignedIn", false);
        res.cookie("userId", -1);

        res.redirect(req.headers.referer);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  signout: async (req, res) => {
    try {
      res.clearCookie("userId");
      res.clearCookie("user");
      res.cookie("isSignedIn", false);
      res.redirect(req.headers.referer);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  checkout: async (req, res) => {
    try {
      const getUser = await sqlQuery("SELECT * FROM users WHERE id = " + cookies.userId)
      const user = getUser[0];

      const userBalance = await sqlQuery("SELECT balance from users WHERE id = "+user.id);
      const totalCost = await sqlQuery(
        "SELECT SUM(i.price * sc.quantity) as total FROM shopping_cart sc JOIN items i ON i.id = sc.itemId and sc.userId = " +
          user.id
      );
      const balanceAfterCheckout = userBalance[0].balance - parseInt(totalCost[0].total)
      console.log(balanceAfterCheckout)
      if(balanceAfterCheckout > 0)
      {
        // Checkout Success
        await sqlQuery("UPDATE users SET balance = " + balanceAfterCheckout + " WHERE id = " + user.id)
        res.redirect('/');
      }
      else
      {
        msg = "Insufficient Money in your Wallet. Go back to the cart from <a href='/cart'>here</a>"
        res.status(204).send(msg);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};