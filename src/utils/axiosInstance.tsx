import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 JWT 토큰 가져와서 Authorization 헤더에 넣기
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 공통 처리
    if (error.response?.status === 401) {
      console.warn('인증이 만료되었거나 유효하지 않습니다.');
      // TODO: refresh token 로직 또는 로그인 페이지로 리다이렉트 등
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
