export interface User {
  userId: number
  nickname: string
  email: string
  profileImage: string
}
export interface UserDetail extends User {
  followerCount: number
  followingCount: number
  followed: boolean
  userContributions: UserContribution[]
}

export interface UserContribution {
  date: string
  count: number
}
