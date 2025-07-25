const bcrypt = require('bcryptjs')
const User = require('../models/user')

const getUsers = async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
}

const createUser = async (request, response) => {
  const { username, name, password } = request.body

  // tarkista että kentät ovat olemassa ja tarpeeksi pitkiä
  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  // tarkista onko käyttäjätunnus jo olemassa
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
}

module.exports = {
  getUsers,
  createUser,
}
