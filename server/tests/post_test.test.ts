import supertest from 'supertest'
import getPool from '../utils/db'
const db = getPool()
import app from '../app'
import { exampleUser, exampleGroup, exampleParentPost, exampleReply, searchPosts } from './test_helper'

const api = supertest(app)

let token: string
let groupId: string
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
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(200)

    expect(res.text).toContain(exampleParentPost.text)
  })

  test('fails with missing token', async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .send(exampleParentPost)
      .expect(400)

    expect(res.text).toContain('Missing token')
  })

  test('fails with empty title', async () => {
    const malformedParentPost = {
      text: exampleParentPost.text
    }

    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(malformedParentPost)
      .expect(400)

    expect(res.text).toContain('parent posts require a title')
  })

  test('fails with empty text', async () => {
    const malformedParentPost = {
      title: exampleParentPost.title
    }

    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(malformedParentPost)
      .expect(400)

    expect(res.text).toContain('Posts cannot be empty')
  })

  test('fails with invalid token', async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(badToken, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(400)

    expect(res.text).toContain('Invalid token')
  })

  test('fails when user is not in group', async () => {
    // Make a new user because the exampleUser joined this group already
    const userRes = await api
      .post('/api/users')
      .send({ ...exampleUser, username: 'anotherone' })
      .expect(200)

    const newUser = JSON.parse(userRes.text)
    const newUserToken = newUser.token

    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(newUserToken, { type: 'bearer' })
      .send(exampleParentPost)
      .expect(401)

    expect(res.text).toContain('you are not a member of this group')
  })
})

// Since parent/reply uses the same function in controllers.posts.js,
// we can skip over the checks that have already been covered
// such as 'fails with missing token', etc.
describe('creating a reply', () => {
  let parentId: string
  beforeAll(async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)

    parentId = res.body.id
  })

  test('is successful with valid parameters', async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleReply(parentId))
      .expect(200)

    expect(res.text).toContain('This is the text of the reply')
  })

  test('fails with incorrect parent', async () => {
    const replyWithoutParent = {
      'text': 'test string',
      'parent': 'ueohrwhuewhoiuwehoi'
    }

    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(replyWithoutParent)
      .expect(400)

    expect(res.text).toContain('parent post not found')
  })
})

describe('editing a post', () => {
  let postID: string
  beforeAll(async () => {
    const res = await api
      .post(`/api/posts/${groupId}`)
      .auth(token, { type: 'bearer' })
      .send(exampleParentPost)

    postID = res.body.id
  })

  test('works with valid parameters', async () => {
    const res = await api
      .put(`/api/posts/edit/${postID}`)
      .auth(token, { type: 'bearer' })
      .send({ text: 'this post is now edited' })
      .expect(200)

    // check server response
    expect(res.text).toContain('this post is now edited')

    // check in DB
    const post = await searchPosts(postID)
    expect(post.text).toBe('this post is now edited')
  })

  test('doesn\'t work when the user tries to edit someone else\'s post', async () => {
    // Create second user to test
    const userRes = await api
      .post('/api/users')
      .send({ ...exampleUser, username: 'one_more' })
      .expect(200)

    const newUserToken = userRes.body.token

    const res = await api
      .put(`/api/posts/edit/${postID}`)
      .auth(newUserToken, { type: 'bearer' })
      .send({ text: 'this is an unauthorized edit' })
      .expect(401)

    expect(res.text).toContain('you do not have permission to edit this post')

    const post = await searchPosts(postID)
    expect(post.text).not.toBe('this is an unauthorized edit')
  })

  test('doesn\'t work with invalid token', async () => {
    const res = await api
      .put(`/api/posts/edit/${postID}`)
      .auth(badToken, { type: 'bearer' })
      .send({ text: 'time for another edit!' })
      .expect(400)

    expect(res.text).toContain('Invalid token')
  })

  test('doesn\'t work with a missing token', async () => {
    const res = await api
      .put(`/api/posts/edit/${postID}`)
      .send({ text: 'time for another edit!' })
      .expect(400)

    expect(res.text).toContain('Missing token')
  })

  test('doesn\'t work when the post doesn\'t already exist', async () => {
    const res = await api
      .put('/api/posts/edit/fakeidisfakehahaha')
      .auth(token, { type: 'bearer' })
      .send({ text: 'this one shouldn\'t work!' })
      .expect(400)

    expect(res.text).toContain('post does not exist')
  })

  test('doesn\'t accept an empty text field', async () => {
    const res = await api
      .put(`/api/posts/edit/${postID}`)
      .auth(token, { type: 'bearer' })
      .send({ text: '' })
      .expect(400)

    expect(res.text).toContain('Post content cannot be empty')
  })
})

afterAll(async () => {
  await db.close()
})