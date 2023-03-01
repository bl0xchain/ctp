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

const updateCurrency = async(currencyData, id, token) => {
    const response = await axios.put(API_URL+'/'+id, currencyData, getConfig(token))
    return response.data
}

const deleteCurrency = async(id, token) => {
    console.log(id)
    const response = await axios.delete(API_URL+'/'+id, getConfig(token))
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
    createCurrency,
    updateCurrency,
    deleteCurrency
}

export default currencyService;