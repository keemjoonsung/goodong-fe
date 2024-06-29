import React, { useState } from 'react';
import axios from 'axios';
import "./CreateRepositoryPage.css"

const CreateRepositoryPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [gltfFile, setGltfFile] = useState<any>(null); // 추가: glTF 파일 상태

    const handleTitleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setGltfFile(event.target.files![0]);
    };

    const handleSubmit = async (event:React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('userId', localStorage.getItem("username") as string);
        formData.append('uploadDate', new Date().toISOString());
        // formData.append('file', gltfFile); // 추가: glTF 파일 추가

        try {
            const response = await axios.post('http://localhost:8000/repository/savepost', formData, {
                headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data === "success") {
                console.log(response);
                alert("저장소 등록 성공!");
                window.location.href = "http://localhost:3000/" + localStorage.getItem('username') + "/repository";
            } else {
                console.log(response);
                alert("이미 존재하는 타이틀 입니다.")
            }
        } catch (error) {
            console.error(error);
            // alert('로그인 세션 만료! 다시 로그인하세요.');
            // window.location.href = "http://localhost:3000/";
        }
    };

    return (
        <div className="container">
            <h3>Create a new repository</h3>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h6>Repository name *</h6>
                    <input type="text" id="title" name="title" value={title} onChange={handleTitleChange} style={{fontSize : 18}}/>
                </div>
                <div className="form-group">
                    <h6>Description *</h6>
                    <textarea id="content" name="content" value={content} onChange={handleContentChange} rows="4" cols="50" />
                </div>
                <hr/>
                <div className="form-group">
                    <label htmlFor="file" id="file-label">.glTF(필수)와 텍스쳐 파일(선택)가 포함된 zip파일 혹은 .glb 파일*</label>
                    <input type="file"  id="file" name="file" onChange={handleFileChange} />
                </div>
                <hr/>
                <input type="submit" className="btn-submit" value="등록" />
            </form>
        </div>
    );
};

export default CreateRepositoryPage;
