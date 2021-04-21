const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')
const { exampleUser, usersInDb } = require('./test_helper')

const api = supertest(app)

beforeAll(async () => {
  // the "force" parameter clears the database
  await db.sync({ force: true })
})

describe('user accounts', () => {
  test('are successfully created with valid parameters', async () => {
    await api
      .post('/api/users')
      .send(exampleUser)
      .expect(200)

    const users = await usersInDb()
    const testUser = users.find(u => u.username === exampleUser.username)
    expect(testUser.email).toEqual(exampleUser.email)
  })

  test('are created with hashed passwords', async () => {
    const newUser = { ...exampleUser, username: 'newuser' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const users = await usersInDb()
    const testUser = users.filter(u => u.username === newUser.username)
    expect(testUser.passwordHash).not.toEqual(exampleUser.password)
    expect(testUser.password).toBeUndefined()
  })
})

afterAll(async () => {
  await db.close()
})