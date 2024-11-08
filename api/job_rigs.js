import express from 'express';
const jobRigRouter = express.Router();
import { requireUser } from './utils.js'
import {
  getAllJobsAndAssignments,
  getAssignedJobs,
  createJobAssignment,
  deleteJobAssignment,
  updateJobAssignment
} from '../db/models/job_rigs.js';

jobRigRouter.get('/all', requireUser, async (req, res, next) => {
  try {
    const jobRigs = await getAllJobsAndAssignments();
    res.send(jobRigs);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.get('/assigned', requireUser, async (req, res, next) => {
  try {
    const assignedJobRigs = await getAssignedJobs();
    res.send(assignedJobRigs);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.post('/assign', requireUser, async (req, res, next) => {
  try {
    const { newJobRig } = req.body;
    console.log('api jobrig assign req.body', newJobRig)
    const newAssignment = await createJobAssignment(newJobRig);
    res.send(newAssignment);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.patch('/update', requireUser, async (req, res, next) => {
  try {
    const { newJobRig}  = req.body;
    console.log('api jobrig update req.body', newJobRig)
    const updatedAssigment = await updateJobAssignment(newJobRig);
    res.send(updatedAssigment);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.delete('/unassign', requireUser, async (req, res, next) => {
  try {
    const { jobToUnassign}  = req.body;
    console.log('api jobrig unassign req.body', jobToUnassign);
    const deletedJob = await deleteJobAssignment(jobToUnassign);
    res.send(deletedJob);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

// module.exports = jobRigRouter;
export { jobRigRouter };