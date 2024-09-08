import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import UserPage from './pages/UserPage/UserPage'
import ModelPreviewPage from './pages/ModelPreviewPage/ModelPreviewPage'
import CreateRepositoryPage from './pages/CreateRepositoryPage/CreateRepositoryPage'
import SigninPage from './pages/SigninPage/SigninPage'
import SignupPage from './pages/SignupPage/SignupPage'
import SearchPage from './pages/SearchPage/SearchPage'
import { useEffect, useState } from 'react'
import api, { setAPIToken } from './apis'
import useMainStore from './stores'
import FollowerPage from './pages/FollowerPage/FollowerPage'
import FollowingPage from './pages/FollowingPage/FollowingPage'

function App() {
  const setUser = useMainStore(state => state.setUser)
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    const init = async () => {
      const jwtToken = localStorage.getItem('jwtToken')
      if (jwtToken) {
        setAPIToken(jwtToken)
        try {
          const user = await api.auth.checkToken()
          setUser(user)
        } catch {
          setAPIToken('')
          localStorage.removeItem('jwtToken')
        }
      }
      setIsInit(true)
    }
    init()
  }, [])
  if (!isInit) {
    return <div></div>
  }
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/:userID" element={<UserPage />} />
        <Route path="/:userID/follower" element={<FollowerPage />} />
        <Route path="/:userID/following" element={<FollowingPage />} />
        <Route
          path="/:userID/repository/:postID"
          element={<ModelPreviewPage />}
        />
        <Route path="/repository/create" element={<CreateRepositoryPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
