/**
 * MODULE THAT DESCRIBE THE USER MODELS
 */
const userModels = {
    "email":{
        "type": "string"
    },
    "address":{
        "type": "string",
        "minLength": 5
    },
    "firstName":{
        "type": "string",
        "minLength": 5,
        "maxLength": 20
    },
    "lastName":{
        "type": "string",
        "minLength": 5,
        "maxLength": 10
    },
    "hashedPassword":{
        "type": "string"
    },
    "phone":{
        "type": "string",
        "minLength": 5
    },
    "carts":{
        "type": "object",
    }
}

module.exports = userModels;