const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')
const helper = require('./test_helper')

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

const exampleGroup = {
  'bookTitle': 'Gravity\'s Rainbow',
  'bookAuthor': 'Thomas Pynchon',
  'bookYear': '1973',
  'bookIsbn': '0143039946'
}

describe('creating a group', () => {
  test('is successful with valid parameters', async () => {
    await api
      .post('/api/groups')
      .send(exampleGroup)
      .expect(200)

    await api
      .get('/api/groups/all')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const groups = await helper.groupsInDb()
    const titles = groups.map(g => g.bookTitle)
    expect(titles).toContain('Gravity\'s Rainbow')
  })

  test('fails when title is missing', async () => {
    const malformedGroup = {
      'bookAuthor': 'Thomas Pynchon',
      'bookYear': '1973',
      'bookIsbn': '0143039946'
    }

    await api
      .post('/api/groups')
      .send(malformedGroup)
      .expect(400)
  })

  test('fails with invalid ISBN length', async () => {
    const malformedGroup = {
      'bookTitle': 'Gravity\'s Rainbow',
      'bookAuthor': 'Thomas Pynchon',
      'bookYear': '1973',
      'bookIsbn': '97463657483927865628379'
    }

    await api
      .post('/api/groups')
      .send(malformedGroup)
      .expect(400)
  })

  test('fails with non-numerical ISBN', async () => {
    const malformedGroup = {
      'bookTitle': 'Gravity\'s Rainbow',
      'bookAuthor': 'Thomas Pynchon',
      'bookYear': '1973',
      'bookIsbn': '0143ABCD46'
    }

    await api
      .post('/api/groups')
      .send(malformedGroup)
      .expect(400)
  })

  test('fails with invalid year', async () => {
    const malformedGroup = {
      'bookTitle': 'Gravity\'s Rainbow',
      'bookAuthor': 'Thomas Pynchon',
      'bookYear': '19733',
      'bookIsbn': '0143039946'
    }

    await api
      .post('/api/groups')
      .send(malformedGroup)
      .expect(400)
  })

  test('adding multiple new groups does not override any existing groups', async () => {
    await api
      .post('/api/groups')
      .send(exampleGroup)
      .expect(200)

    await api
      .post('/api/groups')
      .send(exampleGroup)
      .expect(200)

    await api
      .post('/api/groups')
      .send(exampleGroup)
      .expect(200)

    const groups = await helper.groupsInDb()
    expect(groups).toHaveLength(4)
  })
})

afterAll(async () => {
  await db.close()
})