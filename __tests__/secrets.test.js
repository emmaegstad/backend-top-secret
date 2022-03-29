const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Secret = require('../lib/models/Secret');

describe('backend-top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a secret', async () => {
    const expected = {
      title: 'Minnie',
      description: 'is so cute',
    };
    const res = await request(app).post('/api/v1/secrets').send(expected);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      createdAt: expect.any(String),
    });
  });

  it('should get all secrets', async () => {
    const expected = await Secret.findAll();
    const res = await request(app).get('/api/v1/secrets');

    expect(res.body).toEqual(expected);
  });
});
