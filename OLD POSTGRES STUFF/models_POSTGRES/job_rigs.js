// const client = require('../client');
import { pool } from '../connectionpool.js'


async function getAllJobsAndAssignments() {
  try {
    const {rows: allJobs} = await client.query(`
      SELECT *
      FROM jobs
      LEFT JOIN job_rigs
        ON jobs.id = job_rigs."jobId";
    `);
    return allJobs;
  } catch (error) {
    throw error;
  }
}

async function getAssignedJobs() {
  try {
    const {rows: assignedJobs} = await client.query(`
      SELECT *
      FROM job_rigs
      INNER JOIN jobs
        ON job_rigs."jobId" = jobs.id;
    `);
    return assignedJobs;
  } catch (error) {
    throw error;
  }
}

async function createJobAssignment({jobId, rigId, jobDate}) {
  try {
    const {rows: [job_rig]} = await client.query(`
      INSERT INTO job_rigs("jobId", "rigId", "jobDate")
      VALUES($1, $2, $3)
      RETURNING *;
    `, [jobId, rigId, jobDate]);
    return job_rig;
  } catch (error) {
    throw error;
  }
}

async function deleteJobAssignment({jobId, rigId, jobDate}) {
  try {
    const {rows: [job_rig]} = await client.query(`
      DELETE FROM job_rigs
      WHERE "jobId" = $1 AND "rigId" = $2 AND "jobDate" = $3;
    `, [jobId, rigId, jobDate])
    return job_rig;
  } catch (error) {
    throw error;
  }
}

async function updateJobAssignment({jobId, rigId, jobDate}) {
  try {
    const {rows: [job_rig]} = await client.query(`
      UPDATE job_rigs
      SET "jobDate" = $3
      WHERE "jobId" = $1 AND "rigId" = $2
      RETURNING *;
    `, [jobId, rigId, jobDate]);
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
  createJobAssignment,
  deleteJobAssignment,
  updateJobAssignment
};