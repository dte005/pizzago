/**
 * HANDLERS MODULE, RECEIVES THE REQ AND SEND BACK RESPONSE FOR ENDPOINTS
 * AUTHOR: DANIEL SILVA
 * LOG:
 *  18/12/2020 - DANIEL SILVA - DEVELOPING THE TOKENS ENDPOINTS
 */
const {userValidation, tokenValidation, cartValidation, cardPaymentValidation} = require('../validations');
const {getUser, createUser, updateUser, deleteUser} = require('./user-controller');
const {createToken, deleteToken} = require('./token-controller');
const {isAuthenticated} = require('../authentications');
const {getCart, addItem, updateItem, removeItem, pay} = require('./cart-controller');
const {readOrder, listOrders, readOneOrder} = require('./order-controller');

const handlers = {
    users: function(data, callback){ //USERS ENDPOINT
        const acceptableMethods = ['post', 'get', 'put', 'delete'];
        if(acceptableMethods.includes(data.method)){
            handlers._users[data.method](data, callback);
        }else{
            callback(405); //METHOD NOT ALLOWED
        }
    },
    _users:{
        get: function(data, callback){
            isAuthenticated(data, [getUser], (status, res)=>{ //ALL FUNCTIONS RECEIVES A NEXT FUNCTION ARRAY
                callback(status, res);
            });
        },
        post: function(data, callback){ //USE DE VALIDATION MIDDLEWARE BEFORE TREAT REQUISITION
            userValidation(data, [createUser],(status, res)=>{
                callback(status, res);
            });
        },
        put: function(data, callback){
            isAuthenticated(data, [userValidation, updateUser], (status, res)=>{
                callback(status, res);
            });
        },
        delete: function(data, callback){
            isAuthenticated(data, [deleteUser], (status, res)=>{
                callback(status, res);
            });
        }
    },
    tokens: function(data, callback){ //TOKENS ENDPOINT
        const acceptableMethods = ['post', 'delete'];
        if(acceptableMethods.includes(data.method)){
            handlers._tokens[data.method](data, callback);
        }
    },
    _tokens:{
        post: function(data, callback){
            tokenValidation(data, [createToken], (status, res)=>{
                callback(status, res);
            });
        },
        delete: function(data, callback){
            deleteToken(data, [], (status, res)=>{
                callback(status, res);
            })
        }
    },
    cart: function(data, callback){
        const acceptableMethods = ['get', 'post', 'put', 'delete']; //GET A CART, POST AN ITEM, PUT AN ITEM, DELETE AN ITEM
        if(acceptableMethods.includes(data.method)){
            handlers._cart[data.method](data, callback);
        }
    },
    _cart:{
        get: function(data, callback){
            isAuthenticated(data, [getCart], (status, res)=>{
                callback(status, res);
            });
        },
        post: function(data, callback){
            isAuthenticated(data, [cartValidation, addItem], (status, res)=>{
                callback(status, res);
            });
        },
        put: function(data, callback){
            isAuthenticated(data, [cartValidation, updateItem], (status, res)=>{
                callback(status, res);
            })
        },
        delete: function(data, callback){
            isAuthenticated(data, [removeItem], (status, res)=>{
                callback(status, res);
            });
        }
    },
    cartPay: function(data, callback){ //POST OF THE ORDERS (CREATE ORDER)
        const acceptableMethods = ['post']; //GET A CART, POST AN ITEM, PUT AN ITEM, DELETE AN ITEM
        if(acceptableMethods.includes(data.method)){
            handlers._cartPay[data.method](data, callback);
        }
    },
    _cartPay:{
        post: function(data, callback){
            isAuthenticated(data, [cardPaymentValidation, pay], (status, res)=>{
                callback(status, res);
            });
        }
    },
    orders: function(data, callback){
        const acceptableMethods = ['get', 'update'];
        if(acceptableMethods.includes(data.method)){
            handlers._orders[data.method](data, callback);
        }
    },
    _orders:{
        get: function(data, callback){
            isAuthenticated(data, [readOrder], (status, res)=>{
                callback(status, res);
            });
        }
    },
    ordersList: function(data, callback){
        const acceptableMethods = ['get'];
        if(acceptableMethods.includes(data.method)){
            handlers._ordersList[data.method](data, callback);
        }
    },
    _ordersList:{
        get: function(data, callback){
            isAuthenticated(data, [listOrders], (status, res)=>{
                callback(status, res);
            });
        }
    },
    ordersOne: function(data, callback){
        const acceptableMethods = ['get'];
        if(acceptableMethods.includes(data.method)){
            handlers._ordersOne[data.method](data, callback);
        }
    },
    _ordersOne:{
        get: function(data, callback){
            isAuthenticated(data, [readOneOrder], (status, res)=>{
                callback(status, res);
            });
        }
    },
    notFound: function(data, callback){
        callback(404, {"Error": "Sorry but this page is not avaiable on this api"}); //NOT FOUND
    },
};

module.exports = handlers;