import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './FollowerPage.css'
import api from '../../apis'
import { Button, Form, Pagination } from 'react-bootstrap'
import { User, UserDetail } from '../../types/user'
import { Post } from '../../types/post'
import useMainStore from '../../stores'
import UserList from '../../components/UserList/UserList'

const FollowerPage = () => {
  const user = useMainStore(state => state.user)
  const [followerList, setFollowerList] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const navigate = useNavigate()
  const { userID } = useParams()
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const gotoEditProfile = () => {
    navigate('/editProfile')
  }
  const fetchFollowerData = async (page: number) => {
    if (!userID) return
    const users = await api.follow.getFollowerList(parseInt(userID), page)
    setFollowerList(users.content)
    setTotalPage(users.totalPages)
    setCurrentPage(users.currentPage)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userID || isNaN(parseInt(userID))) {
          location.href = '/'
          return
        }
        try {
          const user = await api.user.getUser(parseInt(userID))
          setCurrentUser(user)
        } catch (error) {
          alert('Cannot find user')
          navigate('/')
        }

        fetchFollowerData(0)
      } catch (error) {
        alert(error)
        navigate('/')
      }
    }
    fetchData()
  }, [userID, navigate])

  return (
    <div className="repo-list">
      <div className="repo-left">
        <div className="repo-left-item">
          <img
            src={
              currentUser?.profileImage ??
              'https://avatars.githubusercontent.com/u/42940044?v=4'
            }
            alt="profile"
          />
        </div>
        <div className="repo-left-item">{currentUser?.nickname}</div>
        <div className="repo-left-item">{currentUser?.email}</div>
        {currentUser?.userId === user?.userId && (
          <div className="repo-left-item">
            <Button onClick={gotoEditProfile}>Edit Profile</Button>
          </div>
        )}
        <div className="repo-left-item">
          <span
            className="repo-left-item-link"
            onClick={() => {
              navigate(`/${userID}/follower`)
            }}>
            {currentUser?.followerCount} Follwers
          </span>
          {' / '}
          <span
            className="repo-left-item-link"
            onClick={() => {
              navigate(`/${userID}/following`)
            }}>
            {currentUser?.followingCount} Follwings
          </span>
        </div>
        <div className="divider"></div>
      </div>
      <div className="repo-right">
        {followerList.length ? (
          <div>
            <UserList userList={followerList} />
            {totalPage > 1 && (
              <Pagination>
                {Array.from(Array(totalPage).keys()).map(i => {
                  return (
                    <Pagination.Item
                      key={i}
                      active={i === currentPage}
                      onClick={() => fetchFollowerData(i)}>
                      {i + 1}
                    </Pagination.Item>
                  )
                })}
              </Pagination>
            )}
          </div>
        ) : (
          <div>
            No Follower Users.
            <br />
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowerPage
