
var {Pool} = require('pg')
var db = require('./dataBase')

const pool = new Pool({
  user: process.env.PGUSERT,
  host: process.env.PGHOSTT,
  database: process.env.PGDATABASET,
  password: process.env.PGPASSWORDT,
  port: process.env.PGPORT, 
  /*ssl:{
    rejectUnauthorized: false
  }*/
})

pool.on('error',(err,client) => {
  console.log('Error:',err)
})

var dataBase = new db(pool)
//console.log(dataBase)

module.exports = dataBase