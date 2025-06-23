import mysql from 'mysql2';
// import 'dotenv/config.js';

// console.log('DB_USER:', process.env.MYSQL_USER);
// console.log('DB_PASSWORD:', process.env.MYSQL_PASSWORD);
// console.log('DB_HOST:', process.env.MYSQL_HOST);
// console.log('DB_NAME:', process.env.MYSQL_DATABASE);
// console.log('NODE_ENV:', process.env.NODE_ENV);

let pool;
if (process.env.NODE_ENV = 'development'){
  pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'GRAYadmin',
    database: 'stratabore'
  }).promise();
} else {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise();
}
  
  // for the live environment
  // in another project hosted on same server , Icouldn't get the node_env variable (prod vs dev) to work correctly for some reason, so just switching between which is commented when I make a build for uploading
  // const pool = mysql.createPool({
  //   host: process.env.MYSQL_HOST,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD,
  //   database: process.env.MYSQL_DATABASE
  // }).promise();



export { pool };