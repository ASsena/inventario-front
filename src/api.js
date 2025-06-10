import axios from 'axios' 

const api = axios.create({
    baseURL: 'https://gerencimento-estoque-anepcqath2bqcmg8.eastus-01.azurewebsites.net',

})

export default api;