import React, { useState } from 'react'
import './CreateRepositoryPage.css'
import api from '../../apis'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const CreateRepositoryPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [gltfFile, setGltfFile] = useState<any>(null) // 추가: glTF 파일 상태
  const navigate = useNavigate()

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGltfFile(event.target.files![0])
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('userId', localStorage.getItem('username') as string)
    formData.append('uploadDate', new Date().toISOString())
    formData.append('file', gltfFile) // 추가: glTF 파일 추가

    try {
      const response = await api.createPost(formData)
      if (response.data === 'success') {
        console.log(response)
        alert('저장소 등록 성공!')
        navigate(`/${localStorage.getItem('username')}/repository`)
      } else {
        console.log(response)
        alert('이미 존재하는 타이틀 입니다.')
      }
    } catch (error) {
      console.error(error)
      // alert('로그인 세션 만료! 다시 로그인하세요.');
      // window.location.href = "http://localhost:3000/";
    }
  }

  return (
    <div className="create-repo-container">
      <h3>Create a new repository</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Form.Label>Email</Form.Label>
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
            onChange={e => setContent(e.target.value)}></Form.Control>
        </div>
        <hr />
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
        <hr />
        <input type="submit" className="btn-submit" value="등록" />
      </form>
    </div>
  )
}

export default CreateRepositoryPage
