import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './UserPage.css'
import api from '../../apis'
import { Button, Form, Pagination } from 'react-bootstrap'
import RepoList from '../../components/RepoList/RepoList'
import { User, UserDetail } from '../../types/user'
import { Post } from '../../types/post'
import useMainStore from '../../stores'
import { Envelope, Person } from 'react-bootstrap-icons'

const UserPage = () => {
  const user = useMainStore(state => state.user)
  const [repoData, setRepoData] = useState<Post[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchString, setSearchString] = useState('')
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const navigate = useNavigate()
  const { userID } = useParams()

  const gotoEditProfile = () => {
    navigate('/editProfile')
  }
  const follow = () => {
    if (!userID || isNaN(parseInt(userID))) {
      return
    }
    api.follow.follow(parseInt(userID), true)
  }
  const unFollow = () => {
    if (!userID || isNaN(parseInt(userID))) {
      return
    }
    api.follow.follow(parseInt(userID), false)
  }

  const handleSubmit = () => {
    if (!searchString) {
      return
    }
    const l = repoData.filter((item: Post) => {
      return item.title.includes(searchString)
    })
    setRepoData(l)
  }

  const fetchPostData = async (page: number) => {
    if (!userID) return
    const posts = await api.post.getPostList(parseInt(userID), page)
    setRepoData(posts.content)
    setTotalPage(posts.totalPages)
    setCurrentPage(posts.currentPage)
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

        fetchPostData(0)
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
        <div className="repo-left-item">
          <Person size={20} /> {currentUser?.nickname}
        </div>
        <div className="repo-left-item">
          <Envelope size={20} /> {currentUser?.email}
        </div>
        {currentUser?.userId === user?.userId ? (
          <div className="repo-left-item">
            <Button onClick={gotoEditProfile}>Edit Profile</Button>
          </div>
        ) : user ? (
          <div className="repo-left-item">
            {true ? (
              <Button onClick={follow}>Follow</Button>
            ) : (
              <Button onClick={unFollow}>UnFollow</Button>
            )}
          </div>
        ) : (
          <></>
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
        <div className={'repo-header'}>
          <Form.Control
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchString}
            onChange={e => setSearchString(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}></Form.Control>
          <Link to="/repository/create">
            <button className="btn-create">New</button>
          </Link>
        </div>
        <div className="divider"></div>
        {repoData.length ? (
          <div>
            <RepoList repoData={repoData} />
            {totalPage > 1 && (
              <Pagination>
                {Array.from(Array(totalPage).keys()).map(i => {
                  return (
                    <Pagination.Item
                      key={i}
                      active={i === currentPage}
                      onClick={() => fetchPostData(i)}>
                      {i + 1}
                    </Pagination.Item>
                  )
                })}
              </Pagination>
            )}
          </div>
        ) : (
          <div>
            No data
            <br />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage
