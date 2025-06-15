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

describe('Тестирование API DemoQA', () => {
  const userInfo = {
    userName: `user_${Date.now()}`,
    password: 'Str0ngP@ssword'
  };

  let token = '';
  let userId = '';

  test('Создание пользователя — позитивный кейс', async () => {
    const res = await createUser(userInfo);
    expect(res.status).toBe(201);
    userId = res.data.userID;
  });

  test('Создание пользователя — негативный кейс (пустой пароль)', async () => {
    await expect(createUser({ userName: 'abc', password: '' })).rejects.toThrow();
  });

  test('Генерация токена — позитивный кейс', async () => {
    const res = await generateToken(userInfo);
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
    token = res.data.token;
  });

test('Генерация токена — негативный кейс (неправильный пароль)', async () => {
  const wrongData = { userName: userInfo.userName, password: 'wrong123' };
  const res = await generateToken(wrongData);
  expect(res.status).toBe(200);
  expect(res.data.token).toBeNull();
});

  test('Получение данных пользователя — позитивный кейс', async () => {
    const res = await getUser(userId, token);
    expect(res.status).toBe(200);
    expect(res.data.userId).toBe(userId);
  });

  test('Получение данных пользователя — негативный кейс (неверный UUID)', async () => {
    await expect(getUser('00000000-0000-0000-0000-000000000000', 'badtoken')).rejects.toThrow();
  });

  test('Удаление пользователя — позитивный кейс', async () => {
    const res = await deleteUser(userId, token);
    expect(res.status).toBe(204);
  });

  test('Удаление пользователя — негативный кейс (несуществующий ID)', async () => {
    const res = await deleteUser('00000000-0000-0000-0000-000000000000', token);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('code', '1207');
    expect(res.data).toHaveProperty('message');
  });
});
