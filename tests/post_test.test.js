const supertest = require('supertest')
const { getPool } = require('../utils/db')
const db = getPool()
const app = require('../app')
const { exampleUser, exampleGroup, exampleParentPost, exampleReply, searchPosts } = require('./test_helper')

const api = supertest(app)


// TODO: split off authentication into a test_helper function
let token
let groupId
const badToken = 'when_the_token_is_sus!!!'
beforeAll(async () => {
  await db.sync({ force: true })

  const userResponse = await api
    .post('/api/users')
    .send(exampleUser)

  const user = JSON.parse(userResponse.text)
  token = user.token

  // Create a group
  const groupResponse = await api
    .post('/api/groups')
    .auth(token, { type: 'bearer' })
    .send(exampleGroup)

  groupId = groupResponse.body.id
})

describe('creating a parent post', () => {
  test('is successful with valid parameters', async () => {
    await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(200)
  })

  test('fails with missing token', async () => {
    await api
      .post(`/api/posts/${groupId}`)
      .send(exampleParentPost)
      .expect(401)
  })

  test('fails with empty title', async () => {
    const malformedParentPost = {
      text: exampleParentPost.text
    }
    await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(malformedParentPost)
      .expect(400)
  })

  test('fails with empty text', async () => {
    const malformedParentPost = {
      title: exampleParentPost.title
    }

    await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(malformedParentPost)
      .expect(400)
  })

  test('fails with invalid token', async () => {
    await api
      .post(`/api/posts/${groupId}`)
      .auth(badToken, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(400)
  })

  test('fails when user is not in group', async () => {
    // Make a new user because the exampleUser joined this group already
    const res = await api
      .post('/api/users')
      .send({ ...exampleUser, username: 'anotherone' })
      .expect(200)

    const newUser = JSON.parse(res.text)
    const newUserToken = newUser.token

    await api
      .post(`/api/posts/${groupId}`)
      .auth(newUserToken, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(401)
  })
})

// Since parent/reply uses the same function in controllers.posts.js,
// we can skip over the checks that have already been covered
// such as 'fails with missing token', etc.
describe('creating a reply', () => {
  let parentId
  beforeAll(async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)

    parentId = res.body.id
  })

  test('is successful with valid parameters', async () => {
    await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleReply(parentId))
      .expect(200)
  })

  test('fails with missing parent', async () => {
    const replyWithoutParent = {
      'text': 'test string'
    }

    await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(replyWithoutParent)
      .expect(400)
  })
})

describe('editing a post', () => {
  let postID
  beforeAll(async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)

    postID = res.body.id
  })

  test('works with valid parameters', async () => {
    await api
      .put(`/api/posts/edit/${postID}`)
      .auth(token, { type: 'bearer' })
      .send({ text: 'this post is now edited' })
      .expect(200)

    const post = await searchPosts(postID)
    expect(post.text).toBe('this post is now edited')
  })

  test('doesn\'t work when the user tries to edit someone else\'s post', async () => {
    // Create second user to test
    const res = await api
      .post('/api/users')
      .send({ ...exampleUser, username: 'one_more' })
      .expect(200)

    const newUserToken = res.body.token

    await api
      .put(`/api/posts/edit/${postID}`)
      .auth(newUserToken, { type: 'bearer' })
      .send({ text: 'this is an unauthorized edit' })
      .expect(401)

    const post = await searchPosts(postID)
    expect(post.text).not.toBe('this is an unauthorized edit')
  })

  test('doesn\'t work without a valid token', async () => {
    await api
      .put(`/api/posts/edit/${postID}`)
      .auth(badToken, { type: 'bearer' })
      .send({ text: 'time for another edit!' })
      .expect(400)
  })

  test('doesn\'t work with a missing token', async () => {
    await api
      .put(`/api/posts/edit/${postID}`)
      .send({ text: 'time for another edit!' })
      .expect(401)
  })

  test('doesn\'t work when the post doesn\'t already exist', async () => {
    await api
      .put('/api/posts/edit/fakeidisfakehahaha')
      .auth(token, { type: 'bearer' })
      .send({ text: 'this one shouldn\'t work!' })
      .expect(400)
  })

  test('doesn\'t accept an empty text field', async () => {
    await api
      .put(`/api/posts/edit/${postID}`)
      .auth(token, { type: 'bearer' })
      .send({ text: '' })
      .expect(400)
  })
})

afterAll(async () => {
  await db.close()
})