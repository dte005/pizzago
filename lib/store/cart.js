/**
 * MODULE TO CONNECT WITH THE DATABASE
*/

const path = require('path');
const fs = require('fs').promises;
const fsa = require('fs');
const util = require('util');
const {parseJsonToObject} = require('../bin');

class Cart{
    constructor(dir){
        this.baseDir = path.join(__dirname, dir); //CONNECTION WITH THE FOLDER OF THE DATABASE
    }

    async read(file, callback){ //GET THE CART
        const concatPath = this.baseDir+"/"+file + '.json';

        try{
            const data = await fs.readFile(concatPath, 'utf-8');
            callback(false, parseJsonToObject(data));
        }catch(e){
            callback(e, false);
        }
    }

    async create(file, data, callback){ //CREATE THE CART WITH A ITEM
        const concatPath = this.baseDir+"/"+file + '.json';
        try{
            const fd = await fs.open(concatPath, 'wx');
            await fs.writeFile(fd, JSON.stringify(data));
            callback(false);
        }catch(e){
            callback(e);
        }
    }

    async update(file, data, callback){ //UPDATE ONE ITEM OF THE CART OR REMOVE A ITEM OR UPDATE STATUS
        const concatPath = this.baseDir+"/"+file + '.json';
        const trunct = util.promisify(fsa.truncate); //TRANSFORMANDO O TRUNCATE EM PROMISE
        try{
            const fd = await fs.open(concatPath, 'r+');
            await trunct(concatPath); //CHAMANDO O TRUNCATE
            await fs.writeFile(fd, JSON.stringify(data));
            callback(false);
        }catch(e){
            callback(e);
        }
    }

    async delete(file, callback){ //DELETE CART ON USER DELETE
        const concatPath = this.baseDir+"/"+file + '.json';
        try{
            await fs.unlink(concatPath);
            callback(false);
        }catch(e){
            callback(e);
        }
    }

}

module.exports = new Cart('./../../.carts/');;