const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

const blogsRouter = require('./controllers/blogs')
const app = express()

const mongoUrl = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
