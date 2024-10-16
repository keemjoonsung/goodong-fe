import React, { useState } from 'react'
import { Form, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import useMainStore from '../../stores'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faPlusCircle,
  faBars,
} from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  const navigate = useNavigate()
  const user = useMainStore(state => state.user)
  const [searchString, setSearchString] = useState('')
  const handleSubmit = () => {
    navigate(`/search?q=${searchString}`)
  }

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
      <div id={'left-section'}>
        {/* 햄버거 메뉴 아이콘 */}
        <button className="icon-button">
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* 로고 */}
        <Link to={'/'} id={'home-link'}>
          <Image src={'/img/Logo.png'} id={'goodong-logo'} />
          <span id={'goodong-logo-letter'}>GOODONG</span>
        </Link>
      </div>

      <div id={'right-section'}>
        {!isLogin && (
          <span id={'regi-span'}>
            <button
              className={'button icon-button'}
              id={'signin-button'}
              onClick={gotoSigninPage}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </button>
            <button
              className={'button icon-button'}
              id={'create-account-button'}
              onClick={gotoSignupPage}>
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </span>
        )}
        {isLogin && user.nickname !== '' && (
          <span id={'user-span'}>
            <Form.Group className="search-bar-container">
              <span className="search-icon">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <Form.Control
                className="search-bar"
                type="text"
                placeholder="search"
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </Form.Group>
            <Link to={`/${user.userId}`}>
              <button
                className={'button icon-button'}
                id={'my-repository-button'}>
                <FontAwesomeIcon icon={faUser} />
              </button>
            </Link>
            <Link to={'/'}>
              <button
                className={'button icon-button'}
                id={'logout-button'}
                onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}

export default Header
