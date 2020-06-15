
const bcrypt = require('bcrypt');
var query;

const TBNAME = 'user_table';
const COLS = [
    'id',           // 0
    'registered',   // 1
    'name',         // 2
    'mail',         // 3
    'password',     // 4
    'address',      // 5
    'phone'         // 6
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL AUTO_INCREMENT PRIMARY KEY, `
            + `${COLS[1]} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `
            + `${COLS[2]} VARCHAR(25) NOT NULL UNIQUE, `
            + `${COLS[3]} VARCHAR(40) NOT NULL UNIQUE, `
            + `${COLS[4]} VARCHAR(250) NOT NULL, `
            + `${COLS[5]} VARCHAR(250) NOT NULL, `
            + `${COLS[6]} VARCHAR(20)`
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}


module.exports.registerUser = async function (name, mail, pwd, address, tel) {
    try {
        pwd = await bcrypt.hash(pwd, 10);
        if (tel == '') tel = null;
        let sql = `INSERT INTO ${TBNAME} (${COLS[2]},${COLS[3]},${COLS[4]},${COLS[5]},${COLS[6]}) VALUES ('${name}','${mail}','${pwd}','${address}','${tel}');`
        
        let res = await query(sql);
        return 1;
    } catch (err) {
        throw(err);
    }
}


module.exports.checkMail = async function (mail) {                              // returns true if mail existst, false otherwise
    let sql = `SELECT ${COLS[3]} FROM ${TBNAME} WHERE ${COLS[3]}='${mail}';`;
    try {
        let res = await query(sql);
        if (res.length > 0) return true;
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.checkUsername = async function (name) {                              // returns true if username existst, false otherwise
    let sql = `SELECT ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[2]}='${name}';`;
    try {
        let res = await query(sql);
        if (res.length > 0) return true;
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.login = async function (mail, pwd) {
    let sql = `SELECT ${COLS[0]}, ${COLS[4]} FROM ${TBNAME} WHERE ${COLS[3]}='${mail}';`;
    try {
        let res = await query(sql);
        if (res.length > 0) {
            let valid = bcrypt.compareSync(pwd, res[0][COLS[4]]);
            return valid;
        }
        else return false;
    } catch (err) {
        throw(err);
    }
}


module.exports.getUserByMail = async function (mail) {
    let sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[3]}='${mail}';`;
    try {
        let res = await query(sql);
        let obj = {};
        if (res.length > 0) {
            res = res[0];
            for (key in res) {
                if (key != COLS[4]) {
                    obj[key] = res[key];
                }
            }
            return obj;
        }
        return false;
    } catch(err) {
        throw(err);
    }
}

module.exports.getUserByID = async function (uid) {
    let sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[0]}='${uid}';`;
    try {
        let res = await query(sql);
        let obj = {};
        if (res.length > 0) {
            res = res[0];
            for (key in res) {
                if (key != COLS[4]) {
                    obj[key] = res[key];
                }
            }
            return obj;
        }
        return false;
    } catch(err) {
        throw(err);
    }
}