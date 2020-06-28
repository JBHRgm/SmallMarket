const mongo = require('mongoose');
const bcrypt = require('bcrypt');
const obid = mongo.ObjectID;
var con;

connect = (constring) => new Promise((resolve, reject) => {
    mongo.connect(constring, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
        if (err) { reject(err); return; };
        resolve(db);
    });
});


async function getAllUsers () {
    let res = [];
    try {
        let cursor = con.collection('Users').find();
        for await (let doc of cursor) {
            res.push(doc);
        }
    } catch (err) {
        throw (err);
    }
    return res;
}

async function registerUser(name, mail, pwd, plz, city, tel) {
    try {
        pwd = await bcrypt.hash(pwd, 10);
        con.collection('Users').insertOne({
            username: name,
            mail: mail,
            password: pwd,
            post: plz,
            city: city,
            phone: tel
        });
    } catch (err) {
        throw (err);
    }
}

async function checkmail (mail) {
    try {
        let cursor = con.collection('Users').find({ mail: mail });
        for await (let doc of cursor) {
            return true;
        }
        return false;
    } catch (err) {
        throw (err);
    }
}

async function checkusername (name) {
    try {
        let cursor = con.collection('Users').find({ username: name });
        for await (let doc of cursor) {
            return true;
        }
        return false;
    } catch (err) {
        throw (err);
    }
}

async function login (mail, pwd) {
    try {
        let cursor = con.collection('Users').find({ mail: mail });
        for await (let doc of cursor) {
            let valid = await bcrypt.compare(pwd, doc['password']);
            return valid;
        }
    } catch (err) {
        throw (err);
    }
}

async function getUserByMail (mail) {
    try {
        let cursor = con.collection('Users').find({ mail: mail });
        for await (let doc of cursor) {
            return {
                id: doc['_id'].toString(),
                name: doc['username'],
                mail: doc['mail'],
                post: doc['post'],
                city: doc['city']
            }
        }
        return 0;
    } catch (err) {
        throw (err);
    }
}

async function getUserByID (uid) {
    try {
        let cursor = con.collection('Users').find({ _id: obid(uid) });
        for await (let doc of cursor) {
            return {
                id: uid,
                name: doc['username'],
                mail: doc['mail'],
                post: doc['post'],
                city: doc['city']
            }
        }
        return 0;
    } catch (err) {
        throw (err);
    }
}


module.exports = {
    connect,
    getAllUsers,
    registerUser,
    getUserByID,
    getUserByMail,
    checkmail,
    login,
    checkusername
}