import { useState } from 'react'
import { Button, Card, Form, Image } from 'react-bootstrap'
import './Signin.css'
import api from '../../apis'
import { useNavigate } from 'react-router-dom'

const SigninPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignin = () => {
    if (!email.trim() || !password.trim()) {
      return
    }
    api.login(email, password).then(token => {
      localStorage.setItem('jwtToken', token)
      localStorage.setItem('username', email)
      location.href = '/'
    })
  }

  return (
    <div className="signin-page">
      <Image src="/img/Logo-black.png" alt="goodong-logo" height={80} />
      <h1>Sign in to Goodong</h1>
      <Card body style={{ width: 400, background: '#f7f7f7' }}>
        <Form.Label>Email</Form.Label>
        <Form.Control
          className="search-bar"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}></Form.Control>
        <Form.Label>Password</Form.Label>
        <Form.Control
          className="search-bar"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}></Form.Control>
        <Button variant="success" onClick={handleSignin}>
          Sign in
        </Button>
      </Card>
    </div>
  )
}

export default SigninPage
