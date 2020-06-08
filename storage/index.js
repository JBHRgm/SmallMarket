const mongoClient = require('mongodb').MongoClient;
var con;

connect = () => new Promise((resolve, reject) => {
    mongoClient.connect("mongodb://192.168.99.100:32768", { useUnifiedTopology: true }, function(err, db) {
        if (err) { reject(err); return; };
        con = db.db('marketstorage');
        resolve(con);
    });
});


function getUsers () {
    let matches = con.collection('Users').find();
    return matches;
}

function setUser(mail, pwd) {
    con.collection('Users').insertOne({
        User_mail: mail,
        User_pwd: pwd
      });
}



module.exports = {
    getUsers,
    setUser,
    connect
}