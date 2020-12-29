const path = require('path');
const fs = require('fs').promises;
const fsa = require('fs');
const util = require('util');
const {parseJsonToObject} = require('../bin');

class Order{
    constructor(dir){
        this.baseDir = path.join(__dirname, dir); //CONNECTION WITH THE FOLDER OF THE DATABASE
    }

    async read(file, callback){ //READ FUNCTION FROM DATABASE - RECEIVES THE FOLDER NAME (DIR), THE FILE NAME (FILE) AND RETRIVES ON CALLBACK WITH ERROR STATUS AND DATA
        const concatPath = this.baseDir+"/"+file+".json";
        try{
            const fd = await fs.readFile(concatPath, 'utf-8');
            callback(false, parseJsonToObject(fd));
        }catch(e){
            callback(e, false);
        }
    }

    async create(newFile, data, callback){ //CREATE A FILE WITH THE EMAIL NO RETURNING
        const concatPath = this.baseDir+"/"+newFile+".json";
        try{
            const fd = await fs.open(concatPath, 'wx');
            await fs.writeFile(fd, JSON.stringify(data));
            callback(false);
        }catch(e){
            callback(e);
        }
    }

    async update(file, data, callback){ //UPDATE A FILE WITH NO DATA RETURNING
        const concatPath = this.baseDir+"/"+file+".json";
        const trunc = util.promisify(fsa.truncate);
        try{
            let fd = await fs.open(concatPath, 'r+');
            await trunc(concatPath); //TRUNCATE RECEIVES THE PATH OF THE FILE AND NOT THE FILE DESCRIPTOR
            await fs.writeFile(fd, JSON.stringify(data));
            callback(false);
        }catch(e){
            callback(e);
        }
    }

    async delete(file, callback){
        const concatPath = this.baseDir+"/"+file+".json";
        try{
            await fs.unlink(concatPath);
            callback(false);
        }catch(e){
            callback(e);
        }
    }
}

module.exports = new Order('./../../.orders/');