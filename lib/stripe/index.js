const config = require('../../config');
const https = require('https');
const qs = require('querystring');

exports.paymentMethod = (data, callback)=>{ //CREATE A PAYMENT METHOD TO THE USER
    let path = "/v1/payment_methods";
    let postData = {
        "type": "card",
        "card[number]": data.number,
        "card[exp_month]": data.expMonth,
        "card[exp_year]": data.expYear,
        "card[cvc]": data.cvc,
      };

    apiRequest(postData, path, (status, res)=>{
        callback(status, res);
    });
}

exports.paymentIntentConfirmation = (data, callback)=>{

    let path = "/v1/payment_intents";
    let postData = {
        "amount": data.amount,
        "currency": data.currency,
        "payment_method_types[]":"card",
        "payment_method":data.id, //PAYMENT METHOD CREATED
        "confirm": true
    }

    apiRequest(postData, path, (status, res)=>{
        callback(status, res);
    });
}

let apiRequest = (dataToSend, path, callback)=>{
    const secretKey = config.stripeSck;
    const requestDetails = {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'path': path,
        'port': 443,
        'method': 'POST',
        'headers': {
            'Authorization': ' Bearer ' + secretKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': qs.stringify(dataToSend).length
        }
    }

    const request = https.request(requestDetails, (res)=>{
        let result = '';
        res.on('data', (chunk)=>{
            result += chunk;
        });

        res.on('end', ()=>{
            let parsedRes= JSON.parse(result);
            if(parsedRes.error){
                callback(500, {"Error": parsedRes.error.message})
            }else{
                callback(200, parsedRes);
            }
        });
    });

    request.on('error', (e)=>{
        callback(404, {"Error": true});
    });

    request.write(qs.stringify(dataToSend), ()=>{
        console.log("Data has been sent");
    });
}