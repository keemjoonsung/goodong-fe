import { User } from './user'

export interface Post extends User {
  postId: number
  title: string
  status: string
  lastModifiedAt: string
  tags: string[]
  likes: number
}

export interface PostDetail extends Post {
  content: string
  models: Model[]
  createdAt: string
  comments: Comment[]
}

export interface Model {
  version: number
  fileName: string
  commitMessage: string
}

export interface Comment extends User {
  commentId: number
  content: string
  createdAt: string
  lastModifiedAt: string
}
