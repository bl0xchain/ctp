import axios from "axios"

const API_URL = '/api/users'

const register = async(userData) => {
    const response = await axios.post(API_URL, userData)

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const createUser = async(userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, userData, config)
    return response.data
}

const login = async(userData) => {
    const response = await axios.post(API_URL + '/login', userData)
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout,
    createUser
}

export default authService