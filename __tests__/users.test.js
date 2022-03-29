const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { signIn } = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Minnie',
  lastName: 'Cat',
  email: 'cutiekitty4life@meow.com',
  password: 'ilovemymom',
};

describe('backend-top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    const { email, password } = mockUser;
    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    expect(res.body).toEqual({
      message: 'Signed in successfully.',
    });
  });

  it.only('returns 401 when non-existent user signs in', async () => {
    const agent = request.agent(app);
    const { email, password } = mockUser;
    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    expect(res.body).toEqual({
      message: 'Invalid email/password.',
      status: 401,
    });
  });
});
