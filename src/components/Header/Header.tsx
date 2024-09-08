import React, { useEffect, useState } from 'react'
import { Image, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import useMainStore from '../../stores'

const Header = () => {
  const navigate = useNavigate()
  const user = useMainStore(state => state.user)

  const gotoSigninPage = () => {
    navigate('/signin')
  }
  const gotoSignupPage = () => {
    navigate('/signup')
  }
  const isLogin = user !== null

  const logout = () => {
    localStorage.removeItem('jwtToken')
    location.href = '/'
  }

  return (
    <div id={'header-frame'}>
      <Link to={'/'}>
        <Image src={'/img/Logo.png'} id={'goodong-logo'} height="60" />
      </Link>
      {!isLogin && (
        <span id={'regi-span'}>
          <button
            className={'button'}
            id={'signin-button'}
            onClick={gotoSigninPage}>
            Sign in
          </button>
          <button
            className={'button'}
            id={'create-account-button'}
            onClick={gotoSignupPage}>
            Create account
          </button>
        </span>
      )}
      {isLogin && user.nickname !== '' && (
        <span id={'user-span'}>
          <span className={'user-info'} id={'user-info-text'}>
            {user.nickname} 님 반갑습니다!
          </span>
          <Link to={`/${user.userId}`}>
            <button className={'button'} id={'my-repository-button'}>
              My Repository
            </button>
          </Link>
          <Link to={'/'}>
            <button className={'button'} id={'logout-button'} onClick={logout}>
              Logout
            </button>
          </Link>
        </span>
      )}
    </div>
  )
}

export default Header
