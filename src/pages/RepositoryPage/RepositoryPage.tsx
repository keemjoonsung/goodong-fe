import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './RepositoryPage.css'
import api from '../../apis'
import { Button, Form } from 'react-bootstrap'
import RepoList from '../../components/RepoList/RepoList'

const RepositoryPage = () => {
  const [repoData, setRepoData] = useState<
    {
      postId: number
      userId: number
      title: string
      content: string
    }[]
  >([])
  const [searchString, setSearchString] = useState('')
  const navigate = useNavigate()
  const { userID } = useParams()

  const gotoEditProfile = () => {
    navigate('/editProfile')
  }

  const handleSubmit = () => {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getPostByUserId(userID ?? '')
        if (response.data.length !== 0) {
          setRepoData(response.data)
        }
      } catch (error) {
        // alert('로그인이 필요합니다.')
        console.log(error)
        // navigate('/')
      }
    }
    fetchData()
  }, [])

  return (
    <div className="repo-list">
      <div className="repo-left">
        <div className="repo-left-item">
          <img
            src="https://avatars.githubusercontent.com/u/42940044?v=4"
            alt="profile"
          />
        </div>
        <div className="repo-left-item">{userID}</div>
        <div className="repo-left-item">
          <Button onClick={gotoEditProfile}>Edit Profile</Button>
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
          </div>
        ) : (
          <div>
            User Repository is currently empty!!!
            <br />
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryPage
