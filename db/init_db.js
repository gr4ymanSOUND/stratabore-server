const {
    client,
    Users,
    Jobs,
    Rigs
    // declare your model imports here
    // for example, User
} = require('./');


async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order (reverse of creation, delete depending tables first)

      await client.query(`
      DROP TABLE IF EXISTS jobs;
      DROP TABLE IF EXISTS rigs;
      DROP TABLE IF EXISTS users;
      `)

    // build tables in correct order

    await client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          "firstName" VARCHAR(255) NOT NULL,
          "lastName" VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL, 
          "userName" VARCHAR(255) UNIQUE NOT NULL, 
          password VARCHAR(255) UNIQUE NOT NULL,
          "isAdmin" BOOLEAN DEFAULT false,
          status VARCHAR(255) NOT NULL
        );
    
      CREATE TABLE rigs (
          id SERIAL PRIMARY KEY,
          "licensePlate" VARCHAR(255) NOT NULL,
          "rigType" VARCHAR(255) NOT NULL,
          "boardColor" VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL
      );
        
      CREATE TABLE jobs (
          id SERIAL PRIMARY KEY,
          "jobNumber" VARCHAR(255) NOT NULL,
          client VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          "numHoles" INTEGER NOT NULL DEFAULT 1,
          "numFeet" INTEGER NOT NULL DEFAULT 20,
          "jobDate" VARCHAR(255) NOT NULL,
          "rigId" INTEGER REFERENCES rigs(id),
          status VARCHAR(255) NOT NULL
      );

      
  `)
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {

    const usersToCreate =   [
        {firstName:'Tommy', lastName:'Lawrence', email:'tommy@stratabore.com', userName:'bossman', password:'bossmanistheboss', isAdmin: true , status: 'active'},
        {firstName:'Austin', lastName:'Lawrence', email:'austin.lawrence.al@gmail.com', userName:'coolhatguy', password:'ochocinco', isAdmin: true, status: 'active'},
        {firstName:'Meghan', lastName:'Lawrence', email:'test@email.email', userName:'meguhman', password:'dotterbore', isAdmin: false, status: 'active'}
      ];
 
      console.log("creating users");
      const users = await Promise.all(usersToCreate.map(Users.createUser));
      console.log(users);
      console.log("finished creating users!!");

      const rigsToCreate = [
        {licensePlate: 'SSS-5555', rigType: 'big', boardColor: 'red', status: 'active'},
        {licensePlate: 'TTT-5555', rigType: 'lil', boardColor: 'green', status: 'active'},
        {licensePlate: 'RRR-5555', rigType: 'mid', boardColor: 'blue', status: 'active'},
        {licensePlate: 'AAA-5555', rigType: 'lil', boardColor: 'orange', status: 'active'},
        {licensePlate: 'TTT-6666', rigType: 'big', boardColor: 'purple', status: 'active'},
        {licensePlate: 'AAA-6666', rigType: 'big', boardColor: 'yellow', status: 'active'},
      ]

      console.log("creating rigs");
      const rigs = await Promise.all(rigsToCreate.map(Rigs.createRig)); 
      console.log(rigs);
      console.log("finished creating rigs!!");

      const jobsToCreate = [
        {jobNumber: 'EWL-227', client: 'EWL', location: 'Plano, TX', numHoles: 3, numFeet: 60, jobDate: '2023-04-02', rigId: 3, status: 'pending'},
        {jobNumber: 'TER-321', client: 'TER', location: 'Sachse, TX', numHoles: 1, numFeet: 20, jobDate: '2023-04-05', rigId: 2, status: 'pending'},
        {jobNumber: 'AAA-111', client: 'AAA', location: 'Parker, TX', numHoles: 5, numFeet: 1000, jobDate: '2023-04-04', rigId: 1, status: 'pending'},
        {jobNumber: 'ZZZ-2626', client: 'ZZZ', location: 'Sea of Tranquility, Moon', numHoles: 3, numFeet: 120, jobDate: '2023-01-01', rigId: 4, status: 'pending'},
        {jobNumber: 'ZZZ-2627', client: 'ZZZ', location: 'Istanbul, Turkey', numHoles: 2, numFeet: 100, jobDate: '2023-04-02', rigId: 4, status: 'pending'},
        {jobNumber: 'ZZZ-2628', client: 'ZZZ', location: 'Berlin, Germany', numHoles: 4, numFeet: 80, jobDate: '2023-04-02', rigId: 5, status: 'pending'},
        {jobNumber: 'ZZZ-2629', client: 'ZZZ', location: 'Vancouver, Canada', numHoles: 4, numFeet: 80, jobDate: '2023-04-04', rigId: 4, status: 'complete'},
        {jobNumber: 'ZZZ-2630', client: 'ZZZ', location: 'Vancouver, Washington', numHoles: 3, numFeet: 60, jobDate: '2023-04-04', rigId: 3, status: 'pending'},
        {jobNumber: 'EWL-26', client: 'EWL', location: 'NY, NY', numHoles: 5, numFeet: 200, jobDate: '2023-04-05', rigId: 4, status: 'pending'},
        {jobNumber: 'EWL-2', client: 'EWL', location: 'Boston, MA', numHoles: 2, numFeet: 30, jobDate: '2023-04-03', rigId: 6, status: 'pending'},
        {jobNumber: 'ZZZ-6', client: 'ZZZ', location: 'Sacramento, CA', numHoles: 2, numFeet: 40, jobDate: '2023-04-03', rigId: 4, status: 'canceled'},
        {jobNumber: 'EWL-666', client: 'EWL', location: 'Chicago, IL', numHoles: 1, numFeet: 20, jobDate: '2023-01-01', rigId: 5, status: 'canceled'},
        {jobNumber: 'AAA-123', client: 'AAA', location: 'Ft. Worth, TX', numHoles: 3, numFeet: 60, jobDate: '2023-01-01', rigId: 4, status: 'pending'},
        {jobNumber: 'AAA-456', client: 'AAA', location: 'Dallas, TX', numHoles: 5, numFeet: 100, jobDate: '2023-01-01', rigId: 1, status: 'pending'},
        {jobNumber: 'AAA-100', client: 'AAA', location: 'Nowhere, KS', numHoles: 2, numFeet: 50, jobDate: '2023-01-01', rigId: 4, status: 'pending'},
        {jobNumber: 'AAA-200', client: 'AAA', location: 'St. Louis, MO', numHoles: 2, numFeet: 50, jobDate: '2023-01-01', rigId: 2, status: 'pending'},
        {jobNumber: 'AAA-300', client: 'AAA', location: 'Honolulu, Hawaii', numHoles: 2, numFeet: 50, jobDate: '2023-01-01', rigId: 4, status: 'pending'},
        {jobNumber: 'TER-7400', client: 'TER', location: 'Deep Space', numHoles: 2, numFeet: 50, jobDate: '2023-01-01', rigId: 6, status: 'pending'},
      ];

      console.log("creating jobs");
      const jobs = await Promise.all(jobsToCreate.map(Jobs.createJob));
      console.log(jobs);
      console.log("finished creating jobs!!");

}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());