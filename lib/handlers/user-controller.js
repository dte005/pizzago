/**
 * MODULE THAT HAS ALL THE FUNCTIONS FOR USER CONTROLLER
 */

const _user = require('../store/data');
const {hash} = require('../bin'); //USE TO HASH PASSWORD
const {userQueryStringValidation} = require('../validations');

exports.getUser = (data, next, callback)=>{
    //VALIDATIONS
    const {email} = data.queryStr;
    if(userQueryStringValidation(email)){
        _user.read('users', email, (e, data)=>{
            if(!e){
                callback(200, data);
            }else{
                callback(500, {"Error": "Internal Server Error"});
            }
        });
    }
}

exports.createUser = (data, next, callback)=>{ //TO CREATE A USER WE NEED EMAIL, ADDRESS, FIRSTNAME, LASTNAME, PHONE
    let body = data.buffer;
    if(!body.email && !body.address && !body.firstname && !body.lastname && !body.phone) { //MUST HAVE ALL DATA BODY
        callback(404, {"Error": "Missing required fields"});
    }else{
        //MUST CHECK IF ALREADY EXISTS
        _user.read('users', body.email, (e, ret)=>{
            if(!e && ret){
                callback(400, {"Error": "This email already exists"});
            }else{
                if(hash(body.password)){
                    let dataToSend = { //PREPARING DATA TO LOAD
                        "email": body.email,
                        "address": body.address,
                        "firstName": body.firstName,
                        "lastName": body.lastName,
                        "hashedPassword": hash(body.password),
                        "phone": body.phone
                    }

                    _user.create('users', data.buffer.email, dataToSend, (e)=>{
                        if(!e){
                            callback(200);
                        }else{
                            callback(500, {"Error": "Internal server error"});
                        }
                    });
                }else{
                    callback(500, {"Error": "Something went wrong hashing password"});
                }
            }
        });
    }
}

exports.updateUser = (data, next, callback)=>{ //TO UPDATE A USER IT NEEDS THE EMAIL AND AT LEAST ONE FIELD TO CHANGE
    let body = data.buffer;
    
    //LETS CHECK IF THE EMAIL EXISTS
    _user.read('users', body.email, (e, ret)=>{
        if(!e && ret){
            if(body.address || body.firstName || body.lastName || body.phone){
                let dataToUpdate = {
                    "email": ret.email,
                    "address": body.address ? body.address : ret.address,
                    "firstName": body.firstName ? body.firstName : ret.firstName,
                    "lastName": body.lastname ? body.lastName : ret.lastName,
                    "phone": body.phone ? body.phone : ret.phone,
                    "hashedPassword": ret.hashedPassword
                }
                _user.update('users', body.email, dataToUpdate, (e)=>{
                    if(!e){
                        callback(200);
                    }else{
                        callback(500, {"Error": "Internal server error"});
                    }
                });
            }else{
                callback(404, {"Error": "Missing required fields"});
            }
        }else{
            callback(500, {"Error": "This email is not registered"});
        }
    });
}

exports.deleteUser = (data, next, callback)=>{
    const {email} = data.queryStr;
    if(userQueryStringValidation(email)){
        _user.read('users', email, (e, data)=>{
            if(!e && data){
                if(data.orders && data.orders.length){
                    callback(401, {"Error": "This user has orders and carts and can not be deleted"});
                }else{
                    _user.delete('users', email, (e)=>{
                        if(!e){
                            callback(200);
                        }else{
                            callback(500, {"Error": "Internal server error"});
                        }
                    });
                }
            }else{
                callback(404, {"Error": "This email does not exist on our database"});
            }
        });
    }
}