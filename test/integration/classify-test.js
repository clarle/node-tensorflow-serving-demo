const expect  = require('chai').expect;
const request = require('supertest');

const config = require('../../config');
const app    = require('../../app');
const image  = require('../fixtures/image');

describe('Integration test pre-check', () => {
  it('should have a configuration property with the TF Serving Host', () => {
    expect(config.TENSORFLOW_SERVING_HOST).to.not.be.empty; 
  });
});

describe('POST /classify', () => {
  it('should return the probabilities of each digit', (done) => {
    request(app)
      .post('/classify')
      .send({ image })
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        const percentages = res.body.percentages;
        if (!percentages)
          throw new Error('Missing `percentages` key in JSON response');
        if (percentages.length !== 10)
          throw new Error('Incorrect number of digit classes in JSON response');
      })
      .end(done);
  });
});
