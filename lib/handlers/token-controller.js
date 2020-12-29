/**
 * MODULE FOR TOKEN ENDPOINT
 * AUTHOR: DANIEL SILVA
 * LOG:
 *  18/12/2020 - DANIEL SILVA - CREATING A TOKEN
 */

const config = require('../../config');
const _con = require('../store/data');
const {hash, createRandomToken, parseJsonToObject} = require('../bin');
const {tokenQueryStringValidation} = require('../validations');

exports.createToken = (data, next, callback)=>{ //LOGIN
    const {email, password} = data.buffer;
    _con.read('users', email, (e, data)=>{ //CHECK IF USERS EXISTS
        if(!e && data){
            if(hash(password) === data.hashedPassword){ //CHECK IF THE PASSWORD MATCHS
                let token = createRandomToken(config.tokenSize); //CREATING A TOKEN NUMBER
                let dataToCreate = {
                    "email": data.email,
                    "token": token,
                    "expires": Date.now() + 1000 * 60 * 60 //ONE HOUR
                }
                _con.create('tokens', token, dataToCreate, (e)=>{ //CREATING A TOKEN
                    if(!e){
                        _con.read('menu', 'menu', (e, data)=>{ //GETTING THE MENU DATA
                            if(!e && data){
                                callback(200, {token: token, menu: data}); //TOKEN CREATED
                            }else{
                                console.log(e)
                                callback(500, {"Error": "Menu does not exist. Contact the adm."});
                            }
                        });
                    }else{
                        console.log(e);
                        callback(500, {"Error": "Internal server error"});
                    }
                });
            }else{
                callback(401, {"Error":"The authentication is not valid"});
            }
        }else{
            console.log(e);
            callback(401, {"Error": "This user does not exists on the database"});
        }
    });
}

exports.deleteToken = (data, next, callback)=>{
    const {token} = data.queryStr;
    if(tokenQueryStringValidation(token)){
        _con.read('tokens', token, (e, data)=>{
            if(!e && data){
                _con.delete('tokens', token, (e)=>{
                    if(!e){
                        callback(200);
                    }else{
                        callback(500, {"Error": "Internal server error"});
                    }
                });
            }else{
                callback(400, {"Error": "Token not founded"});
            }
        });
    }else{
        callback(400, {"Error": "Missing required fields"});
    }
}