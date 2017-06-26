process.env.NODE_ENV = 'test';


//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('check landing page', () => {
   
/*
  * Test the /GET route
  */
  describe('/GET landing page', () => {
      it('should get landing page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
              
              done();
            });
      });
  });
  
   describe('/GET results page', () => {
      it('should get sample results page', (done) => {
        chai.request(server)
            .get('/sampleresults')
            .end((err, res) => {
                res.should.have.status(200);
              
              done();
            });
      });
  });

});