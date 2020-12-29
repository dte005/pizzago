/**
 * SERVER MODULE
 * AUTHOR: DANIEL SILVA
 * LOG:
 *  18/12/2020 - DANIEL SILVA - DEVELOP THE TOKENS ENDPOINT
 */
const http = require('http');
const config = require('../../config');
const url = require('url'); //TO TREAT THE PARSE ON THE URL
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('../handlers/handlers');
const {morgan} = require('../morgan');
const {parseJsonToObject} = require('../bin');

const server = {
    router: {
        '/users': handlers.users,
        '/tokens': handlers.tokens,
        '/cart': handlers.cart, //GET CART GET
        '/cart/pay': handlers.cartPay,
    },
    httpServer: http.createServer((req, res)=>{
        server.httpHandler(req, res);
    }),
    httpHandler: function(req, res){
        //ALL INFOS THAT GOES WITH DATA TO THE HANDLERS
        const parseUrl = url.parse(req.url, true); //TRUE COUSE OF THE QUERY STRING
        const path = (parseUrl.pathname).replace(/\/+$/, ""); //TAKE / FROM THE BEG AND END
        const queryStr = parseUrl.query; //GETTING THE QUERYSTRING
        const method = req.method.toLowerCase();
        const headers = req.headers;


        const decoder = new StringDecoder('utf-8');
        let buffer = ''; //RESPONSABILE FOR RECEIVING CHUNCKS FROM THE STREAM
        req.on('data', (chunk)=>{
            buffer += decoder.write(chunk);
        });

        req.on('end', ()=>{
            buffer += decoder.end(); //GETTING THE STREAM

            //CHOSENHANDLER SERÁ UMA FUNÇÃO
            const chosenHandler = server.router[path] ? server.router[path] : handlers.notFound;

            let data = { //DATA TO SENDO TO HANDLERS
                'trimPath': path,
                'queryStr': queryStr,
                'method': method,
                'headers': headers,
                'buffer': parseJsonToObject(buffer) //IT IS NEEDED COUSE THE GET SENDS {}
            };

            chosenHandler(data, (status, body)=>{
                //VALIDATING DATA
                let st = typeof status === 'number' ? status : 200;
                let payload = typeof body === 'object' ? body : {};
                let bodyStr = JSON.stringify(payload);

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(st); //INSERINDO O STATUS DEVOLVIDO
                res.end(bodyStr);
                morgan(req, res);
            });
        });
    },
    init: function(){
        server.httpServer.listen(config.PORT || 3000, ()=>{
            console.log("Listening port number: " + config.PORT + " on " + config.envName);
        });
    }
};

module.exports = server;