import React, { useEffect, useState, Suspense, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './PostPage.css'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import api from '../../apis'
import { Model, PostDetail } from '../../types/post'
import CommentList from '../../components/CommentList/CommentList'
import { Button, Image } from 'react-bootstrap'
import { ClockHistory, Star, StarFill } from 'react-bootstrap-icons'
import useMainStore from '../../stores'

const Model3D = ({ url }: { url: string }) => {
  const [yPos, setYPos] = useState(0)
  const [xPos, setXPos] = useState(0)
  const gltf = useLoader(GLTFLoader, url) as any
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    if (gltf) {
      const bbox = new THREE.Box3().setFromObject(gltf.scene)
      const min = bbox.min
      const max = bbox.max
      const miny = Math.floor(min.y)
      const maxy = Math.floor(max.y)

      setYPos((miny + maxy) / 2)
      setXPos((min.x + max.x) / 2)
      const size = new THREE.Vector3()
      bbox.getSize(size)
      const newScaleFactor = 4 / Math.max(size.x, size.y, size.z)
      setScaleFactor(newScaleFactor)
    }
  }, [gltf])

  return (
    <>
      <primitive
        position={[xPos, yPos, 0]}
        object={gltf.scene}
        scale={scaleFactor}
      />
    </>
  )
}

const PostPage = () => {
  const navigate = useNavigate()
  const user = useMainStore(state => state.user)
  const [postData, setPostData] = useState<PostDetail | null>(null)
  const [selectedModel, setSelectedModel] = useState(0)
  const [modelUrl, setModelUrl] = useState('')
  const params = useParams()
  const postId = parseInt(params['postID'] as string)

  const editPost = () => {
    navigate(`/${postData?.userId}/${postId}/edit`)
  }

  const loadModel = async (m: Model) => {
    try {
      const fileName = m.fileName
      const model = await api.post.downloadGLB(fileName)
      const blob = new Blob([model], { type: 'model/gltf-binary' })
      if (blob.size < 1) {
        throw new Error('Model size is too small')
      }
      const url = URL.createObjectURL(blob)
      setModelUrl(url)
    } catch (e) {
      console.log(e)
      setModelUrl('')
    }
  }

  const selectModel = async (version: number) => {
    setSelectedModel(version)
    const model = postData?.models.find(model => model.version === version)
    if (model) {
      loadModel(model)
    }
  }

  const deletePost = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await api.post.deletePost(postId)
      navigate(`/${user?.userId}`)
    }
  }

  const copyModel = (fileName: string) => {
    // copy model id to clipboard
    navigator.clipboard.writeText(fileName)
    alert('Model Code copied to clipboard')
  }

  const likeModel = async () => {
    try {
      await api.like.like(postId, true)
      setPostData({
        ...postData,
        likes: postData.likes + 1,
        liked: true,
      })
    } catch {
      //
    }
  }
  const unlikeModel = () => {
    try {
      api.like.like(postId, false)
      setPostData({
        ...postData,
        likes: postData.likes - 1,
        liked: false,
      })
    } catch {
      //
    }
  }

  useEffect(() => {
    const fetchData = async (postId: number) => {
      try {
        const detail = await api.post.getPostDetail(postId)
        detail.models.reverse()
        setPostData(detail)
        setSelectedModel(detail.models[0].version)
        loadModel(detail.models[0])
      } catch (error) {
        console.error(error)
      }
    }
    if (postId) fetchData(postId)
  }, [postId])
  return (
    <div className="model-preview-container">
      {postData ? (
        <>
          <div>
            <h1 className="post-title">
              <div>
                <Image
                  src={
                    postData.profileImage ??
                    'https://avatars.githubusercontent.com/u/42940044?v=4'
                  }
                />
                <Link to={`/${postData.userId}`}>{postData.nickname}</Link>
                {' / '}
                <Link to={`/${postData.userId}/${postData.postId}`}>
                  {postData.title}
                </Link>
                <span className="post-status">
                  {postData.status === 'PUBLIC' ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="buttons">
                {postData.userId === user?.userId && (
                  <>
                    <Button onClick={editPost}>Add Version</Button>
                    <Button variant="outline-danger" onClick={deletePost}>
                      Delete
                    </Button>
                  </>
                )}

                <Button
                  variant="outline-secondary"
                  className="post-star-button"
                  onClick={postData.liked ? unlikeModel : likeModel}>
                  {postData.liked ? <StarFill fill="#FFD700" /> : <Star />}{' '}
                  {postData.likes}
                </Button>
              </div>
            </h1>
            <div></div>
          </div>
          <div className="post-tags">
            {postData.tags.map(tag => (
              <span>{tag}</span>
            ))}
          </div>
          <div className="post-description">{postData.content}</div>
          <hr />
          <div className="post-versions">
            <div className="post-versions-header">
              <h3>Version History</h3>
              <div>
                <ClockHistory size={14} /> {postData.models.length} versions
              </div>
            </div>
            <div className="post-versions-list">
              {postData.models.map(model => (
                <div
                  className={
                    model.version === selectedModel
                      ? 'post-versions-item selected'
                      : 'post-versions-item'
                  }
                  key={model.version}>
                  <span
                    className="version-text"
                    onClick={() => {
                      selectModel(model.version)
                    }}>
                    version {model.version}: {model.commitMessage}
                  </span>{' '}
                  {postData.models[0].version === model.version && (
                    <span className="version">latest</span>
                  )}
                  <Button
                    onClick={() => {
                      copyModel(model.fileName)
                    }}>
                    {'<> '}Code
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {modelUrl && (
            <div id={'canvas-container'}>
              <Canvas>
                <OrbitControls />
                <ambientLight intensity={1} />
                <hemisphereLight intensity={5} />
                <Suspense>
                  <Model3D url={modelUrl} />
                </Suspense>
              </Canvas>
            </div>
          )}

          <CommentList postId={postId} comments={postData.comments} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default PostPage
