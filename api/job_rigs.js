const jobRigRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const {
  getAllJobsAndAssignments,
  getAssignedJobs,
  createJobAssignment,
  deleteJobAssignment,
  updateJobAssignment
} = require('../db/models/job_rigs');

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

jobRigRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { newJobRig } = req.body;
    const newAssignment = await createJobAssignment(newJobRig);
    res.send(newAssignment);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.patch('/', requireUser, async (req, res, next) => {
  try {
    const { newJobRig } = req.body;
    const updatedAssigment = await updateJobAssignment(newJobRig);
    res.send(updatedAssigment);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRigRouter.delete('/', requireUser, async (req, res, next) => {
  try {
    const { jobToUnassign } = req.body;
    const deletedJob = await deleteJobAssignment(jobToUnassign);
    res.send(deletedJob);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

module.exports = jobRigRouter;