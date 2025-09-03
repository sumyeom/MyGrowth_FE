<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2 class="title">MyGrowth 로그인</h2>

      <!-- 이메일/비밀번호 입력 -->
      <input 
        v-model="email"
        type="text"
        placeholder="이메일 입력"
        class="input-box"
      />
      <input 
        v-model="password"
        type="password"
        placeholder="비밀번호 입력"
        class="input-box"
      />

      <!-- 로그인 버튼 -->
      <button @click="handleLogin" class="btn login-btn">로그인</button>

      <!-- 아이디/비번 찾기 -->
      <div class="link-row">
        <a href="#">아이디 찾기</a>
        <span>|</span>
        <a href="#">비밀번호 찾기</a>
      </div>

      <!-- 회원가입 -->
      <div class="link-row">
        <a href="#">회원가입</a>
      </div>

      <!-- 구글 로그인 -->
      <button @click="handleGoogleLogin" class="btn google-btn">
        <i class="fab fa-google"></i> Google로 로그인
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { login } from "@/api/auth"; // axios API 불러오기
import { useRouter } from 'vue-router';


const router = useRouter();
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const res = await login(email.value, password.value);
    console.log("로그인 성공, 토큰:", res.data.accessToken);
    localStorage.setItem("jwt", res.data.accessToken);
    alert("로그인 성공!");
    router.push("/goal-setup");
  } catch (err) {
    console.error("에러 전체:", err);
    console.error("응답 데이터:", err.response?.data);
    console.error("응답 상태:", err.response?.status); 
    alert("로그인 실패");
  }
};

const handleGoogleLogin = () => {
  console.log("구글 로그인 시도");
  // TODO: Google OAuth URL로 리다이렉트
};
</script>
<style scoped>
/* 배경 */
.login-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #9c5be6, #6b90d1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 카드 */
.login-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  width: 350px;
  text-align: center;
}

/* 타이틀 */
.title {
  margin-bottom: 30px;
  color: #333;
  font-weight: 700;
  font-size: 24px;
}

/* 입력창 */
.input-box {
  width: 90%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: all 0.2s;
}

.input-box:focus {
  outline: none;
  border-color: #2575fc;
  box-shadow: 0 0 5px rgba(37,117,252,0.5);
}

/* 버튼 */
.btn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.login-btn {
  background-color: #2575fc;
  color: white;
}

.login-btn:hover {
  background-color: #1a5dcc;
}

.google-btn {
  background-color: #db4437;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.google-btn:hover {
  background-color: #c23321;
}

/* 링크 */
.link-row {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

.link-row a {
  color: #2575fc;
  text-decoration: none;
}

.link-row a:hover {
  text-decoration: underline;
}

.link-row span {
  margin: 0 5px;
  color: #999;
}
</style>