// const client = require('../client');
import { pool } from '../connectionpool.js'


async function getAllJobsAndAssignments() {
  try {
    const [ allJobs ] = await pool.query(`
      SELECT *
      FROM jobs
      LEFT JOIN job_rigs
        ON jobs.id = job_rigs.job_id;
    `);
    return allJobs;
  } catch (error) {
    throw error;
  }
}

async function getAssignedJobs() {
  try {
    const [ assignedJobs ] = await pool.query(`
      SELECT *
      FROM job_rigs
      INNER JOIN jobs
        ON job_rigs.job_id = jobs.id;
    `);
    return assignedJobs;
  } catch (error) {
    throw error;
  }
}

async function getAssignedJobById(job_id, rig_id) {
  try {
    const [ assignedJob ] = await pool.query(`
      SELECT *
      FROM job_rigs
      INNER JOIN jobs
        ON job_rigs.job_id = jobs.id
      WHERE job_rigs.job_id = ? AND job_rigs.rig_id = ?;
    `, [job_id, rig_id]);

    // this is required because I was unable to destructure 2 layers into the nested arrays to access the actual user object like I did in the "getUser" function above
    // this should be functionally equivalient to doing "const [[user]]" in the pool.query
    const assignedJobobDestructured = assignedJob[0];
    return assignedJobobDestructured;
  } catch (error) {
    throw error;
  }
}

async function createJobAssignment({job_id, rig_id, job_date}) {
  try {
    const [ assignedJob ] = await pool.query(`
      INSERT INTO job_rigs(job_id, rig_id, job_date)
      VALUES(?, ?, ?);
    `, [job_id, rig_id, job_date]);

    const job_rig = await getAssignedJobById(job_id, rig_id, job_date);
    return job_rig;
  } catch (error) {
    throw error;
  }
}

async function deleteJobAssignment({job_id, rig_id, job_date}) {
  try {
    const [ assignedJob ] = await pool.query(`
      DELETE FROM job_rigs
      WHERE job_id = ? AND rig_id = ? AND job_date = ?;
    `, [job_id, rig_id, job_date]);
    console.log('deleteassignment data', job_id, rig_id, job_date)

    return `Job #${job_id} Unassigned from Rig #${rig_id} on ${job_date}.`;
  } catch (error) {
    throw error;
  }
}

async function updateJobAssignment({job_id, rig_id, job_date}) {
  try {
    const [ assignmentUpdate ] = await pool.query(`
      UPDATE job_rigs
      SET job_date = ?
      WHERE job_id = ? AND rig_id = ?;
    `, [job_date, job_id, rig_id]);

    const job_rig = await getAssignedJobById(job_id, rig_id);
    return job_rig;
  } catch (error) {
    throw error;
  }
}

// module.exports = {
//   getAllJobsAndAssignments,
//   getAssignedJobs,
//   createJobAssignment,
//   deleteJobAssignment,
//   updateJobAssignment
// }

export {
  getAllJobsAndAssignments,
  getAssignedJobs,
  getAssignedJobById,
  createJobAssignment,
  deleteJobAssignment,
  updateJobAssignment
}