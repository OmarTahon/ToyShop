# ToyShop
Assuming that you have already installed Node.js on your machine, you should follow the steps below to setup our sandbox:

- Clone our repo:

        git clone https://github.com/OmarTahon/ToyShop.git

- Install the app's dependencies:

        npm install
- Create an ".env" file and write the following, replacing the user and password of your own MySQL client:

        
        SQL_HOST=localhost
        SQL_USER=root
        SQL_PASSWORD=ABCDEF
        SQL_DATABASE=shop
        
## Project description 
It's a simple web application for a toy shop where it contains the following:

- The user should find himself on the home page where all the items available on the website are listed
- Each item has it's Name, Brand, Description, Price, and Image
- Each user has a first_name, last_name, email, password, balance, and id
- A shopping cart has two forign keys, itemId, and userId, a quantity and id
![DE](https://user-images.githubusercontent.com/103469262/211391673-a9cf610c-f31f-48fa-8705-8b7bda9914a2.jpg)
  
- Search bar
- Minimum value bar, maximum value bar
- Drop down list contains all the a available brands
- 

The User can do the following:
- User can search for a speciffic items using the search bar
- The search can be done using the item's name or the brand
- The user can filter the search results by typing the minimum value and maximum value of the items he wishes to find
- The user can filter the search results by selecting the brand he wants from the drop down list

In order to add some items to the shopping cart, the user has to sign in first
- By clicking on the Sign In bottun, the user finds himself on the sign in page where he need to write his email and pasword by triggering the following route:
        router.get('/signin', ItemsController.signin_page)

- After entering the email and password the user will return to the home page with the ability to add items to the shopping cart

After the signing in process, the welcom sentence will show up containing the user name followed by his wallet balance.
the options available on each item will change to contain extra two buttons 
- +1 button where on every click the item should be added to the cart with an amount equals to the number of clicks 
- -1 button which do the opposite of the +1 button

When the user finishes shopping, he can clicks on the cart icon to finish the purchasing process
- The user can see the total cost of the items he selected
- The user can see the items he selected
- Each item is represented by it's name, brand, image, quantity, and the total cost of that quantity of that item
- Each item has +1 button and -1 butten to modify the selected quantity of that item

The cart page contains another buttons
- 'BACK TO ITEMS LIST' button to return and select more items from the list
- 'Checkout' button to confirm the purchasing process

When clicking on the 'Checkout' button
- If the wallet balance is enough, the purchase process will complite
- If the wallet balance is less than the total cost, a message says 'Insufficient Money in your Wallet. Go back to the cart from here' will appear
- When the user chicks on 'here', he will return to his cart to modefy the items to make the total cost less than the wallet balance





