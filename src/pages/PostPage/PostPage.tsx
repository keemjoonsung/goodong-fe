import React, { useEffect, useState, Suspense, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './PostPage.css'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import api from '../../apis'
import { PostDetail } from '../../types/post'
import CommentList from '../../components/CommentList/CommentList'
import { Button, Image } from 'react-bootstrap'
import { Star } from 'react-bootstrap-icons'

const Model = ({ url }: { url: string }) => {
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

      console.log(bbox)
      console.log((miny + maxy) / 2)
      console.log(miny)
      console.log(maxy)
      setYPos((miny + maxy) / 2)
      setXPos((min.x + max.x) / 2)
      console.log((min.x + max.x) / 2)
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
  const [postData, setPostData] = useState<PostDetail | null>(null)
  const [modelCode, setModelCode] = useState('')
  const [modelUrl, setModelUrl] = useState('')
  const params = useParams()
  const postId = parseInt(params['postID'] as string)

  const editPost = () => {
    // navigate(`/edit/${postId}`)
  }

  useEffect(() => {
    const fetchData = async (postId: number) => {
      try {
        const detail = await api.post.getPostDetail(postId)
        setPostData(detail)

        const fileName = detail.models[detail.models.length - 1].fileName
        const model = await api.post.downloadGLB(fileName)
        const blob = new Blob([model], { type: 'model/gltf-binary' })
        const url = URL.createObjectURL(blob)
        setModelUrl(url)
      } catch (error) {
        console.error(error)
      }
    }
    if (postId) fetchData(postId)
  }, [postId])
  return (
    <div className="model-preview-container">
      {postData && modelUrl ? (
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
                <Button onClick={editPost}>Edit</Button>
                <Button
                  variant="outline-secondary"
                  className="post-star-button">
                  <Star /> {postData.likes}
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
          <div id={'canvas-container'}>
            <Canvas>
              <OrbitControls />
              <ambientLight intensity={1} />
              <hemisphereLight intensity={5} />
              <Suspense>
                <Model url={modelUrl} />
              </Suspense>
            </Canvas>
          </div>
          <CommentList postId={postId} comments={postData.comments} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default PostPage
