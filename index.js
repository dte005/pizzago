/**
 * PIZZA APPLICATION - MENU, USERS CONTROL, TOKEN CONTROL, CART CONTROL, ORDER CONTROL
 * LOG:
 *  16/12/2020 - DANIEL
 */
const server = require('./lib/server');

const app = {
    init: ()=>{
        server.init();
    }
}

app.init();
module.exports = app;