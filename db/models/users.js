// grab our db client connection to use with our adapters
// const client = require('../client');
import { pool } from '../connectionpool.js'
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcrypt');
const SALT = 13;

async function getAllUsers() {
    try {
      const [ allUsers ] = await pool.query(`
        SELECT id, first_name, last_name, email, username, rig_id, is_admin, status
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

    const keys = Object.keys(userInfo);
    const keyString = keys.join(', ');
    const valuePlaceholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => userInfo[key]);

    const [ createdUser ] = await pool.query(
      `INSERT INTO users (${keyString}) VALUES (${valuePlaceholders});`,
      values
    );

      const newUserId = createdUser.insertId;
      const newUser = await getUserById(newUserId);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(userId, userInfo) {
    try {
      // check if userInfo has a password to update, and encrypt it the same way as when creating a user
      if (userInfo.password) {
        const hashedPassword = await bcrypt.hash(userInfo.password, SALT);
        userInfo.password = hashedPassword;
      }
      
      // Convert empty string rig_id to null (for safety)
      if ('rig_id' in userInfo && (userInfo.rig_id === '' || userInfo.rig_id === undefined)) {
        userInfo.rig_id = null;
      }

      const keys = Object.keys(userInfo);
      const setString = keys.map(key => `${key} = ?`).join(', ');
      const values = keys.map(key => userInfo[key]);
      values.push(userId);

      await pool.query(`
        UPDATE users
        SET ${setString}
        WHERE id = ?;
        `, values
      );

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

