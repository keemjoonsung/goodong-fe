import { useState } from 'react'
import { Button, Card, Form, Image } from 'react-bootstrap'
import './Signup.css'
import api from '../../apis'
import { useNavigate } from 'react-router-dom'

const emailRegEx =
  /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i
const pwdRegEx = /^[A-Za-z0-9]{8,20}$/
const emailCheck = (email: string) => {
  return emailRegEx.test(email)
}
const pwdCheck = (pwd: string) => {
  return pwdRegEx.test(pwd)
}

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSignin = () => {
    if (!email.trim() || !password.trim() || password !== confirmPassword) {
      return
    }
    if (!emailCheck(email)) {
      // alert('Email format incorrect!')
      return
    }
    if (!pwdCheck(password)) {
      // alert(
      //   'Password must be 8-20 characters and include uppercase, lowercase, and numeric characters',
      // )
      return
    }
    api.signup(email, password).then(response => {
      alert(response.data)
      navigate('/signin')
    })
  }
  return (
    <div className="signin-page">
      <Image src="/img/Logo-black.png" alt="goodong-logo" height={80} />
      <h1>Sign up to Goodong</h1>
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
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          className="search-bar"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
        <Button variant="success" onClick={handleSignin}>
          Sign Up
        </Button>
      </Card>
    </div>
  )
}

export default SignupPage
