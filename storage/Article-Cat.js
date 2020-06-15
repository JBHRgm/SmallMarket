
var query;

const ARTICLE = require('./Article');
const CATEGORY = require('./Category');
const USER = require('./User');

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

module.exports.catsANDcounts = async function (search = '', locs = []) {
    search = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
    let sql_s = `SELECT cat.${CATEGORY.COLS[0]}, cat.${CATEGORY.COLS[1]}, cat.${CATEGORY.COLS[2]}, COUNT(v.id) AS count FROM ${CATEGORY.TBNAME} AS cat LEFT JOIN ${TBNAME} AS artcat ON artcat.${COLS[1]} = cat.${CATEGORY.COLS[0]} `
            + `LEFT JOIN (SELECT art.${ARTICLE.COLS[0]} FROM ${ARTICLE.TBNAME} AS art # WHERE ${ARTICLE.COLS[2]} LIKE '%${search}%' §) AS v ON v.${ARTICLE.COLS[0]} = artcat.${COLS[0]} GROUP BY cat.${CATEGORY.COLS[0]};`;
    if (locs.length > 0) {
        let p = 'AND (';
        sql_s = sql_s.replace('#', `INNER JOIN ${USER.TBNAME} AS u ON art.${ARTICLE.COLS[5]} = u.${USER.COLS[0]}`);
        for (ctr = 0; ctr < locs.length; ctr++) {
            p = p + `u.${USER.COLS[5]}='${locs[ctr]}'`;
            if(p < locs.length - 1) p = p + ' OR ';
        }
        p = p + ')';
        sql_s = sql_s.replace('§', p);
    } else {
        sql_s = sql_s.replace(/#|§/g, '');
    }
    //console.log(sql_s);
    try {
        let rows = await query(sql_s);
        if (rows.length > 0) return rows;
        else return false;
    } catch(err) {
        throw (err);
    }
}

