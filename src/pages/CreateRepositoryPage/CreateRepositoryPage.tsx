import React, { Suspense, useEffect, useMemo, useState } from 'react'
import './CreateRepositoryPage.css'
import api from '../../apis'
import { useNavigate } from 'react-router-dom'
import { Button, Form, InputGroup } from 'react-bootstrap'
import useMainStore from '../../stores'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Magic } from 'react-bootstrap-icons'
import { Box3, Vector3 } from 'three'

const Model = ({ glbData }: { glbData: any }) => {
  const [scaleFactor, setScaleFactor] = useState(1)
  const [yPos, setYPos] = useState(0)
  const [xPos, setXPos] = useState(0)
  const { scene } = useGLTF(glbData) as any
  useEffect(() => {
    const bbox = new Box3().setFromObject(scene)
    const min = bbox.min
    const max = bbox.max
    const miny = Math.floor(min.y)
    const maxy = Math.floor(max.y)

    const yPos = (miny + maxy) / 2
    const xPos = (min.x + max.x) / 2
    const size = new Vector3()
    bbox.getSize(size)
    const scaleFactor = 4 / Math.max(size.x, size.y, size.z)

    setYPos(yPos)
    setXPos(xPos)
    setScaleFactor(scaleFactor)
  }, [scene])
  return (
    <primitive object={scene} position={[xPos, yPos, 0]} scale={scaleFactor} />
  )
}

const CreateRepositoryPage = () => {
  const user = useMainStore(state => state.user)
  const [title, setTitle] = useState('')
  const [tag1, setTag1] = useState('')
  const [tag2, setTag2] = useState('')
  const [tag3, setTag3] = useState('')
  const [status, setStatus] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [content, setContent] = useState('')
  const [gltfFile, setGltfFile] = useState<any>(null) // 추가: glTF 파일 상태
  const [glbData, setGlbData] = useState<any>(null)

  const navigate = useNavigate()

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value)
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
      }
      reader.readAsArrayBuffer(file)
    }
  }
  const generateDescription = async () => {
    // capture threejs canvas
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
    if (!title || !content || !tag1 || !gltfFile) {
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
    formData.append('title', title)
    formData.append('content', content)
    formData.append('tags', [tag1, tag2, tag3].join(','))
    formData.append('status', status)
    formData.append('fileGlb', gltfFile) // 추가: glTF 파일 추가

    try {
      await api.post.addPost(formData)
      navigate(`/${user?.userId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="create-repo-container">
      <h3>Create a new repository</h3>
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
              <Canvas gl={{ preserveDrawingBuffer: true }}>
                <Suspense fallback={null}>
                  {/* add light */}
                  <ambientLight intensity={5} />
                  <pointLight position={[10, 10, 10]} />
                  {/* <Environment preset="sunset" /> */}
                  <Model glbData={glbData} />
                  <OrbitControls />
                  <color attach="background" args={['#f0f0f0']} />
                </Suspense>
              </Canvas>
            </div>
            <Button onClick={generateDescription}>
              <Magic />
              Generate Description
            </Button>
          </>
        )}

        <hr />
        <div className="form-group">
          <Form.Label>Title</Form.Label>
          <Form.Control
            className="search-bar"
            type="text"
            placeholder="Repository name"
            value={title}
            onChange={e => setTitle(e.target.value)}></Form.Control>
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
              onChange={e => setTag1(e.target.value)}></Form.Control>
            <Form.Control
              className="search-bar"
              type="text"
              placeholder="Tag2"
              value={tag2}
              onChange={e => setTag2(e.target.value)}></Form.Control>
            <Form.Control
              className="search-bar"
              type="text"
              placeholder="Tag3"
              value={tag3}
              onChange={e => setTag3(e.target.value)}></Form.Control>
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
            onChange={() => setStatus('PUBLIC')}
          />
          <Form.Check
            type="radio"
            label="Private"
            name="status"
            id="private"
            value="PRIVATE"
            checked={status === 'PRIVATE'}
            onChange={() => setStatus('PRIVATE')}
          />
        </div>
        <hr />

        <input type="submit" className="btn-submit" value="등록" />
      </form>
    </div>
  )
}

export default CreateRepositoryPage
