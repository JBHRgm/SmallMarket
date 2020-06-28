
var query, DateTransform;

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
        DateTransform = require('./index').DateTransform;
        query = require('./index').query;
        await query(sql);
    } catch (err) {
        throw(err);
    }    
}


module.exports.getOpenChats = async function (user_id) {
    let sql = `SELECT tb.user, u.${USER.COLS[2]}, tb.${COLS[3]}, a.${ARTICLE.COLS[2]} FROM (SELECT ${COLS[1]} as user, ${COLS[3]} FROM ${TBNAME} WHERE ${COLS[2]} = '${user_id}' UNION `
            + `SELECT ${COLS[2]} as user, ${COLS[3]} FROM ${TBNAME} WHERE ${COLS[1]} = '${user_id}') AS tb INNER JOIN ${ARTICLE.TBNAME} AS a ON a.${ARTICLE.COLS[0]} = tb.${COLS[3]} INNER JOIN `
            + `${USER.TBNAME} AS u ON u.${USER.COLS[0]} = tb.user;`;
    try {
        let res = await query(sql);
        return res;
    } catch (err) {
        throw (err);
    }
}


module.exports.getChatMessages = async function (uid, aid) {
    let sql = `SELECT tb.${COLS[0]}, tb.${COLS[1]}, tb.${COLS[2]}, tb.${COLS[4]}, tb.${COLS[5]} FROM (SELECT * FROM ${TBNAME} WHERE ${COLS[3]} = '${aid}' AND (${COLS[1]} = '${uid}' OR ${COLS[2]} = '${uid}') ORDER BY ${COLS[0]} DESC LIMIT 20) AS tb ORDER BY ${COLS[0]} ASC;`;
    try {
        let res = await query(sql);
        for (x = 0; x < res.length; x++) {
            res[x][COLS[5]] = DateTransform(res[x][COLS[5]]);
        }
        return res;
    } catch (err) {
        throw (err);
    }
}


module.exports.sendMessage = async function (aid, sender, receiver, msg) {
    let sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}) VALUES ('${sender}', '${receiver}', '${aid}', '${msg}');`;
    try {
        await query(sql);
        sql = `SELECT ${COLS[0]}, ${COLS[1]}, ${COLS[2]}, ${COLS[4]}, ${COLS[5]} FROM ${TBNAME} WHERE ${COLS[1]} = '${sender}' AND ${COLS[3]} = '${aid}' ORDER BY ${COLS[0]} DESC LIMIT 1;`;
        let res = await query(sql);
        if (res.length > 0) {
            res[0][COLS[5]] = DateTransform(res[0][COLS[5]]);
        }
        return res[0];
    } catch (err) {
        throw (err);
    }
}

