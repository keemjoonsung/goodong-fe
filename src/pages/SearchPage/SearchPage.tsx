import { useEffect, useState } from 'react'
import { Button, Card, Form, Image } from 'react-bootstrap'
import './SearchPage.css'
import api from '../../apis'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RepoList from '../../components/RepoList/RepoList'

const SearchPage = () => {
  const [searchString, setSearchString] = useState('')
  const navigate = useNavigate()
  const [searchParam, setSearchParams] = useSearchParams()
  const [searchResult, setSearchResult] = useState([])

  const handleSubmit = () => {
    setSearchParams({ q: searchString })
  }

  useEffect(() => {
    const keyword = searchParam.get('q')
    const search = async (keyword: string) => {
      const response = await api.searchPost(keyword)
      console.log(response.data)
      setSearchResult(response.data)
      setSearchString(keyword)
    }
    if (keyword) search(keyword)
  }, [searchParam])

  return (
    <div className="search-container">
      {/* <h3>Search: {searchParam.get('q')}</h3> */}
      <Form.Control
        className="search-bar"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}></Form.Control>
      <hr />
      {searchResult.length > 0 && (
        <h3>There is {searchResult.length} results</h3>
      )}
      <div className="search-result">
        <RepoList repoData={searchResult} />
        {searchResult.length === 0 && <p>No result</p>}
      </div>
    </div>
  )
}

export default SearchPage
