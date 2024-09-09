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

    </div>
  )
}

export default MainPage
