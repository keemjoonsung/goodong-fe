import { useEffect, useState } from 'react'
import { Button, Card, Form, Image, Pagination } from 'react-bootstrap'
import './SearchPage.css'
import api from '../../apis'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RepoList from '../../components/RepoList/RepoList'
import { Post } from '../../types/post'

const SearchPage = () => {
  const [searchString, setSearchString] = useState('')
  const navigate = useNavigate()
  const [searchParam, setSearchParams] = useSearchParams()
  const [searchResult, setSearchResult] = useState<Post[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const handleSubmit = () => {
    setSearchParams({ q: searchString })
  }

  const fetchPostData = async (keyword: string, page: number) => {
    const posts = await api.post.searchPost(keyword, page)
    setSearchString(keyword)
    setSearchResult(posts.content)
    setTotalPage(posts.totalPages)
    setCurrentPage(posts.currentPage)
  }

  useEffect(() => {
    const keyword = searchParam.get('q')
    if (keyword) fetchPostData(keyword, 0)
  }, [searchParam])

  return (
    <div className="search-container">
      <div className="search-result">
        <RepoList repoData={searchResult} />
        {totalPage > 1 && (
          <Pagination>
            {[...Array(totalPage).keys()].map(i => (
              <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => fetchPostData(searchString, i)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
        {searchResult.length === 0 && <p>No result</p>}
      </div>
    </div>
  )
}

export default SearchPage
