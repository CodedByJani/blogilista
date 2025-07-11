const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = 'mongodb+srv://piirainenjani:blogilista@blogilista.bdfkpdc.mongodb.net/?retryWrites=true&w=majority&appName=Blogilista'
mongoose.connect(mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app