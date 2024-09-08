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
const nicknameCheck = (nickname: string) => {
  return nickname.length > 0 && nickname.length < 20
}

const SignupPage = () => {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSignin = async () => {
    if (
      !nickname.trim() ||
      !email.trim() ||
      !password.trim() ||
      password !== confirmPassword
    ) {
      alert('empty field')
      return
    }
    if (!nicknameCheck(nickname)) {
      alert('Nickname must be 1-20 characters')
      return
    }
    if (!emailCheck(email)) {
      alert('Email format incorrect!')
      return
    }
    if (!pwdCheck(password)) {
      alert(
        'Password must be 8-20 characters and include uppercase, lowercase, and numeric characters',
      )
      return
    }
    try {
      await api.auth.checkDuplicatedNickname(nickname)
    } catch (e) {
      alert('Duplicate nickname')
      return
    }
    try {
      await api.auth.checkDuplicatedEmail(email)
    } catch (e) {
      alert('Duplicate email')
      return
    }

    try {
      await api.auth.signup(email, password, nickname).then(response => {
        alert(response.data)
        navigate('/signin')
      })
    } catch (e) {
      alert('Sign up failed')
      return
    }
  }
  return (
    <div className="signin-page">
      <Image src="/img/Logo-black.png" alt="goodong-logo" height={80} />
      <h1>Sign up to Goodong</h1>
      <Card body style={{ width: 400, background: '#f7f7f7' }}>
        <Form.Label>Nickname</Form.Label>
        <Form.Control
          className="search-bar"
          type="nickname"
          value={nickname}
          maxLength={20}
          onChange={e => setNickname(e.target.value)}></Form.Control>
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
