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
  return instance.get('/auth/duplicated', {
    params: {
      nickname: nickname,
    },
  })
}
const checkDuplicatedEmail = (email: string) => {
  return instance.get('/auth/duplicated', {
    params: {
      email: email,
    },
  })
}
const checkPassword = (password: string) => {
  return instance.post('/auth/valid', { password })
}
const checkToken = () => {
  return instance.get('/auth').then(({ data }) => {
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
const getPostList = (userId: number) => {
  return instance.get(`/posts?userId=${userId}`).then(({ data }) => {
    return data.data.map((post: Post) => {
      return post
    }) as Post[]
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
const updatePost = (postId: number) => {}
const searchPost = (keyword: string) => {
  return instance.get(`/posts/search?keyword=${keyword}`).then(({ data }) => {
    return data.data.map((post: Post) => {
      return post
    }) as Post[]
  })
}
const checkDuplicatedTitle = (title: string) => {
  return instance.get(`/posts/duplicated?title=${title}`).then(({ data }) => {
    return data.data as boolean
  })
}

const like = (postId: number, target: boolean) => {
  if (target) {
    return instance.post(`/likes/${postId}`)
  } else {
    return instance.delete(`/likes/${postId}`)
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
const deleteComment = (commentId: number) => {
  return instance.delete(`/comments?commentId=${commentId}`)
}
const updateComment = (commentId: number, content: string) => {
  return instance.put(`/comments?commentId=${commentId}`, { content })
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
