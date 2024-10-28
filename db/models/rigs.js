// const client = require('../client');
import { pool } from '../connectionpool.js'


async function getAllRigs() {
  try {
    const [ allRigs ] = await pool.query(`
      SELECT *
      FROM rigs;
    `);
    return allRigs;
  } catch (error) {
    throw error;
  }
}

async function getRigById(id) {
  try {
    const [ rig ] = await pool.query(`
      SELECT *
      FROM rigs
      WHERE id = ?;
    `, [id]);

    // this is required because I was unable to destructure 2 layers into the nested arrays to access the actual user object like I did in the "getUser" function above
    // this should be functionally equivalient to doing "const [[user]]" in the pool.query
    const rigDestructure = rig[0];
    return rigDestructure;
  } catch (error) {
    throw error;
  }
}

async function createRig(rigInfo) {
  try {
    try {
      const valueString = Object.keys(rigInfo).map(
        (key, index) => `?`
      ).join(', ');

      const keyString = Object.keys(rigInfo).map(
        (key) => `${key}`
      ).join(', ');

      const [ createdRig ] = await pool.query(`
        INSERT INTO rigs (${keyString})
        VALUES (${valueString})
        `, Object.values(rigInfo));

      const newRigId = createdRig.insertId;
      const newRig = await getRigById(newRigId);  
      return newRig;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function updateRig(rigId, rigInfo) {
  try {
    const valueString = Object.keys(rigInfo).map(
      (key, index) => `${key} = '${rigInfo[key]}'`
    ).join(', ');

    const [ rigUpdate ] = await pool.query(`
      UPDATE rigs
      SET ${valueString}
      WHERE id = ?;
    `, [rigId]);

    const updatedRig = await getRigById(rigId);
    return updatedRig;
  } catch (error) {
    throw error;
  }
}

export {
  getAllRigs,
  getRigById,
  createRig,
  updateRig
};

// rigs have statuses, so we'll just set them to inactive rather than deleting
// async function destroyRig(rigId) {
//   try {
//     const { rows: [destroyedRig] } = await client.query(`
//       UPDATE rigs
//       SET 
//       WHERE id = $1
//       RETURNING *;
//       `, [rigId]);
//     return destroyedRig;
//   } catch (error) {
//     throw error;
//   }
// };



// module.exports = {
//   getAllRigs,
//   createRig,
//   updateRig
// };

