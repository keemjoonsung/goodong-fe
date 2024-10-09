import React, { Suspense, useEffect, useMemo, useState } from 'react'
import './PostEditPage.css'
import api from '../../apis'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, InputGroup } from 'react-bootstrap'
import useMainStore from '../../stores'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { PostDetail } from '../../types/post'
import { Magic } from 'react-bootstrap-icons'

const Model = ({ glbData }: { glbData: any }) => {
  const { scene } = useGLTF(glbData) as any
  return <primitive object={scene} />
}

const PostEditPage = () => {
  const user = useMainStore(state => state.user)
  const navigate = useNavigate()

  const [commitMessage, setCommitMessage] = useState('')
  const [title, setTitle] = useState('')
  const [tag1, setTag1] = useState('')
  const [tag2, setTag2] = useState('')
  const [tag3, setTag3] = useState('')
  const [status, setStatus] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [content, setContent] = useState('')
  const [isChanged, setIsChanged] = useState(false)
  const [gltfFile, setGltfFile] = useState<any>(null) // 추가: glTF 파일 상태
  const [glbData, setGlbData] = useState<any>(null)
  const params = useParams()
  const postId = parseInt(params['postID'] as string)

  useEffect(() => {
    const fetchData = async (postId: number) => {
      try {
        const detail = await api.post.getPostDetail(postId)
        if (detail.userId !== user?.userId) {
          alert('You are not the owner of this post.')
          navigate(`/${user?.userId}`)
        }
        setTitle(detail.title)
        setContent(detail.content)
        setTag1(detail.tags[0])
        setTag2(detail.tags[1])
        setTag3(detail.tags[2])
        setStatus(detail.status)
      } catch (error) {
        console.error(error)
      }
    }
    if (postId) fetchData(postId)
  }, [postId])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setIsChanged(true)
  }
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value)
    setIsChanged(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    setGltfFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const blob = new Blob([new Uint8Array(arrayBuffer)], {
          type: 'model/gltf-binary',
        })
        const url = URL.createObjectURL(blob)
        setGlbData(url)
        setIsChanged(true)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const generateDescription = async () => {
    const canvas = document.querySelector('canvas')
    const dataUrl = canvas?.toDataURL('image/jpeg')
    if (!dataUrl) {
      alert('Fail to capture image')
      return
    }
    const binaryFile = await fetch(dataUrl).then(res => res.blob())
    const formData = new FormData()
    formData.append('filePng', binaryFile)
    const data = await api.post.generateDescription(formData)
    setTitle(data.title)
    setContent(data.content)
    setTag1(data.tags[0])
    setTag2(data.tags[1])
    setTag3(data.tags[2])
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commitMessage || !title || !content || !tag1) {
      alert('필수 입력값을 모두 입력해주세요.')
      return
    }

    try {
      await api.post.checkDuplicatedTitle(title)
    } catch {
      alert('이미 존재하는 타이틀 입니다.')
      return
    }

    const formData = new FormData()
    formData.append('commitMessage', commitMessage)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('tags', [tag1, tag2, tag3].join(','))
    formData.append('status', status)
    if (gltfFile) formData.append('file', gltfFile)

    try {
      await api.post.updatePost(postId, formData)
      navigate(`/${user?.userId}/${postId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="create-repo-container">
      <h3>Upload new version</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file" id="file-label">
            .glTF(필수)와 텍스쳐 파일(선택)가 포함된 zip파일 혹은 .glb 파일*
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        {glbData && (
          <>
            <div className="model-preview">
              <Canvas>
                <Suspense fallback={null}>
                  {/* add light */}
                  <ambientLight intensity={5} />
                  <pointLight position={[10, 10, 10]} />
                  {/* <Environment preset="sunset" /> */}
                  <Model glbData={glbData} />
                  <OrbitControls />
                </Suspense>
              </Canvas>
            </div>
            <Button onClick={generateDescription}>
              <Magic /> Generate Description
            </Button>
          </>
        )}

        <hr />
        <div className="form-group">
          <Form.Label>Commit Message</Form.Label>
          <Form.Control
            className="search-bar"
            type="text"
            placeholder="Commit Message"
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}></Form.Control>
        </div>
        <div className="form-group">
          <Form.Label>Title</Form.Label>
          <Form.Control
            className="search-bar"
            type="text"
            placeholder="Repository name"
            value={title}
            onChange={handleTitleChange}></Form.Control>
        </div>
        <div className="form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="search-bar"
            type="text"
            placeholder="Description"
            value={content}
            onChange={handleContentChange}></Form.Control>
        </div>
        <div className="form-group">
          <Form.Label>Tags</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              className="search-bar"
              type="text"
              placeholder="Tag1"
              value={tag1}
              onChange={e => {
                setTag1(e.target.value)
                setIsChanged(true)
              }}></Form.Control>
            <Form.Control
              className="search-bar"
              type="text"
              placeholder="Tag2"
              value={tag2}
              onChange={e => {
                setTag2(e.target.value)
                setIsChanged(true)
              }}></Form.Control>
            <Form.Control
              className="search-bar"
              type="text"
              placeholder="Tag3"
              value={tag3}
              onChange={e => {
                setTag3(e.target.value)
                setIsChanged(true)
              }}></Form.Control>
          </InputGroup>
        </div>
        <hr />
        <div className="form-group">
          <Form.Check
            type="radio"
            label="Public"
            name="status"
            id="public"
            value="PUBLIC"
            checked={status === 'PUBLIC'}
            onChange={() => {
              setStatus('PUBLIC')
              setIsChanged(true)
            }}
          />
          <Form.Check
            type="radio"
            label="Private"
            name="status"
            id="private"
            value="PRIVATE"
            checked={status === 'PRIVATE'}
            onChange={() => {
              setStatus('PRIVATE')
              setIsChanged(true)
            }}
          />
        </div>
        <hr />

        <Button type="submit" disabled={!commitMessage}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export default PostEditPage
