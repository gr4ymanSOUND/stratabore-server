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
      DROP TABLE IF EXISTS rig_users;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS job_rigs;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS jobs;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS users;
    `);

    await pool.query(`
      DROP TABLE IF EXISTS rigs;
    `);



    // build tables in correct order

    await pool.query(`  
      CREATE TABLE rigs (
          id integer PRIMARY KEY AUTO_INCREMENT,
          license_plate VARCHAR(25) NOT NULL,
          rig_type VARCHAR(25) NOT NULL,
          board_color VARCHAR(25) NOT NULL,
          registration_due VARCHAR(25) NOT NULL,
          maintenance_due VARCHAR(25) NOT NULL,
          notes VARCHAR(255),
          status VARCHAR(25) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE users (
          id integer PRIMARY KEY AUTO_INCREMENT,
          first_name VARCHAR(25) NOT NULL,
          last_name VARCHAR(25) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL, 
          username VARCHAR(50) UNIQUE NOT NULL, 
          password VARCHAR(255) UNIQUE NOT NULL,
          is_admin BOOLEAN DEFAULT false,
          status VARCHAR(25) NOT NULL,
          rig_id INTEGER,
          FOREIGN KEY (rig_id) REFERENCES rigs(id)
        );
    `);

    await pool.query(`    
      CREATE TABLE jobs (
          id integer PRIMARY KEY AUTO_INCREMENT,
          job_number VARCHAR(255) UNIQUE NOT NULL,
          client VARCHAR(25) NOT NULL,
          location VARCHAR(255) NOT NULL,
          num_holes INTEGER NOT NULL DEFAULT 1,
          num_feet INTEGER NOT NULL DEFAULT 20,
          notes VARCHAR(255),
          job_length NUMERIC(2,1) NOT NULL DEFAULT 1,
          status VARCHAR(25) NOT NULL,
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

      // list of rigs to populate table
      const rigsToCreate = [
        {license_plate: 'SSS-5555', rig_type: 'big', board_color: 'red', registration_due: "2023-05-31", maintenance_due: "2023-05-31", notes: 'test note on a rig', status: 'active'},
        {license_plate: 'TTT-5555', rig_type: 'lil', board_color: 'green', registration_due: "2023-05-28", maintenance_due: "2023-05-28", status: 'active'},
        {license_plate: 'RRR-5555', rig_type: 'mid', board_color: 'blue', registration_due: "2023-05-31", maintenance_due: "2023-05-18", status: 'active'},
        {license_plate: 'AAA-5555', rig_type: 'lil', board_color: 'orange', registration_due: "2023-05-22", maintenance_due: "2023-05-20", status: 'active'},
        {license_plate: 'TTT-6666', rig_type: 'big', board_color: 'purple', registration_due: "2023-05-25", maintenance_due: "2023-05-05", status: 'active'},
        {license_plate: 'AAA-6666', rig_type: 'big', board_color: 'yellow', registration_due: "2023-05-31", maintenance_due: "2023-05-31", status: 'active'},
      ]

      // create the rigs
      console.log("creating rigs");
      const rigs = await Promise.all(rigsToCreate.map(Rigs.createRig)); 
      console.log("finished creating rigs!!");

      // test the rig db models
      // console.log('testing other rig db models')
      // const allRigs = await Rigs.getAllRigs();
      // console.log("getAllRigs result:", allRigs);

      // const rig1 = await Rigs.getRigById(1);
      // console.log("getRigById result:", rig1);

      // const rigInfo = {
      //   license_plate: 'SSS-5555',
      //   rig_type: 'lil',
      //   board_color: 'red',
      //   registration_due: "2024-05-31",
      //   maintenance_due: "2024-05-31",
      //   status: 'active'
      // }
      // const updatedRig = await Rigs.updateRig(1, rigInfo);
      // console.log("updateRig result:", updatedRig);

      // list of users to create in bulk to populate the table and test the db models
      const usersToCreate =   [
          {first_name:'Tommy', last_name:'Lawrence', email:'tommy@stratabore.com', username:'bossman', password:'bossmanistheboss', is_admin: true , status: 'active'},
          {first_name:'Austin', last_name:'Lawrence', email:'austin.lawrence.al@gmail.com', username:'coolhatguy', password:'ochocinco', is_admin: true, status: 'active'},
          {first_name:'Coolhat', last_name:'Crew', email:'coolhat.crew@crew.crew', username:'coolhatcrew', password:'ochocinco', is_admin: false, status: 'active', rig_id: 1}, 
          {first_name:'Meghan', last_name:'Lawrence', email:'test@email.email', username:'meguhman', password:'dotterbore', is_admin: false, status: 'active'}
        ];
  
      // create the users
      console.log("creating users");
      const users = await Promise.all(usersToCreate.map(Users.createUser));
      console.log("finished creating users!!");

      // test the users db models
      // console.log('Testing other db models for users');
      // const allUsers = await Users.getAllUsers();
      // console.log("getAllUsers result:", allUsers);

      // const ObjectUser1 = {username: 'bossman', password: 'bossmanistheboss'}
      // const user1 = await Users.getUser(ObjectUser1);
      // console.log("getUser (by username and password) result:", user1);
      
      // const user2 = await Users.getUserById(1);
      // console.log("getUserById result:", user2);


      const jobsToCreate = [
        {job_number: 'EWL-227', client: 'EWL', location: 'Plano, TX', num_holes: 3, num_feet: 60, job_length: 0.5, status: 'pending', notes: 'test job for EWL'},
        {job_number: 'TER-321', client: 'TER', location: 'Sachse, TX', num_holes: 1, num_feet: 20, job_length: 1.0, status: 'pending', notes: 'test job for TER'},
        {job_number: 'AAA-111', client: 'AAA', location: '123 Main St, Dallas, TX 75201', num_holes: 5, num_feet: 1000, job_length: 1.0, status: 'pending', notes: 'test job for AAA'},
        {job_number: 'ZZZ-2626', client: 'ZZZ', location: '32.7767, -96.7970', num_holes: 3, num_feet: 120, job_length: 1.0, status: 'pending'}, // Dallas lat/lng
        {job_number: 'ZZZ-2627', client: 'ZZZ', location: '456 Oak Ave, Fort Worth, TX 76102', num_holes: 2, num_feet: 100, job_length: 0.5, status: 'pending'},
        {job_number: 'ZZZ-2628', client: 'ZZZ', location: '33.0198, -96.6989', num_holes: 4, num_feet: 80, job_length: 0.7, status: 'pending'}, // Plano lat/lng
        {job_number: 'ZZZ-2629', client: 'ZZZ', location: 'Mansfield, TX', num_holes: 4, num_feet: 80, job_length: 0.3, status: 'complete'},
        {job_number: 'ZZZ-2630', client: 'ZZZ', location: '789 Elm St, Arlington, TX 76010', num_holes: 3, num_feet: 60, job_length: 1.0, status: 'pending'},
        {job_number: 'EWL-26', client: 'EWL', location: '32.7357, -97.1081', num_holes: 5, num_feet: 200, job_length: 1.0, status: 'pending'}, // Arlington lat/lng
        {job_number: 'EWL-2', client: 'EWL', location: 'Rowlett, TX', num_holes: 2, num_feet: 30, job_length: 0.5, status: 'pending'},
        {job_number: 'ZZZ-6', client: 'ZZZ', location: '101 Maple Dr, Irving, TX 75039', num_holes: 2, num_feet: 40, job_length: 0.6, status: 'canceled'},
        {job_number: 'EWL-666', client: 'EWL', location: '32.9537, -96.8903', num_holes: 1, num_feet: 20, job_length: 0.8, status: 'canceled'}, // Carrollton lat/lng
        {job_number: 'AAA-123', client: 'AAA', location: 'Ft. Worth, TX', num_holes: 3, num_feet: 60, job_length: 0.8, status: 'pending'},
        {job_number: 'AAA-456', client: 'AAA', location: '2222 Commerce St, Dallas, TX 75201', num_holes: 5, num_feet: 100, job_length: 1.0, status: 'pending'},
        {job_number: 'AAA-100', client: 'AAA', location: 'Bedford, TX', num_holes: 2, num_feet: 50, job_length: 0.7, status: 'pending'},
        {job_number: 'AAA-200', client: 'AAA', location: '33.0137, -96.6925', num_holes: 2, num_feet: 50, job_length: 0.7, status: 'pending'}, // Richardson lat/lng
        {job_number: 'AAA-300', client: 'AAA', location: 'Desoto, TX', num_holes: 2, num_feet: 50, job_length: 0.3, status: 'pending'},
        {job_number: 'TER-7400', client: 'TER', location: 'Haltom City, TX', num_holes: 2, num_feet: 50, job_length: 1.0, status: 'pending'},
        {job_number: 'TER-222', client: 'TER', location: '5555 Legacy Dr, Plano, TX 75024', num_holes: 1, num_feet: 25, job_length: 1.0, status: 'pending'},
        {job_number: 'TER-987', client: 'TER', location: '32.8343, -96.6998', num_holes: 3, num_feet: 75, job_length: 0.5, status: 'pending'}, // Garland lat/lng
        {job_number: 'EWL-5454', client: 'EWL', location: 'Carrolton, TX', num_holes: 4, num_feet: 100, job_length: 1.0, status: 'pending'},
        {job_number: 'EWL-1234', client: 'EWL', location: 'Flower Mound, TX', num_holes: 1, num_feet: 20, job_length: 0.5, status: 'pending'},
        {job_number: 'ZZZ-999', client: 'ZZZ', location: 'Justin, TX', num_holes: 2, num_feet: 40, job_length: 0.5, status: 'pending'},
        {job_number: 'ZZZ-889', client: 'ZZZ', location: 'Prosper, TX', num_holes: 1, num_feet: 20, job_length: 0.5, status: 'pending'},
        {job_number: 'AAA-112', client: 'AAA', location: '33.0198, -96.6989', num_holes: 1, num_feet: 50, job_length: 0.5, status: 'pending'}, // Plano lat/lng
        {job_number: 'AAA-567', client: 'AAA', location: 'Crowley, TX', num_holes: 2, num_feet: 100, job_length: 1.0, status: 'pending'},
        {job_number: 'EWL-876', client: 'EWL', location: '32.5771, -97.1196', num_holes: 4, num_feet: 200, job_length: 1.0, status: 'pending'}, // Mansfield lat/lng
      ];

      console.log("creating jobs");
      const jobs = await Promise.all(jobsToCreate.map(Jobs.createJob));
      console.log("finished creating jobs!!");

      // test the job db models
      // console.log('testing other job db models')
      // const allJobs = await Jobs.getAllJobs();
      // console.log("getAllJobs result:", allJobs);

      // const singleJob = await Jobs.getJobById(1);
      // console.log("getJobById result:", singleJob);

      // const jobToUpdate = {
      //   job_number: 'EWL-9999',
      //   client: 'EWL',
      //   location: 'Plano, TX',
      //   num_holes: 3,
      //   num_feet: 60,
      //   job_length: 0.5,
      //   status: 'pending'
      // }
      // const updateJob = await Jobs.updateJob(1, jobToUpdate);
      // console.log("updateJob result:", updateJob);


      const jobsToAssign = [
        {job_id: 1, rig_id: 1, job_date: '2025-06-19'},
        {job_id: 2, rig_id: 1, job_date: '2025-06-19'},
        {job_id: 2, rig_id: 2, job_date: '2025-06-19'}
      ]

      console.log("creating job assignments");
      const jobAssignments = await Promise.all(jobsToAssign.map(JobRigs.createJobAssignment));
      console.log("finished creating jobs assignments!!");



      // console.log('testing other job_rig models');

      // const allJobsAndAssignments = await JobRigs.getAllJobsAndAssignments();
      // console.log("getAllJobsAndAssignments result:", allJobsAndAssignments);

      // const allAssignedJobs = await JobRigs.getAssignedJobs();
      // console.log("getAssignedJobs result:", allAssignedJobs);
      
      // const singleAssignedJob = await JobRigs.getAssignedJobById(1,1);
      // console.log("getAssignedJobById result:", singleAssignedJob);

      // const updatedAssignment = await JobRigs.updateJobAssignment({job_id: 1, rig_id: 1, job_date: '2024-07-18'});
      // console.log("updateJobAssignment result:", updatedAssignment);

      // const deletedAssignment = await JobRigs.deleteJobAssignment({job_id: 1, rig_id: 1, job_date: '2024-07-18'});
      // console.log("getAssignedJobById result:", deletedAssignment);

}

buildTables()
  .then(populateInitialData)
  .then(async () => {
    await pool.end();      // Close the MySQL connection pool
    process.exit(0);       // Exit the Node process
  })
  .catch(async (err) => {
    console.error(err);
    await pool.end();      // Ensure pool is closed on error
    process.exit(1);       // Exit with error code
  });