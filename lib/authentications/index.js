/**
 * MODULE THE HAS AUTHENTICATION METHODS
 * AUTHOR: DANIEL SILVA
 * LOG:
 *  20/12/2020 - DANIEL SILVA
 */

const _token = require('../store/data');

exports.isAuthenticated = (data, next, callback)=>{ //CALLBACK WILL RETURN TRUE OR FALSE
    let token = data.headers.authorization ? data.headers.authorization.split(' ')[1] : false;
    let nextMethod = next.splice(0,1);
    let email = data.buffer.email;
    if(!email){
        email = data.queryStr.email;
    }
    if(token && email){
        _token.read('tokens', token, (e, dataToken)=>{
            if(!e && dataToken){
                if(email === dataToken.email && Date.now() < dataToken.expires){ //VERIFYING IF TOKEN IS VALID AND THE EMAIL IS ASSOCIATED TO THIS TOKEN
                    nextMethod[0](data, next, (status, res)=>{
                        callback(status, res);
                    });
                }else{
                    callback(404, {"Error": "This token is invalid"});
                }
            }else{
                console.log(e);
                callback(404, {"Error": "This token was not founded"});
            }
        });
    }else{
        callback(404, {"Error": "Missing required fields"});
    }
}