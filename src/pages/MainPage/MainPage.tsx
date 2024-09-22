import { Button } from 'react-bootstrap'
import './MainPage.css'
import { useNavigate } from 'react-router-dom'
import Background from '/src/assets/sample_image.webp'
import { useEffect } from 'react'
import useMainStore from '../../stores'

const MainPage = () => {
  const user = useMainStore(state => state.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (user) navigate(`/${user.userId}`)
  }, [user])

  return (
    <div className="main">
      <section id="main-1">
        <h1>
          AI-powered
          <br />
          3D model management
        </h1>
        <p>
          Goodong is a 3D model management platform that allows you to manage
          your 3D models easily.
        </p>
        <Button onClick={() => navigate('/signup')}>Get Started</Button>
      </section>
      <section id="main-2">
        <div className="main-features">
          <img src={Background} />
          <div>
            <h2>AI Auto-Tagging and Description</h2>
            <p>
              "Let AI generate descriptions and tags for your models
              automatically."
            </p>
            <p>
              Save time by having AI automatically create tags and descriptions
              for uploaded models, improving search efficiency.
            </p>
          </div>
        </div>
        <div className="main-features">
          <div>
            <h2>Version Control</h2>
            <p>"Easily manage multiple versions of your 3D models."</p>
            <p>
              Keep all your model versions organized and easily revert to
              previous versions when needed.
            </p>
          </div>
          <img src={Background} />
        </div>
        <div className="main-features">
          <img src={Background} />
          <div>
            <h2>Blender Plugin</h2>
            <p>"Seamless integration with Blender"</p>
            <p>
              Manage and upload your models directly from Blender without
              leaving your design environment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MainPage
