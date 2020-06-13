
var query;

const ARTICLE = require('./Article');
const CATEGORY = require('./Category');

const TBNAME = 'art_cat_table';
const COLS = [
    'article',          // 0
    'category'          // 1
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL, `
            + `${COLS[1]} INT NOT NULL, `
            + `PRIMARY KEY (${COLS[0]}, ${COLS[1]}), `
            + `FOREIGN KEY (${COLS[0]}) REFERENCES ${ARTICLE.TBNAME}(${ARTICLE.COLS[0]}), `
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${CATEGORY.TBNAME}(${CATEGORY.COLS[0]}) `
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}

