
var query;

const USER = require('./User');
const CATEGORY = require('./Category');
const ART_CAT = require('./Article-Cat');

const TBNAME = 'article_table';
const COLS = [
    'id',           // 0
    'created',      // 1
    'title',        // 2
    'description',  // 3
    'price',        // 4
    'owner',        // 5
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    return new Promise (async (res, rej) => {
        let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
                + `${COLS[0]} INT NOT NULL AUTO_INCREMENT PRIMARY KEY, `
                + `${COLS[1]} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `
                + `${COLS[2]} VARCHAR(250) NOT NULL, `
                + `${COLS[3]} TEXT NOT NULL, `
                + `${COLS[4]} DECIMAL(10,2), `
                + `${COLS[5]} INT NOT NULL, `
                + `FOREIGN KEY (${COLS[5]}) REFERENCES ${USER.TBNAME}(${USER.COLS[0]}) `
                + `);`
        try {
            query = require('./index').query;
            await query(sql);
            res();
        } catch (err) {
            rej(err);
        }
        
    })
}


module.exports.createArticle = async function (title, descr, price, owner) {
    let sql = `INSERT INTO ${TBNAME} (${COLS[2]},${COLS[3]},${COLS[4]},${COLS[5]}) VALUES ('${title}','${descr}','${price}','${owner}');`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw(err);
    }
}


module.exports.locsANDcounts = async function () {
    
}


module.exports.getArticleCategories = async function (aid) {
    let sql = `SELECT ${CATEGORY.TBNAME}.${CATEGORY.COLS[0]}, ${CATEGORY.TBNAME}.${CATEGORY.COLS[1]} FROM ${TBNAME} `
            + `INNER JOIN ${ART_CAT.TBNAME} ON ${ART_CAT.TBNAME}.${ART_CAT.COLS[0]} = ${TBNAME}.${COLS[0]} ` 
            + `INNER JOIN ${CATEGORY.TBNAME} ON ${CATEGORY.TBNAME}.${CATEGORY.COLS[0]} = ${ART_CAT.TBNAME}.${ART_CAT.COLS[1]} `
            + `WHERE ${TBNAME}.${COLS[0]}='${aid}';`;
    try {
        let rows = await query(sql);
        if(rows.length > 0) return rows;
        else return false;
    } catch (err) {
        throw (err);
    }
}