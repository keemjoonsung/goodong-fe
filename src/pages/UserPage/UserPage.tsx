import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './UserPage.css'
import api from '../../apis'
import { Button, Form, Pagination } from 'react-bootstrap'
import RepoList from '../../components/RepoList/RepoList'
import { User, UserContribution, UserDetail } from '../../types/user'
import { Post } from '../../types/post'
import useMainStore from '../../stores'
import { Envelope, Person } from 'react-bootstrap-icons'
import { ContributionCalendar } from 'react-contribution-calendar'
import LeftProfile from '../../components/LeftProfile/LeftProfile'

const UserPage = () => {
  const user = useMainStore(state => state.user)
  const [repoData, setRepoData] = useState<Post[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchString, setSearchString] = useState('')
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null)
  const [contributions, setContributions] = useState<UserContribution[]>([])
  const contributionCount = useMemo(() => {
    return contributions.reduce((acc, cur) => acc + cur.count, 0)
  }, [contributions])
  const navigate = useNavigate()
  const { userID } = useParams()

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
          const userContributions = await api.user.getUserContributions(
            parseInt(userID),
          )
          setContributions(userContributions)
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
      {currentUser && (
        <LeftProfile targetUser={currentUser} setTargetUser={setCurrentUser} />
      )}
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
        <div className="contributions">
          <h5>{contributionCount} contributions in the last year</h5>
          <div className="contribution-box">
            <ContributionCalendar
              start={'2024-01-01'}
              end={'2024-12-31'}
              cx={10}
              cy={10}
              cr={2}
              includeBoundary
              data={contributions.map(i => ({
                [i.date]: {
                  level: i.count,
                },
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
