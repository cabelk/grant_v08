const request = require('supertest');
const app = require('../app');

describe('GET /api/score', () => {
  it('returns score JSON with appScore and lomScore', async () => {
    const res = await request(app).get('/api/score').expect(200);
    expect(res.body).toHaveProperty('appScore');
    expect(res.body).toHaveProperty('lomScore');
    expect(Array.isArray(res.body.details)).toBe(true);
  });
});
