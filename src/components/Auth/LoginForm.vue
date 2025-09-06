<template>
  <div class="auth-bg px-4">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-logo">🍀MyGrowth </span>
        <h2>로그인</h2>
      </div>

      <input
        v-model="email"
        type="text"
        placeholder="이메일 입력"
        class="auth-input mb-3"
      />
      <input
        v-model="password"
        type="password"
        placeholder="비밀번호 입력"
        class="auth-input"
      />

      <button @click="handleLogin" class="auth-btn main-btn" type="submit">로그인</button>

      <div class="mg-link-row">
        <AuthLinkButton :onClick="goFindId">아이디 찾기</AuthLinkButton>
        <span class="text-gray-300">|</span>
        <AuthLinkButton :onClick="goFindPw">비밀번호 찾기</AuthLinkButton>
      </div>

      <button class="mg-btn-sub mt-2" @click="goSignup">회원가입</button>

      <button @click="handleGoogleLogin" class="mg-btn mt-3 bg-red-500 hover:bg-red-600">Google로 로그인</button>
    </div>
  </div>
  
</template>
<script setup>
import { ref } from "vue";
import { login } from "@/api/auth"; // axios API 불러오기
import { useRouter } from 'vue-router';
import AuthLinkButton from './AuthLinkButton.vue'


const router = useRouter();
const email = ref("");
const password = ref("");

const goFindId = () => router.push("/find-id");
const goFindPw = () => router.push("/find-password");
const goSignup = () => router.push("/signup");

const handleLogin = async () => {
  try {
    const res = await login(email.value, password.value);
    
    alert("로그인 성공!");
    if(res.data.firstLogin){
      router.push("/goal-setup");
    }else{
      router.push("/routines");
    }
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

</style>