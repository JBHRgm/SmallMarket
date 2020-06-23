const mysql = require('mysql');
const util = require('util');

const USER = require('./User');
const ARTICLE = require('./Article');
const CATEGORY = require('./Category');
const ART_CAT = require('./Article-Cat');
const CHAT = require('./Chat');
const ART_PIC = require('./Article-Pic');

var pool;

async function createConnection (dbhost, dbport, dbuser, dbpwd, db) {
    pool = mysql.createPool({
        host: dbhost,
        port: dbport,
        user: dbuser,
        password: dbpwd
    });

    return new Promise(async (res, rej) => {
        try {
            await query(`CREATE DATABASE IF NOT EXISTS ${db};`);
            await query(`USE ${db};`);
            await query(`SET @@global.time_zone = '+02:00';`);
            res();
        } catch (err) {
            rej(err);
        }
        
    })
}

async function createTables () {
    return new Promise (async (resolve, reject) => {
        try {
            await USER.createTable();
            await ARTICLE.createTable();
            await CATEGORY.createTable();
            await ART_CAT.createTable();
            await ART_PIC.createTable();
            await CHAT.createTable();
            await
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}


async function query (sql) {
    return new Promise ((resolve, reject) => {
        pool.query(sql, (err, res) => {
            if(err) reject(err);
            resolve(res);
        })
    })
}

function DateTransform (date, full = true) {
    let ymd = date.toLocaleDateString().split('-').reverse().join('.');
    if (full) {
        let hms = date.toLocaleTimeString();
        return ymd + ' ' + hms;
    }
    else return ymd;
}

module.exports = {
    DateTransform,
    createConnection,
    createTables,
    query
}