import { useState } from 'react'
import { Form } from 'react-bootstrap'
import './MainPage.css'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const [searchString, setSearchString] = useState('')
  const navigate = useNavigate()
  const handleSubmit = () => {
    navigate(`/search?q=${searchString}`)
  }
  return (
    <div className="main-background">
      <h1>Goodong</h1>
      <p>Search 3D Model you want!</p>
      <Form.Control
        className="search-bar"
        type="text"
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}></Form.Control>
      <div className="blur"></div>
    </div>
  )
}

export default MainPage
