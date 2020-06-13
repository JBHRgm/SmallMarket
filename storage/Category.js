
var query;

const TBNAME = 'category_table';
const COLS = [
    'id',           // 0
    'name',         // 1
    'parent'        // 2
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL AUTO_INCREMENT PRIMARY KEY, `
            + `${COLS[1]} VARCHAR(80) NOT NULL, `
            + `${COLS[2]} INT `
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}


module.exports.getAllCategories = async function () {
    let sql = `SELECT * FROM ${TBNAME};`;
    try {
        let res = await query(sql);
        if (res.length > 0) return res;
        else return false;
    } catch (err) {
        throw (err);
    }
}

module.exports.getCategoriesAndCounts = async function () {
    
}