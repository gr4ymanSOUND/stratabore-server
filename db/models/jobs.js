// const client = require('../client');
import { pool } from '../connectionpool.js'

async function getAllJobs() {
  try {
    const [ allJobs ] = await pool.query(`
      SELECT *
      FROM jobs;
    `);
    return allJobs;
  } catch (error) {
    throw error;
  }
}

async function getJobById(id) {
  try {
    const [ job ] = await pool.query(`
      SELECT *
      FROM jobs
      WHERE id = ?;
    `, [id]);

    // this is required because I was unable to destructure 2 layers into the nested arrays to access the actual user object like I did in the "getUser" function above
    // this should be functionally equivalient to doing "const [[user]]" in the pool.query
    const jobDestructured = job[0];
    return jobDestructured;
  } catch (error) {
    throw error;
  }
}

async function createJob(jobInfo) {
  try {
    const keys = Object.keys(jobInfo);
    const keyString = keys.join(', ');
    const valuePlaceholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => jobInfo[key]);

    const [ createdJob ] = await pool.query(
      `INSERT INTO jobs (${keyString}) VALUES (${valuePlaceholders});`,
      values
    );

    const newJobId = createdJob.insertId;
    const newJob = await getJobById(newJobId);
    return newJob;
  } catch (error) {
    throw error;
  }
}

async function updateJob(jobId, jobInfo) {
  try {
    const keys = Object.keys(jobInfo);
    const setString = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => jobInfo[key]);
    values.push(jobId); // for WHERE clause

    const [ jobUpdate ] = await pool.query(
      `UPDATE jobs SET ${setString} WHERE id = ?;`,
      values
    );

    const updatedJob = await getJobById(jobId);
    return updatedJob;
  } catch (error) {
    throw error;
  }
}

export {
  getAllJobs,
  getJobById,
  createJob,
  updateJob
};

// jobs have statuses, so we will update rather than destroy
// async function destroyJob(jobId) {
//   try {
//     const { rows: [destroyedJob] } = await client.query(`
//       DELETE FROM jobs
//       WHERE id = $1
//       RETURNING *;
//       `, [jobId]);
//     return destroyedJob;
//   } catch (error) {
//     throw error;
//   }
// };



// module.exports = {
//   getAllJobs,
//   createJob,
//   updateJob
// };

