const client = require('../client');

async function getAllRigs() {
  try {
    const { rows: allRigs } = await client.query(`
      SELECT *
      FROM rigs;
    `);
    return allRigs;
  } catch (error) {
    throw error;
  }
}

async function createRig(rigInfo) {
  try {
    try {
      const valueString = Object.keys(rigInfo).map(
        (key, index) => `$${index + 1}`
      ).join(', ');
      const keyString = Object.keys(rigInfo).map(
        (key) => `"${key}"`
      ).join(', ');
      const { rows: [newRig] } = await client.query(`
        INSERT INTO rigs (${keyString})
        VALUES (${valueString})
        RETURNING *;
        `, Object.values(rigInfo));
      return newRig;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

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

async function updateRig(rigId, rigInfo) {
  try {
    const valueString = Object.keys(rigInfo).map(
      (key, index) => `"${key}" = '${rigInfo[key]}'`
    ).join(', ');
    const { rows: [updatedRig] } = await client.query(`
      UPDATE rigs
      SET ${valueString}
      WHERE id = $1
      RETURNING *;
    `, [rigId]);
    return updatedRig;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllRigs,
  createRig,
  updateRig
};