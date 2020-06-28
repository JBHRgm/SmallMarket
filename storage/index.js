const mysql = require('mysql');
const util = require('util');
const bcrypt = require('bcrypt');

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
    initalize_dataset,
    query
}

// ---------------------------------------------------------------------------------------

async function initalize_dataset () {
    console.log('Befülle Datenbank mit Testdaten ...\n');
    // Nutzer anlegen
    let user_arr = [
        { name: 'HansPeter', mail: 'hanspeter@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '69469 Weinheim', phone: '' },
        { name: 'MannOlaf', mail: 'mannolaf@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '21039 Börnsen', phone: '' },
        { name: 'Michel', mail: 'michael@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '69469 Weinheim', phone: '7733554466' },
        { name: 'Poltergeist335', mail: 'polter@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '01561 Priestewitz', phone: '12345678933' },
        { name: 'PeterLustig', mail: 'peter@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '01945 Guteborn', phone: '' },
        { name: 'Einstein', mail: 'relativ@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '34260 Kaufungen', phone: '444555588' },
        { name: 'TestNutzer', mail: 'test@gmx.de', pwd: bcrypt.hashSync('wordpass', 10), adr: '73547 Lorch', phone: '01726788714' }
    ]
    let user_sql = 'INSERT INTO user_table (name, mail, password, address, phone) VALUES ';
    for (x = 0; x < user_arr.length; x++) {
        user_sql = user_sql + `('${user_arr[x].name}','${user_arr[x].mail}','${user_arr[x].pwd}','${user_arr[x].adr}','${user_arr[x].phone}')`;
        if (x < user_arr.length - 1) user_sql = user_sql + ',';
        else user_sql = user_sql + ';';
    }

    // Artikel anlegen
    let art_arr = [
        { id: 1, title: 'Grafikkarte Nvidia GTX 980 TI', desc: 'Gebrauchte Grafikkarte mit 4GB Grafikspeicher und guter Kühllösung. Wärmeleitpaste wurde erneuert. Guter Zustand.', price: 100.00, owner: 7 },
        { id: 2, title: 'AMD Sapphire RX 580 Nitro', desc: 'Hat mir viele Jahre lang gute Dienste geleistet, werde mich aber nun davon trennen müssen. Orginalverpackung noch vorhanden.', price: 88.50, owner: 3 },
        { id: 3, title: 'Brettspiele-Sammlung', desc: 'Mensch Ärgere Dich Nicht, Mühle, Schach, Monopoly, ... Ich habe alles im Angebot!', price: 29.99, owner: 5 },
        { id: 4, title: 'Ersatzreifen', desc: 'Ich hab keinen Plan von Reifen oder Autos. Will den hier nur loswerden, bin mir nicht mal sicher woher ich den hab ...', price: 15.00, owner: 3 },
        { id: 5, title: 'Rückspiegel-erweiterung', desc: 'Damit kann man besser nach hinten schauen. Augen aber bitte auf der STraße vor Ihnen lassen.', price: 49.99, owner: 2 },
        { id: 6, title: 'Herrenhemd Größe S kariert', desc: 'Mein Bruder braucht es nicht mehr, aber bevor ers weg schmeißt probier ich s lieber hier. Wird ungewaschen mit Originalduft verkauft.', price: 25.00, owner: 5 },
        { id: 7, title: 'Vogelkäfig', desc: 'Ein Käfig zum Halten von Vögeln.', price: 44.00, owner: 4 },
        { id: 8, title: 'Fahrradklingel Rot', desc: 'Klingelt, Bimmelt und Schallert. Ein Muss für den selbstbewussten Radler', price: 10.00, owner: 2 },
        { id: 9, title: '24 Zoll Monitor Samsung - HDMI', desc: 'Wurde als Zweitmonitor gebraucht, aber lange nicht mehr genutzt. Sucht deswegen ein neues Zuhause. Bitte nur ernsthafte Anfragen!', price: 60.00, owner: 7 },
        { id: 10, title: 'Handyhülle für iphone-7', desc: 'Überteurte Hülle für ein überteuertes Produkt.', price: 537.69, owner: 4 },
        { id: 11, title: 'Teleskop', desc: 'Zum Sterne betrachten oder auch um die Nachbarn auszuspannen.', price: 78.00, owner: 6 },
        { id: 12, title: 'Gta 5 für die PS3', desc: 'Vielleicht kümmert sich unser Sohn auch mal um die Schule wenn er nichts mehr zu spielen hat.', price: 15.00, owner: 3 },
        { id: 13, title: 'Geschirrsortiment Porzellan', desc: 'Zerbrechlich!', price: 45.00, owner: 5 },
        { id: 14, title: 'Kratzbaum 50cm', desc: 'Perfekt für alle Katzen geeignet.', price: 27.60, owner: 4 },
        { id: 15, title: 'Donald Trump Poster', desc: 'Bitte nimmt es mir einer ab, das Poster strahlt einfach die pure Intelligenz aus.', price: 0.50, owner: 7 }
    ]
    let art_sql = 'INSERT INTO article_table (id, title, description, price, owner) VALUES ';
    for (x = 0; x < art_arr.length; x++) {
        art_sql = art_sql + `('${art_arr[x].id}','${art_arr[x].title}','${art_arr[x].desc}','${art_arr[x].price}','${art_arr[x].owner}')`;
        if (x < art_arr.length - 1) art_sql = art_sql + ',';
        else art_sql = art_sql + ';';
    }

    // Kategorien anlegen
    let cat_arr = [
        { name: 'Fahrzeuge', ref: 0 },{ name: 'Autos & Zubehör', ref: 1 },{ name: 'Fahrzeuge', ref: 1 },{ name: 'Boote & Zubehör', ref: 1 },{ name: 'Laster & Zubehör', ref: 1 },{ name: 'Motorräder & Zubehör', ref: 1 },{ name: 'Nutzfahrzeuge & Zubehör', ref: 1 },
        { name: 'Fahrräder & Zubehör', ref: 1 },{ name: 'Wohnwägen & Zubehör', ref: 1 },{ name: 'Nutzfahrzeuge & Zubehör', ref: 1 },{ name: 'weitere', ref: 1 },
        { name: 'Elektronik', ref: 0 },{ name: 'Audio', ref: 10 },{ name: 'Foto', ref: 10 },{ name: 'Audio', ref: 10 },{ name: 'Haushaltsgeräte', ref: 10 },{ name: 'Video & TV', ref: 10 },{ name: 'Handy & Telefon', ref: 10 },{ name: 'Software', ref: 10 },{ name: 'Konsolen', ref: 10 },
        { name: 'PCs & Zubehör', ref: 10 },{ name: 'Notebooks', ref: 10 },{ name: 'Videospiele', ref: 10 },{ name: 'weitere', ref: 10 },
        { name: 'Familie', ref: 0 },{ name: 'Baby-Ausstattung', ref: 22 },{ name: 'Baby-Baby-Ausstattung', ref: 22 },{ name: 'Spielsachen', ref: 22 },{ name: 'weitere', ref: 22 },
        { name: 'Freizeit & Hobby', ref: 0 },{ name: 'Denksport', ref: 26 },{ name: 'Sport', ref: 26 },{ name: 'Denksport', ref: 26 },{ name: 'Kochen', ref: 26 },{ name: 'Kunst', ref: 26 },{ name: 'Basteln', ref: 26 },{ name: 'Modellbau', ref: 26 },{ name: 'Reise', ref: 26 },
        { name: 'Camping', ref: 26 },{ name: 'Musik, Filme, Bücher', ref: 26 },{ name: 'weitere', ref: 26 },
        { name: 'Haustiere', ref: 0 },{ name: 'Katzen', ref: 37 },{ name: 'Hunde', ref: 37 },{ name: 'Reptilien', ref: 37 },{ name: 'Spinnen', ref: 37 },{ name: 'Vögel', ref: 37 },{ name: 'Kleintiere', ref: 37 },{ name: 'Fische', ref: 37 },{ name: 'Pferde', ref: 37 },{ name: 'weitere', ref: 37 },
        { name: 'Haus & Garten', ref: 0 },{ name: 'Kinderzimmer', ref: 47 },{ name: 'Schlafzimmer', ref: 47 },{ name: 'Küche & Esszimmer', ref: 47 },{ name: 'Wohnzimmer', ref: 47 },{ name: 'Büro', ref: 47 },{ name: 'Badezimmer', ref: 47 },{ name: 'Garten & Zubehör', ref: 47 },{ name: 'weitere', ref: 47 },
        { name: 'Haus & Mode & Beauty', ref: 0 },{ name: 'Kinderkleidung', ref: 56 },{ name: 'Babykleidung', ref: 56 },{ name: 'Herrenkleidund', ref: 56 },{ name: 'Damenkleidung', ref: 56 },{ name: 'Accessoires & Schmuck', ref: 56 },{ name: 'Gesichtpflege', ref: 56 },{ name: 'Körperpflege', ref: 56 },
        { name: 'Haus & Haarpflege & Beauty', ref: 56 },{ name: 'Haarpflege', ref: 56 },{ name: 'weitere', ref: 56 },
    ]
    let cat_sql = 'INSERT INTO category_table (name, parent) VALUES ';
    for (x = 0; x < cat_arr.length; x++) {
        cat_sql = cat_sql + `('${cat_arr[x].name}','${cat_arr[x].ref}')`;
        if (x < cat_arr.length - 1) cat_sql = cat_sql + ',';
        else cat_sql = cat_sql + ';';
    }

    // Artikel mit Kategorien verknüpfen
    let art_cat_arr = [
        { article: 1, cat: 10 },{ article: 1, cat: 18 },{ article: 2, cat: 10 },{ article: 2, cat: 18 },{ article: 3, cat: 26 },{ article: 3, cat: 27 },{ article: 4, cat: 1 },{ article: 5, cat: 8 },
        { article: 5, cat: 1 },{ article: 6, cat: 56 },{ article: 6, cat: 59 },{ article: 7, cat: 37 },{ article: 7, cat: 42 },{ article: 8, cat: 1 },{ article: 8, cat: 7 },{ article: 9, cat: 10 },
        { article: 9, cat: 14 },{ article: 10, cat: 10 },{ article: 10, cat: 15 },{ article: 11, cat: 26 },{ article: 11, cat: 36 },{ article: 12, cat: 10 },{ article: 12, cat: 20 },{ article: 13, cat: 47 },
        { article: 13, cat: 50 },{ article: 14, cat: 37 },{ article: 14, cat: 38 },{ article: 15, cat: 37 },{ article: 15, cat: 40 }
    ]
    let art_cat_sql = 'INSERT INTO art_cat_table (article, category) VALUES ';
    for (x = 0; x < art_cat_arr.length; x++) {
        art_cat_sql = art_cat_sql + `('${art_cat_arr[x].article}','${art_cat_arr[x].cat}')`;
        if (x < art_cat_arr.length - 1) art_cat_sql = art_cat_sql + ',';
        else art_cat_sql = art_cat_sql + ';';
    }

    // Artikel und Bilder verknüpfen
    let art_pic_arr = [
        { art: 1, ctr: 0, pic: 'art1pic0.jpg' },{ art: 1, ctr: 1, pic: 'art1pic1.jpg' },{ art: 1, ctr: 2, pic: 'art1pic2.jpg' },
        { art: 2, ctr: 0, pic: 'art2pic0.jpg' },
        { art: 6, ctr: 0, pic: 'art6pic0.jpg' },
        { art: 7, ctr: 0, pic: 'art7pic0.jpg' },{ art: 7, ctr: 1, pic: 'art7pic1.jpg' },
        { art: 8, ctr: 0, pic: 'art8pic0.jpg' },
        { art: 11, ctr: 0, pic: 'art11pic0.jpg' },{ art: 11, ctr: 1, pic: 'art11pic1.jpg' },{ art: 11, ctr: 2, pic: 'art11pic2.jpg' },
        { art: 12, ctr: 0, pic: 'art12pic0.jpg' },
        { art: 15, ctr: 0, pic: 'art15pic0.jpg' },{ art: 15, ctr: 1, pic: 'art15pic1.jpg' },{ art: 15, ctr: 2, pic: 'art15pic2.jpg' }
    ]
    let art_pic_sql = 'INSERT INTO art_pic_table (article, ctr, picture) VALUES ';
    for (x = 0; x < art_pic_arr.length; x++) {
        art_pic_sql = art_pic_sql + `('${art_pic_arr[x].art}','${art_pic_arr[x].ctr}','${art_pic_arr[x].pic}')`;
        if (x < art_pic_arr.length - 1) art_pic_sql = art_pic_sql + ',';
        else art_pic_sql = art_pic_sql + ';';
    }

    // Ein paar Chat-Nachrichten anlegen
    let chat_arr = [
        { sender: 1, receiver: 3, article: 2, msg: 'Hey, ist die Karte noch zu haben? Versand möglich?' },{ sender: 3, receiver: 1, article: 2, msg: 'Moin, ja is noch da. Versand per DHL für 5€ Aufpreis.' },
        { sender: 5, receiver: 6, article: 11, msg: 'Hätte das Teil gerne um meine komischen Nachbarn zu beobachten, ist es dafür geeignet?' },{ sender: 5, receiver: 6, article: 11, msg: 'Also ich frage natürlich für einen Freund meine ich, ich würde sowas nie machen!' },
        { sender: 1, receiver: 4, article: 7, msg: 'Groß genug um meine Frau darin einzusperren?' },{ sender: 4, receiver: 1, article: 7, msg: 'Jetzt hören Sie mal! So können SIe doch nicht mit Ihrer Frau umgehen!' },
        { sender: 4, receiver: 1, article: 7, msg: 'Ich glaub Ihnen gehts wohl zu gut!' },{ sender: 1, receiver: 4, article: 7, msg: 'Beruhigen Sie sich, war doch nur ein Scherz ... Ist der Käfig noch zu haben?' },
        { sender: 7, receiver: 4, article: 10, msg: 'Warum so günstig?' }
    ]
    let chat_sql = 'INSERT INTO chat_table (sender, receiver, article, msg) VALUES ';
    for (x = 0; x< chat_arr.length; x++) {
        chat_sql = chat_sql + `('${chat_arr[x].sender}','${chat_arr[x].receiver}','${chat_arr[x].article}','${chat_arr[x].msg}')`;
        if (x < chat_arr.length - 1) chat_sql = chat_sql + ',';
        else chat_sql = chat_sql + ';';
    }

    try {
        await query(user_sql);
        console.log('Nutzer 1-7 angelegt: mail , password\t(1/6)');
        for (x = 0; x < user_arr.length; x++) console.log(`${x}: ${user_arr[x].mail} , wordpass`);
        await query(art_sql);
        console.log('\nArtikel angelegt\t\t\t(2/6)\n');
        await query(cat_sql);
        console.log('Kategorien angelegt\t\t\t(3/6)\n');
        await query(art_cat_sql);
        console.log('Kategorien und Artikel verknüpft\t(4/6)');
        await query(art_pic_sql);
        console.log('Artikel und Bilder verknüpft\t\t(5/6)');
        await query(chat_sql);
        console.log('Chatnachrichten angelegt\t\t(6/6)');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}