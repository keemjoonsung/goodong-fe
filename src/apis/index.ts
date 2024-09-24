import axios from 'axios'
import { User, UserDetail } from '../types/user'
import { Post, PostDetail } from '../types/post'

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string

const instance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAPIToken = (token: string) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const login = (email: string, password: string) => {
  return instance.post('/auth/login', { email, password }).then(({ data }) => {
    console.log(data)
    const token = data.data
    return token
  })
}
const signup = (email: string, password: string, nickname: string) => {
  return instance.post('/auth/register', { email, password, nickname })
}
const checkDuplicatedNickname = (nickname: string) => {
  return instance.get('/auth/register/check-nickname', {
    params: {
      nickname: nickname,
    },
  })
}
const checkDuplicatedEmail = (email: string) => {
  return instance.get('/auth/register/check-email', {
    params: {
      email: email,
    },
  })
}
const checkPassword = (password: string) => {
  return instance.post('/auth/register/check-password', { password })
}
const checkToken = () => {
  return instance.get('/auth/user-info').then(({ data }) => {
    const user = data.data
    return {
      userId: user.userId as number,
      email: user.email as string,
      nickname: user.nickname as string,
      profileImage: user.profileImage as string,
    }
  })
}
const changePassword = (userId: number, password: string) => {
  return instance.put(`/auth/password?userId=${userId}`, { password })
}

// post
const getPostList = (userId: number, page = 0) => {
  return instance
    .get(`/posts?userId=${userId}&page=${page}`)
    .then(({ data }) => {
      return {
        content: data.data.content as Post[],
        totalElements: data.data.totalElements as number,
        totalPages: data.data.totalPages as number,
        currentPage: data.data.number as number,
      }
    })
}
const addPost = (formData: FormData) => {
  return instance.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
const getPostDetail = (postId: number) => {
  return instance.get(`/posts/${postId}`).then(({ data }) => {
    return data.data as PostDetail
  })
}
const deletePost = (postId: number) => {
  return instance.delete(`/posts/${postId}`)
}
const updatePost = (postId: number, formData: FormData) => {
  return instance.patch(`/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
const searchPost = (keyword: string, page = 0) => {
  return instance
    .get(`/posts?query=${keyword}&page=${page}`)
    .then(({ data }) => {
      return {
        content: data.data.content as Post[],
        totalElements: data.data.totalElements as number,
        totalPages: data.data.totalPages as number,
        currentPage: data.data.number as number,
      }
    })
}
const checkDuplicatedTitle = (title: string) => {
  return instance.get(`/posts/check-title?title=${title}`).then(({ data }) => {
    return data.data as boolean
  })
}
const downloadGLB = (fileName: string) => {
  return instance
    .get(`/models?modelName=${fileName}`, {
      responseType: 'blob',
    })
    .then(({ data }) => data)
}
const generateDescription = (formData: FormData) => {
  return instance
    .post('/ai', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(({ data }) => {
      return data.data as {
        title: string
        description: string
        tags: string[]
      }
    })
}

const like = (postId: number, target: boolean) => {
  if (target) {
    return instance.post(`/likes?postId=${postId}`)
  } else {
    return instance.delete(`/likes?postId=${postId}`)
  }
}

const getFollowingList = (userId: number) => {
  return instance
    .get(`/follows?userId=${userId}&type=FOLLOWING`)
    .then(({ data }) => {
      return data.data.map((user: User) => {
        return user as User
      })
    })
}
const getFollowerList = (userId: number) => {
  return instance
    .get(`/follows?userId=${userId}&type=FOLLOWER`)
    .then(({ data }) => {
      return data.data.map((user: User) => {
        return user as User
      })
    })
}
const follow = (userId: number, target: boolean) => {
  if (target) {
    return instance.post(`/follows?userId=${userId}`)
  } else {
    return instance.delete(`/follows?userId=${userId}`)
  }
}

const addComment = (postId: number, content: string) => {
  return instance.post(`/comments?postId=${postId}`, { content })
}
const deleteComment = (postId: number, commentId: number) => {
  return instance.delete(`/comments?postId=${postId}&commentId=${commentId}`)
}
const updateComment = (postId: number, commentId: number, content: string) => {
  return instance.patch(`/comments?postId=${postId}&commentId=${commentId}`, {
    content,
  })
}

const getUser = (userId: number) => {
  return instance.get(`/users/${userId}`).then(({ data }) => {
    return data.data as UserDetail
  })
}
const deleteUser = (userId: number) => {
  return instance.delete(`/users/${userId}`)
}
const updateUser = (
  userId: number,
  nickname: string,
  profileImageUrl: string,
) => {
  return instance.patch(`/users/${userId}`, {
    nickname: nickname,
    profileImageUrl: profileImageUrl,
  })
}

const api = Object.freeze({
  auth: {
    login,
    signup,
    checkDuplicatedNickname,
    checkDuplicatedEmail,
    checkPassword,
    checkToken,
    changePassword,
  },
  post: {
    getPostList,
    getPostDetail,
    addPost,
    deletePost,
    updatePost,
    checkDuplicatedTitle,
    searchPost,
    downloadGLB,
    generateDescription,
  },
  like: {
    like,
  },
  follow: {
    getFollowingList,
    getFollowerList,
    follow,
  },
  comment: {
    addComment,
    deleteComment,
    updateComment,
  },
  user: {
    getUser,
    deleteUser,
    updateUser,
  },
})

export default api
