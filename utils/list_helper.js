const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]

  for (const blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Lasketaan montako blogia kukin kirjoittaja on tehnyt
  const counts = {}

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  // Etsitään kirjoittaja, jolla eniten blogeja
  let maxAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = counts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesCount = {}

  for (const blog of blogs) {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + (blog.likes || 0)
  }

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxAuthor = author
      maxLikes = likesCount[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}

