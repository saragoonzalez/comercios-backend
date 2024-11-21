require('dotenv').config()
let mysql = require('mysql')

let connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
    // host: 'localhost',
    // user: 'root',
    // password: '1234',
    // database: 'dbcollectors'
})

const executeQuery = (command) => {
    return new Promise((resolve, reject) => {
        connection.query(command, (error, elements) => {
            if (error) {
                return reject(error)
            }
            return resolve(elements)
        })
    })
}

module.exports = {
    executeQuery
}