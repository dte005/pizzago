const _con = require('../store/data');
const _cart = require('../store/cart');
const _order = require('../store/order');
const {createRandomToken, sendEmail} = require('../bin');
const {cartQueryStringValidation} = require('../validations');
const {paymentMethod, paymentIntentConfirmation} = require('../stripe');

/**
 * A USER HAS AN ACTIVE CART INTO HIS REGISTRATION
 * IF THERE IS A CART IN THE USER - UPDATE DE ITEM OR ADD A ITEM
 * IF THERE IS NOT A CART CREATE THE CART AND ADD A ITEM
 * IF THERE IS A CART AND ITEMS - UPDATE AND DELETE
 */

exports.getCart = (data, next, callback)=>{ //email=danieldts2013@gmail.com(QUERYSTR)
    const {email} = data.queryStr;
    if(cartQueryStringValidation(data)){
        _con.read('users', email, (e, dataUser)=>{
            if(!e && dataUser){
                if(dataUser.cart){
                    _cart.read(dataUser.cart, (e, dataCart)=>{
                        if(!e && dataCart){
                            callback(200, dataCart);
                        }else{
                            callback(404, {"Error": "Cart was not founded"});
                        }
                    });
                }else{
                    callback(401, {"Status": "No carts for this user"}); //OK .... THERE IS NO CART
                }
            }else{
                callback(404, {"Error": "This user does not exist"});
            }
        });
    }else{
        callback(404, {"Error": "Missing required fields"});
    }
}

exports.addItem = (data, next, callback)=>{ //CREATE A CART WITH ITEM PASSED OR ADD THE ITEM
    const {email, codItem, qtd} = data.buffer; //GET 
    _con.read('users', email, (e, dataUser)=>{ //READ THE USER TO VERIFY IF EMAIL EXISTS
        if(!e && dataUser){
            _con.read('menu', 'menu', (e, menu)=>{ //READ MENU TO CALCULATE DATA TO SEND
                if(!e && menu){
                    if(menu[codItem]){
                        let menuItem = menu[codItem];
                        if(dataUser.cart && dataUser.cart !== ""){ //VERIFY IF A CART WAS PASSED INTO BODY AND IF THERE IS A CART ACTIVE
                            _cart.read(dataUser.cart, (e, dataCart)=>{
                                if(!e && dataCart){
                                    let index = dataCart.items.findIndex(hit=>hit.codItem === codItem); //GETING THE ITEM THAT IS ALREADY INSIDE THE CART
                                    if(index !== -1){ //ITEM ALREADY EXISTS INTO ARRAY OF ITEMS
                                        dataCart.items[index].qtd = dataCart.items[index].qtd + qtd; //CHANGING ITEM FIELDS
                                        dataCart.items[index].totalPrice = dataCart.items[index].qtd * menuItem.price; //CHANGING ITEM FIELDS
                                    }else{ //ITEM DOES NOT EXISTS INSIDE THE ITEMS ARRAY, SO LETS ADD
                                        dataCart.items.push({"codItem":codItem, "qtd": qtd, "unitPrice": menuItem.price, "totalPrice": qtd * menuItem.price});
                                    }
                                    _cart.update(dataUser.cart, dataCart, (e)=>{ //ADDING THE ITEM TO THE CART
                                        if(!e){
                                            callback(200);
                                        }else{
                                            callback(500, {"Error": "Internal Server Error"});
                                        }
                                    });
                                }else{
                                    console.log(e);
                                    callback(404, {"Error": "The cart was not founded"});
                                }
                            });
                        }else{ //VERIFY IF A CART WAS NOT PASSED INTO BODY THEN CREATE CART AND ADD THE ITEM
                            let cartToken = createRandomToken(11);
                            if(cartToken){
                                let dataToSend={};
                                dataToSend.email = email;
                                dataToSend.items = [];
                                dataToSend.id = cartToken; //ADD THE ID OF THE CART
                                dataToSend.status = "pending"; //STATUS OF THE CART
                                dataToSend.items.push({"codItem":codItem, "qtd": qtd, "unitPrice": menuItem.price, "totalPrice": qtd * menuItem.price}); //ITEM OF THE CART

                                _cart.create(cartToken, dataToSend, (e)=>{ //CREATE CART
                                    if(!e){
                                        dataUser.cart = cartToken;
                                        _con.update('users', email, dataUser, (e)=>{ //UPDATING THE USER WITH THE NEW CART NUMBER
                                            if(!e){
                                                callback(200, {"Cart": dataToSend});
                                            }else{
                                                callback(500, {"Error": "Internal Server Error"});
                                            }
                                        })
                                    }else{
                                        callback(500, {"Error": "Internal Server Error"});
                                    }
                                });
                            }else{
                                callback(500, {"Error": "Internal Server Error"});
                            }
                        }

                    }else{
                        callback(404, {"Error": "Item not founded"});
                    }
                }else{
                    console.log(e);
                    callback(404, {"Error": "Item not founded"});
                }
            });
        }else{
            callback(404, {"Error": "User not found"});
        }
    });
}

