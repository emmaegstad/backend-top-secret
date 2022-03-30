const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Secret = require('../lib/models/Secret');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

describe('backend-top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a secret', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    const { email, password } = mockUser;
    await agent.post('/api/v1/users/sessions').send({ email, password });

    const expected = {
      title: 'Minnie',
      description: 'is so cute',
    };
    const res = await agent.post('/api/v1/secrets').send(expected);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      createdAt: expect.any(String),
    });
  });

  it('should get all secrets if a user is signed in', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    const { email, password } = mockUser;
    await agent.post('/api/v1/users/sessions').send({ email, password });

    const expected = [
      {
        title: 'This is a secret!',
        description: '( (  )',
        createdAt: expect.any(String),
      },
    ];
    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual(expected);
  });
});
