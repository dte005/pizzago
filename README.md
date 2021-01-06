# PIZZAGO API
API for a pizza delivery with managing of users, token, cart and orders.
It was developed with NODEJS without any external framework.
The Menu is a very short one so we have few pizzas. :)

### HOW TO USE
It is ease to use. Just have to run "node index.js" inside the folder's project. Then use some software like "postman" to make REST requests:
[POST, GET, UPDATE, DELETE]

### MAIN JOURNEY ENDPOINTS
Those endpoint bellow show the user journey to buy items:
* [POST : http://localhost:3000/users] sending a body like:

email, address, firstName, lastName, phone, password

Here we are creating an user. We have also how to GET, UPDATE an DELETE but we need a token.

* [POST : http://localhost:3000/tokens] sending a body like:

email, password

Here we are getting a token. The response give us the MENU. Save this response in order to get the codes for the plates. We can POST and DELETE a token.

* [POST: http://localhost:3000/cart sending a body like:

email, codItem, qtd

Here we are adding / creating a item inside a cart. The first reponse is an object with the cart. if you want to check the cart we have a GET, UDDATE and DELETE for cart.

* [POST: http://localhost:3000/pay sendgin a body like:

email, number (card number - "4242 4242 4242 4242"), expMonth, expYear, cvc

Here we are creating a card on stripe then we pay the cart. After a order is created and the cart has a status of payed.

If you want to check an order:
* [GET http://localhost:3000/orders?email=**yourEmail**] - Last order created
* [GET http://localhost:3000/orders/list?email=**yourEmail**] - List all orders. Then you pick one order to check with getOne
* [GET http://localhost:3000/orders/one?email=**yourEMail**&order=**ncp66ir2fz4**] - Check one order

### ALL ENDPOINTS
USERS
* [GET http://localhost:3000/users?email=**yourEmail**]
* [POST http://localhost:3000/users]
* [UPDATE http://localhost:3000/users]
* [DELETE http://localhost:3000/users?email=**yourEmail**]

TOKENS
* [POST http://localhost:3000/tokens]
* [DELETE http://localhost:3000/tokens?token=**8tcuu66xuzp5jhhqc9g6**]

CART
* [GET http://localhost:3000/cart?email=**yourEmail**]
* [POST http://localhost:3000/cart]
* [UPDATE http://localhost:3000/cart]
* [DELETE http://localhost:3000/cart?email=**yourEmail**&item=**1002**]
* **[POST http://localhost:3000/cart/pay]**

ORDERS
* [GET http://localhost:3000/orders?email=**yourEmail**]
* [GET http://localhost:3000/orders/list?email=**yourEmail**]
* [GET http://localhost:3000/orders/one?email=**yourEmail**&order=**ncp66ir2fz4**]

### WHAT IS NICE ?
1 ) We have a models folder to be much ease to check the fields of the files
2 ) We have a separated validation and authorization procedures. It works by sending an array of methods that must be executed forward (next). almost like middlewares. :)
