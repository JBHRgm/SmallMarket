
var query;

const ARTICLE = require('./Article');

const TBNAME = 'art_pic_table';
const COLS = [
    'article',         // 0
    'ctr',             // 1
    'picture'          // 2
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL, `
            + `${COLS[1]} INT NOT NULL, `
            + `${COLS[2]} VARCHAR(250) NOT NULL, `
            + `PRIMARY KEY (${COLS[0]}, ${COLS[1]}), `
            + `FOREIGN KEY (${COLS[0]}) REFERENCES ${ARTICLE.TBNAME}(${ARTICLE.COLS[0]}) ON DELETE CASCADE`
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}


module.exports.getPictures = async function (aid) {
    let sql = `SELECT ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]} = '${aid}';`;
    try {
        let rows = await query(sql);
        if (rows.length > 0) return rows;
        else return [];
    } catch (err) {
        throw (err);
    }
}


module.exports.getFirstPicture = async function (aid) {
    let sql = `SELECT ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]} = '${aid}' AND ${COLS[1]} = 0;`;
    try {
        let res = await query(sql);
        if (res.length > 0) return res[0][COLS[2]];
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.getCounter = async function (aid) {
    let sql = `SELECT MAX(${COLS[1]}) AS count FROM ${TBNAME} WHERE ${COLS[0]} = '${aid}';`;
    try {
        let res = await query(sql);
        if (res[0]['count']) return res[0]['count'];
        else return 0;
    } catch (err) {
        throw (err);
    }
}
