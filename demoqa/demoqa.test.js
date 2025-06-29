const axios = require('axios');

const API = 'https://demoqa.com/Account/v1';

async function createUser(user) {
  return axios.post(`${API}/User`, user);
}

async function generateToken(user) {
  return axios.post(`${API}/GenerateToken`, user);
}

async function getUser(uuid, token) {
  return axios.get(`${API}/User/${uuid}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

async function deleteUser(uuid, token) {
  return axios.delete(`${API}/User/${uuid}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

describe('DemoQA API Testing', () => {
  const userInfo = {
    userName: `user_${Date.now()}`,
    password: 'Str0ngP@ssword'
  };

  let token = '';
  let userId = '';

  test('Create user — positive case', async () => {
    const res = await createUser(userInfo);
    expect(res.status).toBe(201);
    userId = res.data.userID;
  });

  test('Create user — negative case (empty password)', async () => {
    await expect(createUser({ userName: 'abc', password: '' })).rejects.toThrow();
  });

  test('Generate token — positive case', async () => {
    const res = await generateToken(userInfo);
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
    token = res.data.token;
  });

  test('Generate token — negative case (incorrect password)', async () => {
    const wrongData = { userName: userInfo.userName, password: 'wrong123' };
    const res = await generateToken(wrongData);
    expect(res.status).toBe(200);
    expect(res.data.token).toBeNull();
  });

  test('Get user data — positive case', async () => {
    const res = await getUser(userId, token);
    expect(res.status).toBe(200);
    expect(res.data.userId).toBe(userId);
  });

  test('Get user data — negative case (invalid UUID)', async () => {
    await expect(getUser('00000000-0000-0000-0000-000000000000', 'badtoken')).rejects.toThrow();
  });

  test('Delete user — positive case', async () => {
    const res = await deleteUser(userId, token);
    expect(res.status).toBe(204);
  });

  test('Delete user — negative case (non-existent ID)', async () => {
    const res = await deleteUser('00000000-0000-0000-0000-000000000000', token);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('code', '1207');
    expect(res.data).toHaveProperty('message');
  });
});
