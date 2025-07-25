const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// POST a new blog (requires valid token)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// DELETE a blog by ID
blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  console.log('DELETE request received for ID:', id)

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: 'malformatted id' })
    }

    const blog = await Blog.findByIdAndDelete(id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    response.status(204).end()
  } catch (error) {
    console.error('Error deleting blog:', error.message)
    response.status(500).json({ error: 'internal server error' })
  }
})

// PUT update blog likes
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { likes } = request.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'malformatted id' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.status(200).json(updatedBlog)
    } else {
      response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    console.error('Error updating blog:', error.message)
    response.status(500).json({ error: 'internal server error' })
  }
})

module.exports = blogsRouter
