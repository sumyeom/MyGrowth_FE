// eslint-disable-next-line no-unused-vars 
import { plainAxios, authAxios, tokenManager } from "./axios";


export function login(email, password) {
    return plainAxios.post("/auth/login", { email, password })
    .then(response => {
        //로그인 성공 시 accessToken을 메모리에 저장
        if(response.data.accessToken){
            tokenManager.setAccessToken(response.data.accessToken);
        }
        return response;
    });
}

export function signup(email, name, nickname, password) {
    return plainAxios.post("/auth/signup", { email, name, nickname, password });
}

export function logout(){
    return authAxios.post("/auth/logout")
    .finally(() => {
        //로그아웃 시 메모리의 토큰 제거
        tokenManager.clearAccessToken();
    });
}