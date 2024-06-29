import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

const login = (username:string, password:string) => { 
    return instance.post(
        '/login',
        { username, password },
    )
 }

const checkToken = (token:string) => { 
    return instance.get("/auth/expired", {headers: {Authorization : token}});
}

const signup = (username:string, password:string) => { 
    return instance.post('/register', { username, password })
 }

const getPostByUserId = (userId:string) => { 
    return instance.get('/repository/showpost', {
        params: {
            username: userId
        }
    });
 }

const getPost = (postId:string) => { 
    return instance.get("/repository/showpostByPostId", {
        params: {
            postId: postId
        }
    })
}

const searchPost = (keyword:string) => { 
    return instance.get("/repository/search", {
        params: {
            keyword: keyword
        }
    })
}

const api = Object.freeze({
    login,
    checkToken,
    signup,getPostByUserId,
    getPost
})

export default api;
