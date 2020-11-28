
var {Pool} = require('pg')
var db = require('./dataBase')

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT, 
  ssl:{
    rejectUnauthorized: false
  }
})

pool.on('error',(err,client) => {
  console.log('Error:',err)
})

var dataBase = new db(pool)
//console.log(dataBase)

module.exports = dataBase