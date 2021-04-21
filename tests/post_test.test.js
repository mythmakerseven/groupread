const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')
const { exampleUser } = require('./test_helper')

const api = supertest(app)

let token
beforeAll(async () => {
  await db.sync({ force: true })

  const res = await api
    .post('/api/users')
    .send(exampleUser)

  // This works really strangely - instead of the normal request.data
  // it recieves the user info in a string called request.text
  // Maybe Jest is sending special headers for some reason that interfere
  // with normal functionality?
  const user = JSON.parse(res.text)
  token = user.token
})

describe('creating a parent post', () => {
  test('is successful with valid parameters', () => {
    // TODO
  })
})

describe('creating a reply', () => {
  // TODO
})

describe('editing a post', () => {
  // TODO
})

afterAll(async () => {
  await db.close()
})