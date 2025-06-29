# Lab Work 4: API Testing 

## Completed by: Anna Ivanova, Group 23-HO-6

---

## 🔹 Part 1: Tests for DemoQA API

- The following methods were tested:
  - `POST /Account/v1/User` — create user  
  - `POST /Account/v1/GenerateToken` — generate token  
  - `GET /Account/v1/User/{UUID}` — get user information  
  - `DELETE /Account/v1/User/{UUID}` — delete user  
- Both positive and negative test cases were implemented.  
- Libraries used: **axios**, **jest**.

---

## 🔹 Part 2: Mocks (Mock API)

- The [`nock`](https://github.com/nock/nock) library was used to create mocks.
- Implemented:
  - Successful `200` response with full user structure  
  - Error responses: `403 Forbidden`, `404 Not Found`, `502 Bad Gateway`  
- Response structure correctness is verified.

---

### Project Execution

```bash
npm install
npm test
