const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeAll(async () => {
  await db.sync({ force: true })
})

const exampleUser = {
  'username': 'gruser',
  'password': 'mypassword',
  'email': 'me@mywebsite.com'
}

describe('user accounts', () => {
  test('are successfully created with valid parameters', async () => {
    await api
      .post('/api/users')
      .send(exampleUser)
      .expect(200)

    const users = await helper.usersInDb()
    const testUser = users.find(u => u.username === exampleUser.username)
    expect(testUser.email).toEqual('me@mywebsite.com')
  })

  test('are created with hashed passwords', async () => {
    const newUser = { ...exampleUser, username: 'newuser' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const users = await helper.usersInDb()
    const testUser = users.filter(u => u.username === newUser.username)
    expect(testUser.passwordHash).not.toEqual('mypassword')
    expect(testUser.password).toBeUndefined()
  })
})

afterAll(async () => {
  await db.close()
})