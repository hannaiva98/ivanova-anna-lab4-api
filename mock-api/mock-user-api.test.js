const axios = require('axios');
const nock = require('nock');

const API = 'https://api.example.com';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  phone: '+1-555-123-4567',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipcode: '10001',
    country: 'USA'
  },
  company: {
    name: 'Doe Enterprises',
    industry: 'Technology',
    position: 'Software Engineer'
  },
  dob: '1990-05-15',
  profile_picture_url: 'https://example.com/images/johndoe.jpg',
  is_active: true,
  created_at: '2023-01-01T12:00:00Z',
  updated_at: '2023-10-01T12:00:00Z',
  preferences: {
    language: 'en',
    timezone: 'America/New_York',
    notifications_enabled: true
  }
};

describe('Проверка моков API /users/:id', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('Успешный ответ: структура пользователя', async () => {
    nock(API).get('/users/1').reply(200, mockUser);

    const res = await axios.get(`${API}/users/1`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('email');
    expect(typeof res.data.address.city).toBe('string');
    expect(res.data.is_active).toBe(true);
  });

  const errorCases = [
    [403, { error: 'Forbidden', details: 'Access denied' }],
    [404, { error: 'Not Found', details: 'User not found' }],
    [502, { error: 'Bad Gateway', details: 'Upstream error' }]
  ];

  test.each(errorCases)(
    'Ошибка %i: проверка структуры сообщения',
    async (status, body) => {
      nock(API).get('/users/999').reply(status, body);

      try {
        await axios.get(`${API}/users/999`);
      } catch (err) {
        expect(err.response.status).toBe(status);
        expect(err.response.data).toHaveProperty('error');
        expect(err.response.data).toHaveProperty('details');
      }
    }
  );
});
