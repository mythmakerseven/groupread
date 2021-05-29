import supertest from 'supertest'
import getPool from '../utils/db'
const db = getPool()
import app from '../app'
import { exampleUser, usersInDb, searchUsers, getRandomString } from './test_helper'

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
    expect(testUser?.email).toEqual(exampleUser.email)
  })

  test('cannot be created with missing username', async () => {
    const malformedUser = {
      password: exampleUser.password,
      email: exampleUser.email
    }
    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with missing password', async () => {
    const malformedUser = {
      username: getRandomString(),
      email: exampleUser.email
    }
    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with password of fewer than 8 characters', async () => {
    const malformedUser = {
      username: getRandomString(),
      password: 'short',
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with username of fewer than 3 characters', async () => {
    const malformedUser = {
      username: 'm',
      password: exampleUser.password,
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with username of more than 32 characters', async () => {
    const malformedUser = {
      username: 'thisiswaytoolongandhasalotofcharacters',
      password: exampleUser.password,
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with displayName of more than 32 characters', async () => {
    const malformedUser = {
      username: getRandomString(),
      displayName: 'thisiswaytoolongandhasalotofcharacters',
      password: exampleUser.password,
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with displayName of fewer than 3 characters', async () => {
    const malformedUser = {
      username: getRandomString(),
      displayName: 'no',
      password: exampleUser.password,
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created with email of more than 64 characters', async () => {
    const malformedUser = {
      username: getRandomString(),
      displayName: 'thisiswaytoolongandhasalotofcharactersllllllllllllllllllllllllllllllll',
      password: exampleUser.password,
      email: exampleUser.email
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('cannot be created without an email', async () => {
    const malformedUser = {
      username: getRandomString(),
      displayName: exampleUser.displayName,
      password: exampleUser.password,
    }

    await api
      .post('/api/users')
      .send(malformedUser)
      .expect(400)
  })

  test('recieve a displayName when created without one', async () => {
    const newUserName = `${exampleUser.username}2`
    const newUser = {
      username: newUserName,
      password: exampleUser.password,
      email: exampleUser.email
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const returnedUser = await searchUsers(res.body.id)
    expect(returnedUser.displayName).toBe(newUserName)
  })

  test('are created with hashed passwords', async () => {
    const newUser = { ...exampleUser, username: 'newuser' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const users = await usersInDb()
    const testUser = users.find(u => u.username === newUser.username)
    expect(testUser?.passwordHash).not.toBeUndefined
    expect(testUser?.passwordHash).not.toEqual(exampleUser.password)
    expect(testUser).not.toHaveProperty('password')
  })
})

afterAll(async () => {
  await db.close()
})