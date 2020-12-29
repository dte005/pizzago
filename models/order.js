const order = {
   "email":{
       "type": 'string'
   },
   "qtd":{
       "type": "number"
   },
   "total":{
       "type": "number"
   },
   "status":{
       "type": "string",
       "options": ["payed", "notPayed"]
   },
   "id":{
       "type": "string"
   },
   "cart":{
       "type": "string"
   }
}

module.exports = order;