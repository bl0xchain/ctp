import axios from "axios"
const API_URL = '/api/currencies'

const getCurrencies = async() => {
    const response = await axios.get(API_URL)
    return response.data
}

const createCurrency = async(currencyData, token) => {
    const response = await axios.post(API_URL, currencyData, getConfig(token))
    return response.data
}

const getConfig = (token) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

const currencyService = {
    getCurrencies,
    createCurrency
}

export default currencyService;