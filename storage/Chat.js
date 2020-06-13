
var query;

const ARTICLE = require('./Article');
const USER = require('./User');

const TBNAME = 'chat_table';
const COLS = [
    'id',           // 0
    'sender',       // 1
    'receiver',     // 2
    'article',      // 3
    'msg',          // 4
    'date',         // 5
    'status'        // 6
]

module.exports.COLS = COLS;
module.exports.TBNAME = TBNAME;

module.exports.createTable = async function () {
    let sql = `CREATE TABLE IF NOT EXISTS ${TBNAME} (`
            + `${COLS[0]} INT NOT NULL PRIMARY KEY AUTO_INCREMENT, `
            + `${COLS[1]} INT NOT NULL, `
            + `${COLS[2]} INT NOT NULL, `
            + `${COLS[3]} INT NOT NULL, `
            + `${COLS[4]} TEXT NOT NULL, `
            + `${COLS[5]} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `
            + `${COLS[6]} TINYINT NOT NULL DEFAULT 0, `
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${USER.TBNAME}(${USER.COLS[0]}) ON DELETE CASCADE, `
            + `FOREIGN KEY (${COLS[2]}) REFERENCES ${USER.TBNAME}(${USER.COLS[0]}) ON DELETE CASCADE, `
            + `FOREIGN KEY (${COLS[3]}) REFERENCES ${ARTICLE.TBNAME}(${ARTICLE.COLS[0]}) ON DELETE CASCADE `
            + `);`
    try {
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}

