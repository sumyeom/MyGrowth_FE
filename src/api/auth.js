// eslint-disable-next-line no-unused-vars 
import axios from "axios"; 

// Vue CLI 개발용 Proxy 적용(/api -> Spring boot) 
const API_URL = "/auth"; 

export function login(email, password) {
    return axios.post(`${API_URL}/login`, { email, password }); 
}