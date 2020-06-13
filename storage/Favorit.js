
var query;

const ARTICLE = require('./Article');
const USER = require('./User');

const TBNAME = 'favorite_table';
const COLS = [
    'user',         // 0
    'article'       // 1
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL, `
            + `${COLS[1]} INT NOT NULL, `
            + `PRIMARY KEY (${COLS[0]}, ${COLS[1]}), `
            + `FOREIGN KEY (${COLS[0]}) REFERENCES ${USER.TBNAME}(${USER.COLS[0]}), `
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${ARTICLE.TBNAME}(${ARTICLE.COLS[0]})`
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}


module.exports.getUserFavs = async function (uid) {
    let sql = `SELECT ${COLS[1]} FROM ${TBNAME} WHERE ${COLS[0]}='${uid}';`;
    try {
        let rows = await query(sql);
        let res = [];
        for (x = 0; x < rows.length; x++) {
            res.push(rows[x][COLS[1]]);
        }
        return res;
    } catch (err) {
        throw (err);
    }
}