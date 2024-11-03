// const apiRouter = require('express').Router();
// const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
// const { getUserById } = require('../db/models/users');
import express from 'express';
const apiRouter = express.Router();
import jwt from 'jsonwebtoken';
import { getUserById } from '../db/models/users.js';

// this middleware checks the "Authorization" header passed to the route and gets user object if the token is verified
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if(id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authoriztion token must start with ${ prefix }`
      });
  }
});


// API routers

// const userRouter = require('./users');
import { userRouter} from './users.js';
apiRouter.use('/users', userRouter);

// const jobRouter = require('./jobs');
import { jobRouter } from './jobs.js';
apiRouter.use('/jobs', jobRouter);

// const rigRouter = require('./rigs');
import { rigRouter } from './rigs.js';
apiRouter.use('/rigs', rigRouter);

// const jobRigRouter = require('./job_rigs');
import { jobRigRouter } from './job_rigs.js';
apiRouter.use('/assignments', jobRigRouter);


// module.exports = apiRouter;
export { apiRouter };