
var mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: "9304543620",
    database: "mean"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("mysql connected");
})

module.exports = connection;
