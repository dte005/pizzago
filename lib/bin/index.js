
/**
 * HELPERS MODULE
 */

const crypto = require('crypto');
const config = require('../../config');
const https = require('https');

exports.hash = (password)=>{ //CREATE A HASHED PASSWORD FOR THE USER
    if(typeof password === "string" && password.length){
        return crypto.createHmac('sha256', config.hashSecret).update(password).digest('hex');
    }else{
        return false;
    }
}

exports.parseJsonToObject = (str)=>{
    try{
        return JSON.parse(str);
    }catch(e){
        return {};
    }
}

exports.createRandomToken = (size)=>{
    let strSize = typeof size === "number" && size > 10 ? size : false;
    if(strSize){
        let token = '';
        const possibles = 'abcdefghijklmnopqrstuvwxyz123456789';
        for(let i=0; i<strSize; i++){
            token += possibles.charAt(Math.floor(Math.random() * possibles.length))
        }
        return token;
    }else{
        return false;
    }
}

exports.sendEmail = (email, titulo, msg, callback)=>{ // SEND EMAIL TO THE USER
    let dataToSend = config.email;

    dataToSend.template_params={
        'send_to': email,
        'titulo': titulo,
        'msg': msg
    }

    const postData = JSON.stringify(dataToSend);

    const requestDetails = {
        'protocol': 'https:',
        'hostname': 'api.emailjs.com',
        'path': '/api/v1.0/email/send',
        'port': 443,
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    }

    const request = https.request(requestDetails, (res)=>{
        console.log(res.headers);
        res.on('data', (chunk)=>{
            callback(false);
        });
    });

    request.on('error', ()=>{
        callback(true);
    });

    request.write(postData, ()=>{
        console.log("Data has been sent");
    });

    request.end();
}