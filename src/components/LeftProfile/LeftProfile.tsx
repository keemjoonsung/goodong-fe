import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LeftProfile.css'
import api from '../../apis'
import { Button, Image } from 'react-bootstrap'
import { UserDetail } from '../../types/user'
import useMainStore from '../../stores'
import { Envelope, Person } from 'react-bootstrap-icons'

const LeftProfile = ({
  targetUser,
  setTargetUser,
}: {
  targetUser: UserDetail
  setTargetUser: any
}) => {
  const user = useMainStore(state => state.user)

  const navigate = useNavigate()

  const gotoEditProfile = () => {
    navigate(`/${user?.userId}/edit`)
  }
  const follow = async () => {
    await api.follow.follow(targetUser.userId, true)
    setTargetUser({
      ...targetUser,
      followed: true,
      followerCount: targetUser.followerCount + 1,
    })
  }
  const unFollow = async () => {
    await api.follow.follow(targetUser.userId, false)
    setTargetUser({
      ...targetUser,
      followed: false,
      followerCount: targetUser.followerCount - 1,
    })
  }

  return (
    <div className="repo-left">
      <div className="repo-left-item">
        <Image src={targetUser.profileImage} roundedCircle />
      </div>
      <div className="repo-left-item">
        <Person size={20} /> {targetUser.nickname}
      </div>
      <div className="repo-left-item">
        <Envelope size={20} /> {targetUser.email}
      </div>
      {targetUser.userId === user?.userId ? (
        <div className="repo-left-item">
          <Button onClick={gotoEditProfile}>Edit Profile</Button>
        </div>
      ) : user ? (
        <div className="repo-left-item">
          {targetUser.followed ? (
            <Button onClick={unFollow}>UnFollow</Button>
          ) : (
            <Button onClick={follow}>Follow</Button>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="repo-left-item">
        <span
          className="repo-left-item-link"
          onClick={() => {
            navigate(`/${targetUser.userId}/follower`)
          }}>
          {targetUser.followerCount} Follwers
        </span>
        {' / '}
        <span
          className="repo-left-item-link"
          onClick={() => {
            navigate(`/${targetUser.userId}/following`)
          }}>
          {targetUser.followingCount} Follwings
        </span>
      </div>
      <div className="divider"></div>
    </div>
  )
}

export default LeftProfile
