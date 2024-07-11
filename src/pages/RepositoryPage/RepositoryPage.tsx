import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import './RepositoryPage.css'
import api from '../../apis'

const RepositoryPage = () => {
  const [repoData, setRepoData] = useState<
    {
      postId: number
      userId: number
      title: string
    }[]
  >([])
  const navigate = useNavigate()
  const {userID} = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getPostByUserId(userID ?? '')
        if (response.data.length !== 0) {
          setRepoData(response.data)
        }
      } catch (error) {
        alert('로그인이 필요합니다.')
        console.log(error)
        navigate('/')
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container">
      <div className={'repo-header'}>
        <span className={'repo-username'}>{userID}</span>
        <Link to="/repository/create">
          <button className="btn-create">New</button>
        </Link>
      </div>
      <hr />
      {repoData ? (
        <div>
          <ul>
            {repoData.map((item, index) => (
              <Link
                className={'repo-link'}
                to={`/${item.userId}/repository/${item.postId}`}
                key={index}>
                <div className="repo-item">
                  <span>{item.title}</span>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          User Repository is currently empty!!!
          <br />
        </div>
      )}
    </div>
  )
}

export default RepositoryPage
