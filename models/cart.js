/**
 * MODULE THAT DESCRIBE THE USER MODELS
 */
const cartModels = {
    "email":{
        "type": "string"
    },
    "status":{
        "type": "string",
        "options": ["pending", "payed"] //NEW - CART IS NEW, PENDING - CART IS DONE BY THE COSTUMER, PAYED - CART IS PAYED BY THE USER
    },
    "codItem":{
        "type": "string",
    },
    "qtd":{
        "type": "number",
    },
    "unitPrice":{
        "type": "number",
    },
    "totalPrice":{
        "type": "number"
    }
}

module.exports = cartModels;