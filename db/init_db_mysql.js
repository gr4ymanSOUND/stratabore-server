import { pool } from './connectionpool.js'

// will need to rewrite and reorganize these imports to use modules

import * as Users from './models/users.js';
import * as Rigs from './models/rigs.js';
import * as Jobs from './models/jobs.js';
import * as JobRigs from './models/job_rigs.js';


async function buildTables() {
  try {

    // start of new MySQL syntax

    // connect to stratabore database
    await pool.query(`
      USE stratabore;
    `);
    
    // drop tables in correct order (reverse of creation, delete depending tables first)
    // can only do one query per pool connect

    await pool.query(`
      DROP TABLE IF EXISTS job_rigs;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS jobs;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS rigs;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS users;
    `);

    // build tables in correct order

    await pool.query(`
      CREATE TABLE users (
          id integer PRIMARY KEY AUTO_INCREMENT,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL, 
          username VARCHAR(255) UNIQUE NOT NULL, 
          password VARCHAR(255) UNIQUE NOT NULL,
          is_admin BOOLEAN DEFAULT false,
          status VARCHAR(255) NOT NULL
        );
    `);
    
    await pool.query(`  
      CREATE TABLE rigs (
          id integer PRIMARY KEY AUTO_INCREMENT,
          license_plate VARCHAR(255) NOT NULL,
          rig_type VARCHAR(255) NOT NULL,
          board_color VARCHAR(255) NOT NULL,
          registration_due VARCHAR(255) NOT NULL,
          maintenance_due VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`    
      CREATE TABLE jobs (
          id integer PRIMARY KEY AUTO_INCREMENT,
          job_number VARCHAR(255) UNIQUE NOT NULL,
          client VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          num_holes INTEGER NOT NULL DEFAULT 1,
          num_feet INTEGER NOT NULL DEFAULT 20,
          job_length NUMERIC(2,1) NOT NULL DEFAULT 1,
          status VARCHAR(255) NOT NULL,
          created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE job_rigs (
          job_date VARCHAR(255),
          job_id INTEGER NOT NULL,
          rig_id INTEGER NOT NULL,
          FOREIGN KEY (job_id) REFERENCES jobs(id),
          FOREIGN KEY (rig_id) REFERENCES rigs(id),
          PRIMARY KEY (job_id, rig_id, job_date)
      );
    `);

  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {

    const usersToCreate =   [
        {first_name:'Tommy', last_name:'Lawrence', email:'tommy@stratabore.com', username:'bossman', password:'bossmanistheboss', is_admin: true , status: 'active'},
        {first_name:'Austin', last_name:'Lawrence', email:'austin.lawrence.al@gmail.com', username:'coolhatguy', password:'ochocinco', is_admin: true, status: 'active'},
        {first_name:'Meghan', last_name:'Lawrence', email:'test@email.email', username:'meguhman', password:'dotterbore', is_admin: false, status: 'active'}
      ];
 
      console.log("creating users");
      const users = await Promise.all(usersToCreate.map(Users.createUser));
      console.log(users);
      console.log("finished creating users!!");

      // const rigsToCreate = [
      //   {licensePlate: 'SSS-5555', rigType: 'big', boardColor: 'red', registrationDueDate: "2023-05-31", maintenanceDueDate: "2023-05-31", status: 'active'},
      //   {licensePlate: 'TTT-5555', rigType: 'lil', boardColor: 'green', registrationDueDate: "2023-05-28", maintenanceDueDate: "2023-05-28", status: 'active'},
      //   {licensePlate: 'RRR-5555', rigType: 'mid', boardColor: 'blue', registrationDueDate: "2023-05-31", maintenanceDueDate: "2023-05-18", status: 'active'},
      //   {licensePlate: 'AAA-5555', rigType: 'lil', boardColor: 'orange', registrationDueDate: "2023-05-22", maintenanceDueDate: "2023-05-20", status: 'active'},
      //   {licensePlate: 'TTT-6666', rigType: 'big', boardColor: 'purple', registrationDueDate: "2023-05-25", maintenanceDueDate: "2023-05-05", status: 'active'},
      //   {licensePlate: 'AAA-6666', rigType: 'big', boardColor: 'yellow', registrationDueDate: "2023-05-31", maintenanceDueDate: "2023-05-31", status: 'active'},
      // ]

      // console.log("creating rigs");
      // const rigs = await Promise.all(rigsToCreate.map(Rigs.createRig)); 
      // console.log(rigs);
      // console.log("finished creating rigs!!");

      // const jobsToCreate = [
      //   {jobNumber: 'EWL-227', client: 'EWL', location: 'Plano, TX', numHoles: 3, numFeet: 60, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'TER-321', client: 'TER', location: 'Sachse, TX', numHoles: 1, numFeet: 20, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-111', client: 'AAA', location: 'Parker, TX', numHoles: 5, numFeet: 1000, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-2626', client: 'ZZZ', location: 'Lucas, TX', numHoles: 3, numFeet: 120, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-2627', client: 'ZZZ', location: 'Frisco, TX', numHoles: 2, numFeet: 100, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-2628', client: 'ZZZ', location: 'McKinney, TX', numHoles: 4, numFeet: 80, jobLength: 0.7, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-2629', client: 'ZZZ', location: 'Mansfield, TX', numHoles: 4, numFeet: 80, jobLength: 0.3, status: 'complete', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-2630', client: 'ZZZ', location: 'Mesquite, TX', numHoles: 3, numFeet: 60, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-26', client: 'EWL', location: 'Rose Hill, TX', numHoles: 5, numFeet: 200, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-2', client: 'EWL', location: 'Rowlett, TX', numHoles: 2, numFeet: 30, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-6', client: 'ZZZ', location: 'Saginaw, TX', numHoles: 2, numFeet: 40, jobLength: 0.6, status: 'canceled', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-666', client: 'EWL', location: 'Burleson, TX', numHoles: 1, numFeet: 20, jobLength: 0.8, status: 'canceled', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-123', client: 'AAA', location: 'Ft. Worth, TX', numHoles: 3, numFeet: 60, jobLength: 0.8, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-456', client: 'AAA', location: 'Dallas, TX', numHoles: 5, numFeet: 100, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-100', client: 'AAA', location: 'Bedford, TX', numHoles: 2, numFeet: 50, jobLength: 0.7, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-200', client: 'AAA', location: 'Cedar Hill, TX', numHoles: 2, numFeet: 50, jobLength: 0.7, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-300', client: 'AAA', location: 'Desoto, TX', numHoles: 2, numFeet: 50, jobLength: 0.3, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'TER-7400', client: 'TER', location: 'Haltom City, TX', numHoles: 2, numFeet: 50, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'TER-222', client: 'TER', location: 'Grand Prairie, TX', numHoles: 1, numFeet: 25, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'TER-987', client: 'TER', location: 'Lewisville, TX', numHoles: 3, numFeet: 75, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-5454', client: 'EWL', location: 'Carrolton, TX', numHoles: 4, numFeet: 100, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-1234', client: 'EWL', location: 'Flower Mound, TX', numHoles: 1, numFeet: 20, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-999', client: 'ZZZ', location: 'Justin, TX', numHoles: 2, numFeet: 40, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'ZZZ-889', client: 'ZZZ', location: 'Prosper, TX', numHoles: 1, numFeet: 20, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-112', client: 'AAA', location: 'Grapevine, TX', numHoles: 1, numFeet: 50, jobLength: 0.5, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'AAA-567', client: 'AAA', location: 'Crowley, TX', numHoles: 2, numFeet: 100, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      //   {jobNumber: 'EWL-876', client: 'EWL', location: 'Midlothian, TX', numHoles: 4, numFeet: 200, jobLength: 1.0, status: 'pending', createdDate: '2023-01-01'},
      // ];

      // console.log("creating jobs");
      // const jobs = await Promise.all(jobsToCreate.map(Jobs.createJob));
      // console.log(jobs);
      // console.log("finished creating jobs!!");

      // const jobsToAssign = [
      //   {jobId: 1, rigId: 1, jobDate: '2023-06-19'},
      //   {jobId: 2, rigId: 1, jobDate: '2023-06-19'},
      //   {jobId: 2, rigId: 2, jobDate: '2023-06-19'}
      // ]

      // console.log("creating job assignments");
      // const jobAssignments = await Promise.all(jobsToAssign.map(JobRigs.createJobAssignment));
      // console.log(jobAssignments);
      // console.log("finished creating jobs assignments!!");

      // console.log('testing job_rig updates');
      // const updatedJob = await JobRigs.updateJobAssignment({jobId: 1, rigId: 1, jobDate: '2023-06-18'});
      // console.log("finished updating job", updatedJob);

}

buildTables()
  .then(populateInitialData)
  .catch(console.error)