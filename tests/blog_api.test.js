const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Testiblogi 1',
    author: 'Kirjoittaja 1',
    url: 'http://esimerkki1.com',
    likes: 3,
  },
  {
    title: 'Testiblogi 2',
    author: 'Kirjoittaja 2',
    url: 'http://esimerkki2.com',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
}, 20000)

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialBlogs.length)
}, 20000)

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  expect(blog.id).toBeDefined()
}, 20000)

afterAll(async () => {
  await mongoose.connection.close()
})
