
var query, DateTransform;

const USER = require('./User');
const CATEGORY = require('./Category');
const ART_CAT = require('./Article-Cat');
const ART_PIC = require('./Article-Pic');

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
                + `${COLS[0]} INT NOT NULL PRIMARY KEY, `
                + `${COLS[1]} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `
                + `${COLS[2]} VARCHAR(250) NOT NULL, `
                + `${COLS[3]} TEXT NOT NULL, `
                + `${COLS[4]} DECIMAL(10,2), `
                + `${COLS[5]} INT NOT NULL, `
                + `FOREIGN KEY (${COLS[5]}) REFERENCES ${USER.TBNAME}(${USER.COLS[0]}) ON DELETE CASCADE`
                + `);`
        try {
            DateTransform = require('./index').DateTransform;
            query = require('./index').query;
            await query(sql);
            res();
        } catch (err) {
            rej(err);
        }
        
    })
}


module.exports.createArticle = async function (aid, title, descr, price, owner) {
    let sql = `INSERT INTO ${TBNAME} (${COLS[0]}, ${COLS[2]},${COLS[3]},${COLS[4]},${COLS[5]}) VALUES ('${aid}','${title}','${descr}','${price}','${owner}');`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw(err);
    }
}


module.exports.getArticle = async function (aid, aname = '') {
    let sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[0]} = '${aid}'#;`;
    if (aname.length > 0) sql = sql.replace('#', ` AND ${COLS[2]} = '${aname}'`);
    else sql = sql.replace('#', '');

    try {
        let article = await query(sql);
        if (article.length > 0) {
            article[0][COLS[1]] = DateTransform(article[0][COLS[1]]);
            return article[0];
        }
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.getOwnerArticleCount = async function (uid) {
    let sql = `SELECT COUNT(${COLS[0]}) AS ctr FROM ${TBNAME} WHERE ${COLS[5]} = '${uid}';`;
    try {
        let count = await query(sql);
        if (count.length > 0) return count[0].ctr;
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.locsANDcounts = async function (search = '', price, cats = [], locs) {
    search = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
    let sql = `SELECT u.${USER.COLS[5]}, COUNT(v.${COLS[0]}) AS count FROM ${USER.TBNAME} AS u LEFT JOIN (SELECT a.${COLS[0]}, a.${COLS[5]} FROM `
            + `${TBNAME} AS a INNER JOIN ${ART_CAT.TBNAME} AS ac ON a.${COLS[0]} = ac.${ART_CAT.COLS[0]} AND a.${COLS[2]} LIKE '%${search}%' AND a.${COLS[4]} BETWEEN ${price[0]} AND ${price[1]} # `
            + `GROUP BY (a.${COLS[0]})) AS v ON u.${USER.COLS[0]} = v.${COLS[5]} GROUP BY (u.${USER.COLS[5]}) HAVING count > 0;`;
    if (cats.length > 0) {
        let p = 'AND (';
        for (x = 0; x < cats.length; x++) {
            p = p + `ac.${ART_CAT.COLS[1]} = '${cats[x]}'`;
            if (x < cats.length - 1) p = p + ' OR ';
        }
        p = p + ')';
        sql = sql.replace('#', p);
    } else {
        sql = sql.replace('#', '');
    }
    //console.log(sql);
    try {
        let rows = await query(sql);
        let anz_ctr = 0;
        //console.log(rows);
        if (rows.length > 0) {
            for (x = 0; x < rows.length; x++) {
                if (locs.length > 0 && !locs.includes(rows[x][USER.COLS[5]])) continue;
                anz_ctr += rows[x]['count'];
            }
            rows.push(anz_ctr);
            return rows;
        }
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.getArticles = async function (search, locations, categories, order, price, page = 0) {
    search = search.replace(/%/g, '\\%').replace(/_/g, '\\_');                              // escape % and _ in search string

    let sql = `SELECT DISTINCT a.${COLS[0]}, a.${COLS[1]}, a.${COLS[2]}, a.${COLS[3]}, a.${COLS[4]}, u.${USER.COLS[2]}, u.${USER.COLS[5]}, ap.${ART_PIC.COLS[2]} FROM ${TBNAME} AS a `
            + `INNER JOIN ${ART_CAT.TBNAME} AS ac ON ac.${ART_CAT.COLS[0]} = a.${COLS[0]} AND a.${COLS[2]} LIKE '%${search}%' AND a.${COLS[4]} BETWEEN ${price[0]} AND ${price[1]} #cat#`
            + `INNER JOIN ${USER.TBNAME} AS u ON u.${USER.COLS[0]} = a.${COLS[5]} #loc#`
            + `LEFT JOIN (SELECT ${ART_PIC.COLS[0]}, ${ART_PIC.COLS[2]} FROM ${ART_PIC.TBNAME} WHERE ${ART_PIC.COLS[1]} = 0) AS ap ON ap.${ART_PIC.COLS[0]} = a.${COLS[0]} `;

    let p = '';
    if (categories.length > 0) {                                // add sorting by categories
        p = 'AND (';
        for (x = 0; x < categories.length; x++) {
            p = p + `ac.${ART_CAT.COLS[1]} = '${categories[x]}'`;
            if (x < categories.length - 1) p = p + ' OR ';
        }
        p = p + ') ';
        sql = sql.replace('#cat#', p);
    } else sql = sql.replace('#cat#', '');

    if (locations.length > 0) {                                 // add sorting by location
        p = 'AND (';
        for (x = 0; x < locations.length; x++) {
            p = p + `u.${USER.COLS[5]} = '${locations[x]}'`;
            if (x < locations.length - 1) p = p + ' OR ';
        }
        p = p + ') ';
        sql = sql.replace('#loc#', p);
    } else sql = sql.replace('#loc#', '');

    switch(order) {                                         // define the ORDER BY statement
        case 'date-d': p = `ORDER BY a.${COLS[1]} DESC`;
            break;
        case 'price-a': p = `ORDER BY a.${COLS[4]} ASC`;
            break;
        case 'price-d': p = `ORDER BY a.${COLS[4]} DESC`;
            break;
        default: p = `ORDER BY a.${COLS[1]} ASC`;
    }
    sql = sql + p;

    page = page * 5;                            // limit the results to the current page
    sql = sql + ` LIMIT ${page},5;`
    //console.log(sql);
    try {
        let rows = await query(sql);
        if (rows.length > 0) {
            for (x = 0; x < rows.length; x++) {
                rows[x][COLS[1]] = DateTransform(rows[x][COLS[1]]);
            }
            return rows;
        }
        else return false;
    } catch (err) {
        throw (err);
    }
}


module.exports.getUserArticles = async function (uid, page = 0) {
    page = parseInt(page * 5);
    if(page == NaN) page = 0;
    let sql = `SELECT DISTINCT a.${COLS[0]}, a.${COLS[1]}, a.${COLS[2]}, a.${COLS[3]}, a.${COLS[4]}, a.${COLS[5]}, ap.${ART_PIC.COLS[2]} FROM ${TBNAME} AS a `
    + `LEFT JOIN (SELECT ${ART_PIC.COLS[0]}, ${ART_PIC.COLS[2]} FROM ${ART_PIC.TBNAME} WHERE ${ART_PIC.COLS[1]} = 0) AS ap ON ap.${ART_PIC.COLS[0]} = a.${COLS[0]} WHERE a.${COLS[5]} = '${uid}' LIMIT ${page},5;`;

    try {
        let rows = await query(sql);
        if (rows.length > 0) {
            for (x = 0; x < rows.length; x++) {
                rows[x][COLS[1]] = DateTransform(rows[x][COLS[1]]);
            }
            return rows;
        }
        else return false;
    } catch (err) {
        throw (err);
    }
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


module.exports.getOwner = async function (aid) {
    let sql = `SELECT ${COLS[5]} FROm ${TBNAME} WHERE ${COLS[0]} = '${aid}';`;
    try {
        let res = await query(sql);
        if (res.length > 0) return res[0][COLS[5]];
        else return false;
    } catch (err) {
        throw (err);
    }
}

module.exports.deleteArticle = async function (aid) {
    let sql = `DELETE FROM ${TBNAME} WHERE ${COLS[0]} = '${aid}';`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}


module.exports.getMaxIndex = async function () {
    let sql = `SELECT MAX(${COLS[0]}) AS count FROM ${TBNAME};`;
    try {
        let res = await query(sql);
        if (res[0]['count']) return res[0]['count'];
        else return 0;
    } catch (err) {
        throw (err);
    }
}