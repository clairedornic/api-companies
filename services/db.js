const config = require('../config');
const mysql = require('mysql2');

const connection = mysql.createConnection(config.db);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});