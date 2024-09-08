import { useEffect, useState } from 'react'
import { Button, Card, Form, Image } from 'react-bootstrap'
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

  const handleSubmit = () => {
    setSearchParams({ q: searchString })
  }

  useEffect(() => {
    const keyword = searchParam.get('q')
    const search = async (keyword: string) => {
      const posts = await api.post.searchPost(keyword)
      setSearchResult(posts)
      setSearchString(keyword)
    }
    if (keyword) search(keyword)
  }, [searchParam])

  return (
    <div className="search-container">
      <Form.Control
        className="search-bar"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}></Form.Control>
      <hr />
      {searchResult.length > 0 && <h3>{searchResult.length} results</h3>}
      <div className="search-result">
        <RepoList repoData={searchResult} />
        {searchResult.length === 0 && <p>No result</p>}
      </div>
    </div>
  )
}

export default SearchPage
