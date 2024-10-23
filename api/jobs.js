
import express from 'express';
const jobRouter = express.Router();
import { requireUser } from'../api/utils.js';
import { 
  getAllJobs, 
  createJob, 
  updateJob
 } from '../db/models/jobs.js';

jobRouter.get('/', requireUser, async (req, res, next) => {
  try {
    const jobs = await getAllJobs();
    res.send(jobs);
  } catch (error) {
    console.error(error);
    res.next(error);
  }
});

jobRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { newJob } = req.body;
    const addedJob = await createJob(newJob);
    res.send(addedJob);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

jobRouter.delete('/:jobId', requireUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const newJobData = {status: 'canceled'}
    const deletedJob = await updateJob(jobId, newJobData);
    res.send(deletedJob);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

jobRouter.patch('/:jobId', requireUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { newJobData } = req.body;

    const updatedJob = await updateJob(jobId, newJobData);
    res.send(updatedJob);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

// module.exports = jobRouter;
export { jobRouter };