exports.updateItem = (data, next, callback)=>{
    const {email, item, qtd} = data.buffer;
    _con.read('users', email, (e, dataUser)=>{
        if(!e && dataUser){
            _cart.read(dataUser.cart, (e, dataCart)=>{
                if(!e && dataCart){
                    let index = dataCart.items.findIndex(hit=>hit.codItem === item); //FINDING THE INDEX OF THE ITEM
                    if(index !== -1)dataCart.items[index].qtd = qtd; //CHANGE QTD
                    if(dataCart.items.find(hit=>hit.codItem === item)){ //CHECK IF EXIST
                        _cart.update(dataUser.cart, dataCart, (e)=>{ //UPDATE ITEM
                            if(!e){
                                callback(200);
                            }else{
                                callback(500, {"Error": "Internal server error"});
                            }
                        })
                    }else{
                        callback(404, {"Error": "This item is not inside the cart"});
                    }
                }else{
                    callback(401, {"Error": "No cart for this user. Please create a cart"});
                }
            });
        }else{
            callback(404, {"Error": "User not founded"});
        }
    });

}

exports.removeItem = (data, next, callback)=>{
    // DELETE COM QUERYSTR COM OS DADOS
    const {email, item} = data.queryStr;
    if(cartQueryStringValidation(data)){
        _con.read('users', email, (e, dataUser)=>{
            if(!e && dataUser){
                _cart.read(dataUser.cart, (e, dataCart)=>{
                    if(!e && dataCart){
                        let index = dataCart.items.findIndex(hit=>hit.codItem === item); //FIND INDEX 
                        if(index !== -1){
                            dataCart.items.splice(index, 1);
                            _cart.update(dataUser.cart, dataCart, (e)=>{
                                if(!e){
                                    callback(200);
                                }else{
                                    callback(500, {"Error": "Internal server error"});
                                }
                            })
                        }else{
                            callback(404, {"Error": "This item is not inside the cart"});
                        }
                    }else{
                        callback(404, {"Error": "Cart not founded"});
                    }
                });
            }else{
                callback(404, {"Error": "User not founded"});
            }
        });
    }else{
        callback(404, {"Error": "Missing required fields"});
    }
}

exports.pay = (data, next, callback)=>{ //START THE PAYMENT OF THE CART
    const {email, number, expMonth, expYear, cvc} = data.buffer;
    
    _con.read('users', email, (e, dataUser)=>{
        if(!e && dataUser){
            _cart.read(dataUser.cart, (e, dataCart)=>{
                if(!e && dataCart){
                    if(dataCart.items.length > 0 && dataCart.status === "pending"){ //VERIFY IF THE CART HAS ITEMS AND IT IS NT PAYED
                        let dataPayMethod = { //PAYMENT METHOD DATA TO SEND
                            "number": number,
                            "expMonth": expMonth,
                            "expYear": expYear,
                            "cvc": cvc
                        }

                        paymentMethod(dataPayMethod, (status, res)=>{
                            if(status === 200){
                                let total = 0;
                                let qtd = 0;
                                dataCart.items.forEach(hit=>{ //CALCULATING THE TOTAL AND QUANTITY FOR THE ORDER AND PAYMENT
                                    total += hit.totalPrice;
                                    qtd += hit.qtd;
                                });
                                let dataPay = { //PAYMENT CONFIRMATION DATA TO SEND
                                    "amount": parseInt(parseFloat(total.toFixed(2)) * 100),
                                    "currency": "brl",
                                    "id": res.id
                                }

                                paymentIntentConfirmation(dataPay, (status, res)=>{
                                    if(status === 200 && res.status === "succeeded"){ //AFTER PAYMENT CONFIRMATION
                                        let orderToken = createRandomToken(11);
                                        let dataToCreate = { //ORDER DATA TO CREATE
                                            "email": email,
                                            "qtd": qtd,
                                            "total": parseFloat(total.toFixed(2)),
                                            "status":"payed",
                                            "id": orderToken,
                                            "cart": dataCart.id
                                        }

                                        _order.create(orderToken, dataToCreate,(e)=>{
                                            if(!e){
                                                if(!dataUser.orders)dataUser.orders = [];
                                                dataUser.orders.push(orderToken); //ENTER ORDER INSIDE THE USER
                                                dataUser.cart = ""; //REALEASE THE ACTIVE CART
                                                _con.update('users', email, dataUser, (e)=>{ //UPDATING THE USER
                                                    if(!e){
                                                        dataCart.status = "payed";
                                                        _cart.update(dataCart.id, dataCart, (e)=>{ //CHANGE CART STATUS
                                                            if(!e){
                                                                let titulo = "Order: " +  orderToken + " Status Report";
                                                                let msg = "Congrats! Your order number: " + orderToken + " has been payed and it is been prepare to delivery";
                                                                sendEmail(email, titulo, msg, (e)=>{ //SEDING EMAIL TO THE COSTUMER
                                                                    if(!e){
                                                                        callback(200);
                                                                    }else{
                                                                        callback(500, {"Error": "Something went wrong sending an email for you"});
                                                                    }
                                                                });
                                                            }else{
                                                                callback(500, {"Error": "Internal server error"});
                                                            }
                                                        });
                                                    }else{
                                                        callback(500, {"Error": "Internal server error"});
                                                    }
                                                });
                                            }else{
                                                callback(500, {"Error": "Internal server error"});
                                            }
                                        });
                                    }else{
                                        //TODO ATUALIZAR O CARRINHO COM OS ATTEMPS
                                        callback(status, res);
                                    }
                                });
                            }else{
                                callback(status, res);
                            }
                        })
                    }else{
                        callback(401, {"Error": "Cart could not be payed"});
                    }
                }else{
                    callback(404, {"Error": "Cart not founded"});
                }
            });
        }else{
            callback(404, {"Error": "User not founded"});
        }
    });
}