/**
 * MODULE THAT CONTAIN THE VALIDATIONS FOR POST AND UPDATE
 * LOG:
 *  17/12/2020 - DANIEL SILVA
 *  18/12/2020 - DANIEL SILVA - DEVELOP THE VALIDATIONS FOR THE TOKENS
 */

 const config = require('../../config');

exports.userValidation = (data, next, callback)=>{ //VALIDATION MIDDLEWARE FOR USER
    let nextMethod = next.splice(0,1);
    let body = data.buffer;
    //START VALIDATIONS
    let email = body.email && typeof body.email === 'string' && body.email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(body.email)? body.email : false;
    let address = body.address && typeof body.address === 'string' && body.address.length > 0 ? body.address : false;
    let firstName = body.firstName && typeof body.firstName === 'string' && body.firstName.length > 0 ? body.firstName : false;
    let lastName = body.lastName && typeof body.lastName === 'string' && body.lastName.length > 0 ? body.lastName : false;
    let phone = body.phone && typeof body.phone === 'string' && body.phone.length > 0 ? body.phone : false;
    let password = body.password && typeof body.password === 'string' && body.password.length >= 5 ? body.password : false;

    if(body.email && !email){
        callback(400, {"Error": "Email field is required and must be valid"});
        return 0;
    }

    if(body.address && !address){
        callback(400, {"Error": "Address field must be valid"});
        return 0;
    }

    if(body.firstName && !firstName){
        callback(400, {"Error": "Firstname field must be valid"});
        return 0;
    }

    if(body.lastName && !lastName){
        callback(400, {"Error": "Lastname field must be valid"});
        return 0;
    }

    if(body.phone && !phone){
        callback(400, {"Error": "Phone field must be valid"});
        return 0;
    }

    if(body.password && !password){
        callback(400, {"Error": "Password field must be valid"});
        return 0;
    }

    nextMethod[0](data, next, (status, res)=>{
        callback(status, res);
    });
    
}

exports.userQueryStringValidation = (email)=>{
    return email && typeof email === 'string' && email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(email)? true : false;
}

exports.tokenValidation = (data, next, callback)=>{ //VALIDATIONS MIDDLEWARE FOR TOKEN
    let nextMethod = next.splice(0,1);
    let body = data.buffer;
    let email = body.email && typeof body.email === 'string' && body.email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(body.email)? body.email : false;
    let password = body.password && typeof body.password === 'string' && body.password.length >= 5 ? body.password : false;

    if(body.email && !email){
        callback(400, {"Error": "Email field is required and must be valid"});
        return 0;
    }

    if(body.password && !password){
        callback(400, {"Error": "Password field must be valid"});
        return 0;
    }

    nextMethod[0](data, next, (status, res)=>{
        callback(status, res);
    });
}

exports.tokenQueryStringValidation = (token)=>{
    return token && typeof token === 'string' && token.length === config.tokenSize ? true : false;
}

exports.cartValidation = (data, next, callback)=>{
    let nextMethod = next.splice(0,1);
    let body = data.buffer;
    
    //START VALIDATIONS
    let email = body.email && typeof body.email === 'string' && body.email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(body.email)? body.email : false;
    let codItem = body.codItem && typeof body.codItem === 'string' && body.codItem.length > 0 ? body.codItem : false;
    let qtd = body.qtd && typeof body.qtd === 'number' && body.qtd > 0 ? body.qtd : false;

    if(body.email && !email){
        callback(400, {"Error": "Email field is required and must be valid"});
        return 0;
    }

    if(body.codItem && !codItem){
        callback(400, {"Error": "Item code must be valid"});
        return 0;
    }

    if(body.qtd !== "" && !qtd){
        callback(400, {"Error": "Quantity must be valid"});
        return 0;
    }

    nextMethod[0](data, next, (status, res)=>{
        callback(status, res);
    });
}

exports.cartQueryStringValidation = (data)=>{
    let query = data.queryStr;

    let email = query.email && typeof query.email === 'string' && query.email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(query.email)? query.email : false;
    let cart = query.cart && typeof query.cart === 'string' ? true : false;

    if(query.email && !email){
        return false;
    }

    if(query.cart && !cart){
        return false;
    }

    return true;

}

exports.cardPaymentValidation = (data, next, callback)=>{
    let nextMethod = next.splice(0,1);
    let body = data.buffer;

    let email = body.email && typeof body.email === 'string' && body.email.length > 5 && /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/.test(body.email)? body.email : false;
    let cardNumber = body.cardNumber && typeof body.cardNumber === 'string' && body.cardNumber.length > 10 ? body.cardNumber : false;
    let expMonth = body.expMonth && typeof body.expMonth === 'string' && body.expMonth.length >=1 && body.expMonth.length <=2 ? body.expMonth : false;
    let expYear = body.expYear && typeof body.expYear === 'string' && body.expYear.length >=2 && body.expYear.length <=4 ? body.expYear : false;
    let cvc = body.cvc && typeof body.cvc === 'string' ? body.cvc : false;

    if(body.email && !email){
        callback(400, {"Error": "Email field is required and must be valid"});
        return 0;
    }

    if(body.cardNumber && !cardNumber){
        callback(400, {"Error": "Card number field is required and must be valid"});
        return 0;
    }

    if(body.expMonth && !expMonth){
        callback(400, {"Error": "The month field is required and must be valid"});
        return 0;
    }

    if(body.expYear && !expYear){
        callback(400, {"Error": "The year field is required and must be valid"});
        return 0;
    }

    if(body.cvc && !cvc){
        callback(400, {"Error": "The secure code field is required and must be valid"});
        return 0;
    }

    nextMethod[0](data, next, (status, res)=>{
        callback(status, res);
    });
};