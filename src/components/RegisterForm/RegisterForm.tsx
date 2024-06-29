import React, {useEffect, useState} from 'react';
import api from '../../apis';

const DUPLICATED = "Email already exists!";
const SUCCESS = "User registered successfully!";

const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
const pwdRegEx = /^[A-Za-z0-9]{8,20}$/

const emailCheck = (email:string) => {
    return emailRegEx.test(email);
}
const pwdCheck = (pwd:string) => {
    return pwdRegEx.test(pwd);
}
const RegisterForm = () => {
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [error, setError] = useState<string|null>(null);
    const [msg , setMsg] = useState("");
    const register = () => {
        if (!username.trim() || !password.trim()) { return; }
        if(!emailCheck(username)) {setError("Email format incorrect!"); return;}
        if(!pwdCheck(password)) {setError("Password must be 8-20 characters and include uppercase, lowercase, and numeric characters"); return;}
        api.signup(username, password)
            .then(response => {
                setMsg(response.data);
            });
    }

    useEffect(() => {
        if (msg === SUCCESS) {
            setError(null);
        } else if (msg === DUPLICATED) {
            setError(msg);
        }
    }, [msg]);

    return(
        <div>
            {msg !== SUCCESS &&(
                    <>
                        <input type={'email'} placeholder={'Email'} value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type={'password'} placeholder={'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={register}>Register</button>
                    </>
            )}
            {error && msg !== SUCCESS && (
                <div style={{ color: 'red' }}>
                    <span>{error}</span>
                </div>
            )}
            {msg === SUCCESS &&(
                <div style={{color:'green'}}>
                    <span>Welcome!</span>
                </div>
            )}
        </div>
    )
}

export default RegisterForm;
