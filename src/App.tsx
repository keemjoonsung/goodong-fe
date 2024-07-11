import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import {Route, Routes} from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import RepositoryPage from './pages/RepositoryPage/RepositoryPage'
import ModelPreviewPage from './pages/ModelPreviewPage/ModelPreviewPage'
import CreateRepositoryPage from './pages/CreateRepositoryPage/CreateRepositoryPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:userID/repository" element={<RepositoryPage />} />
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
