// api/axios.js
import axios from "axios";

// 개발용 Proxy 적용
const BASE_URL = "/api";

// Token 관리를 위한 전역 변수 (메모리 저장)
let accessToken = null;
let isInitialized = false;

// Token 관리 함수들
export const tokenManager = {
    setAccessToken: (token) => {
      accessToken = token;
      isInitialized = true;
    },
    getAccessToken: () => accessToken,
    clearAccessToken: () => {
      accessToken = null;
      isInitialized = true;
    },
    isInitialized: () => isInitialized,
    // 앱 시작 시 토큰 복구 시도
    initializeToken: async () => {
      if (isInitialized) return;
      
      try {
        // refresh token으로 새 access token 요청
        const response = await plainAxios.post("/auth/refresh");
        accessToken = response.data.accessToken;
        isInitialized = true;
        return true;
      } catch (error) {
        // refresh token이 없거나 만료된 경우
        accessToken = null;
        isInitialized = true;
        return false;
      }
    }
  };

// JWT 포함 Axios 인스턴스
export const authAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // 쿠키 자동 전송을 위함
});

// 일반 Axios (JWT 없는 요청용)
export const plainAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // refresh token 쿠키 전송을 위함
});


// 요청 인터셉터: JWT 자동 추가
authAxios.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 아직 retry
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            
            try{
                // refresh token으로 새 accessToken 요청
                const response = await plainAxios.post("/auth/refresh")
                const newAccessToken = response.data.accessToken;

                // 새 토큰 저장
                tokenManager.setAccessToken(newAccessToken);

                // 원래 요청에 새 토큰 적용하여 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return authAxios(originalRequest);
            }catch(refreshError){
                //refresh 실패 시 로그아웃 처리
                tokenManager.clearAccessToken();
                //로그인 페이지로 리다이렉트 or 로그아웃 처리
                window.location.href="/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)