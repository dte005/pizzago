const {userQueryStringValidation} = require('../validations');
const _con = require('../store/data');
const _order = require('../store/order');

exports.readOrder = (data, next, callback)=>{ //READ LAST ORDER
    let {email} = data.queryStr;
    if(userQueryStringValidation(email)){
        _con.read('users', email, (e, dataUser)=>{
            if(!e && dataUser){
                let orderId = dataUser.orders[dataUser.orders.length - 1];
                _order.read(orderId, (e, dataOrder)=>{
                    if(!e && dataOrder){
                        callback(200, {"Order": dataOrder});
                    }else{
                        callback(404, {"Error": "Order not founded"});
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

exports.listOrders = (data, next, callback) => { //LAST 10 ORDERS
    let {email} = data.queryStr;
    if(userQueryStringValidation(email)){
        _con.read('users', email, (e, dataUser)=>{
            let lastTen = dataUser.orders.reverse.filter((hit, index, array)=>index >= 9);
            callback(200, {"Last 10 orders": lastTen});
        });
    }else{
        callback(404, {"Error": "Missing required fields"});
    }
}

exports.deleteOrder = (data, next, callback)=>{
    
}
