const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')

const api = supertest(app)

beforeAll(async () => {
  await db.sync({ force: true })
})

test('groups are returned as json', async () => {
  await api
    .get('/api/groups/all')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await db.close()
})