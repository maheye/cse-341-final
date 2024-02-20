const swaggerAutogen = require('swagger-autogen')();

const doc ={
    info: {
        title: 'CSE 341 Final Project ',
        description: 'Users Api',
        version: '1.0.0'
    },
    
    host: "localhost:3000",
    schemes:['https'],
    path: {

    }

};
const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/index.js',
    './routes/users.js', 
    './routes/events.js', 
    './routes/plans.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);