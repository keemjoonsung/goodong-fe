import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './FollowingPage.css'
import api from '../../apis'
import { Pagination } from 'react-bootstrap'
import { User, UserDetail } from '../../types/user'
import UserList from '../../components/UserList/UserList'
import LeftProfile from '../../components/LeftProfile/LeftProfile'

const FollowingPage = () => {
  const [followingList, setFollowingList] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const navigate = useNavigate()
  const { userID } = useParams()
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchFollowingData = async (page: number) => {
    if (!userID) return
    const users = await api.follow.getFollowingList(parseInt(userID), page)
    setFollowingList(users.content)
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
        fetchFollowingData(0)
      } catch (error) {
        alert(error)
        navigate('/')
      }
    }
    fetchData()
  }, [userID, navigate])

  return (
    <div className="repo-list">
      {currentUser && (
        <LeftProfile targetUser={currentUser} setTargetUser={setCurrentUser} />
      )}
      <div className="repo-right">
        {followingList.length ? (
          <div>
            <UserList userList={followingList} />
            {totalPage > 1 && (
              <Pagination>
                {Array.from(Array(totalPage).keys()).map(i => {
                  return (
                    <Pagination.Item
                      key={i}
                      active={i === currentPage}
                      onClick={() => fetchFollowingData(i)}>
                      {i + 1}
                    </Pagination.Item>
                  )
                })}
              </Pagination>
            )}
          </div>
        ) : (
          <div>
            No Following Users.
            <br />
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowingPage
