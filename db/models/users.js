// grab our db client connection to use with our adapters
// const client = require('../client');
import { pool } from '../connectionpool.js'
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcrypt');
const SALT = 13;

async function getAllUsers() {
    try {
      const [ allUsers ] = await pool.query(`
        SELECT id, first_name, last_name, email, username, is_admin, status
        FROM users;
      `);
      return allUsers;
    } catch (error) {
      throw error;
    }
  }
  
  async function getUser({ username, password }) {
  
    try {
      const [ [user] ]= await pool.query(`
        SELECT *
        FROM users
        WHERE username = ?;
      `, [username]);
      
      if (!user) {
        throw new Error('issue logging in');
      };
  
      const userPassword = user.password;
      const passwordMatch = await bcrypt.compare(password, userPassword);
      if (!passwordMatch) return;
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(id) {
    try {
      const [ user ] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?;
      `, [id]);
  
      // this is required because I was unable to destructure 2 layers into the nested arrays to access the actual user object like I did in the "getUser" function above
      // this should be functionally equivalient to doing "const [[user]]" in the pool.query
      const userDestructured = user[0];
      delete userDestructured.password;
      return userDestructured;
    } catch (error) {
      throw error;
    }
  }
  
  async function createUser(userInfo) {
    try {
      const hashedPassword = await bcrypt.hash(userInfo.password, SALT);
      userInfo.password = hashedPassword;
      const valueString = Object.keys(userInfo).map(
        (key, index) => `?`
      ).join(', ');

      const keyString = Object.keys(userInfo).map(
        (key) => `${ key }`
      ).join(', ');
  
      const [ createdUser ] = await pool.query(`
        INSERT INTO users (${keyString})
        VALUES (${valueString});
      `, Object.values(userInfo));

      const newUserId = createdUser.insertId;
      const newUser = await getUserById(newUserId);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(userId, userInfo) {
    try {
      const valueString = Object.keys(userInfo).map(
        (key, index) => {
          // special case for the is_admin field - since it's boolean, we need to remove the quotes from the 2nd half of the entry
          if (key == 'is_admin') {
            return `${key} = ${userInfo[key]}`
          }
          return `${key} = '${userInfo[key]}'`
        }
      ).join(', ');

      const [ userUpdate ] = await pool.query(`
        UPDATE users
        SET ${valueString}
        WHERE id = ?;
      `, [userId]);

      if (userInfo.status != 'inactive') {
        const updatedUser = await getUserById(userId);
        return updatedUser;
      } else {
        return `User ID: ${userId} has been set to Inactive. Users cannot be deleted for data integrity purposes.`
      }
      
    } catch (error) {
      throw error;
    }
  }

  export {
    getAllUsers,
    getUser,
    getUserById,
    createUser,
    updateUser
  };

    
  // async function getUserByUserName(userName) {
  //   try {
  //     const [ user ] = await pool.query(`
  //       SELECT *
  //       FROM users
  //       WHERE username = ?;
  //     `, [userName]);
      
  //     delete user.password;
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  
  // module.exports = {
  //   getAllUsers,
  //   getUser,
  //   getUserById,
  //   getUserByUserName,
  //   createUser,
  //   updateUser
  // };

