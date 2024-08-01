import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://goodong-api-twtv7iqgaa-de.a.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
})

const login = (username: string, password: string) => {
  return instance.post('/login', { username, password }).then(response => {
    console.log(response.headers['authorization'])
    const token = response.headers['authorization'] ?? ''
    if (token) instance.defaults.headers['authorization'] = token
    return token
  })
}

const checkToken = (token: string) => {
  return instance.get('/auth/expired', { headers: { Authorization: token } })
}

const signup = (username: string, password: string) => {
  return instance.post('/register', { username, password })
}

const getPostByUserId = (userId: string) => {
  return instance.get('/repository/showpost', {
    params: {
      username: userId,
    },
  })
}

const getPost = (postId: string) => {
  return instance.get('/repository/showpostByPostId', {
    params: {
      postId: postId,
    },
  })
}
const createPost = (formData: FormData) => {
  return instance.post('/repository/savepost', formData, {
    headers: {
      Authorization: localStorage.getItem('jwtToken'),
      'Content-Type': 'multipart/form-data',
    },
  })
}
const downloadGLB = (postId: string) => {
  return instance.get(`/repository/download/${postId}`, {
    responseType: 'blob',
  })
}

const searchPost = (keyword: string) => {
  return instance.get('/repository/searchPosts', {
    params: {
      keyword: keyword,
    },
  })
}

const api = Object.freeze({
  login,
  checkToken,
  signup,
  getPostByUserId,
  getPost,
  createPost,
  downloadGLB,
  searchPost,
})

export default api
