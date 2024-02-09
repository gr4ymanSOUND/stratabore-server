import mysql from 'mysql2';

  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'GRAYadmin',
    database: 'stratabore'
  }).promise();

  // for the live environment
  // couldn't get the node_env variable (prod vs dev) to work correctly for some reason, so just switching between which is commented when I make a build for uploading
  // const pool = mysql.createPool({
  //   host: process.env.MYSQL_HOST,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD,
  //   database: process.env.MYSQL_DATABASE
  // }).promise();

export { pool };