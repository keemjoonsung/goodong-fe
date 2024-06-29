import React, {useEffect, useState} from 'react';
import api from '../../apis';

const SUCCESS = "Login Success!";
const FAIL = "Login Failed";
const LoginForm = ({setLoginModal, setIsLogin, setId}:{
    setLoginModal: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
    setId: React.Dispatch<React.SetStateAction<string>>
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const login = () => {
        if (!username.trim() || !password.trim()) { return; }
        
        api.login(username, password)
            .then(response => {
                setMsg(SUCCESS);
                const token = response.headers.getAuthorization?.toString() ?? '';
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('username',username);
                if (token) {
                    setLoginModal(false);
                    setIsLogin(true);
                    setId(username);
                }


            })
            .catch(e =>{
                setMsg(FAIL);
            });
    };
    return(
        <div>
        {msg !== SUCCESS &&(
            <>
                <input name={"username"} type={"email"} placeholder={"Email"} value={username} onChange={ (e) => setUsername(e.target.value)}/>
                <input name={"password"} type={"password"} placeholder={"Password"} value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <button onClick={login}> Login</button>
            </>
        )}
        {msg != "" && msg !== SUCCESS && (
            <div style={{ color: 'red' }}>
                <span>{msg}</span>
            </div>
        )}
        {msg === SUCCESS && (
            <>
                <span>{msg}</span>
            </>
        )}
        </div>

    )
}

export default LoginForm;
