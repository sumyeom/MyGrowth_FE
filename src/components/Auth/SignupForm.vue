<template>
  <div class="mg-auth-container mg-bg-gradient px-4">
    <div class="mg-card mg-card-p w-full max-w-sm sm:max-w-md">
      <h2 class="mg-title">
        회원가입
      </h2>
      <input v-model="email" type="text" placeholder="이메일 입력" class="mg-input mb-3" />
      <input v-model="password" type="password" placeholder="비밀번호 입력" class="mg-input mb-3" />
      <input v-model="name" type="text" placeholder="이름 입력" class="mg-input mb-3" />
      <input v-model="nickname" type="text" placeholder="닉네임 입력" class="mg-input" />
      <button @click="handleSignup" class="mg-btn mt-4">회원가입</button>
      <div class="mg-link-row">
        <AuthLinkButton :onClick="goLogin">이미 계정이 있으신가요?</AuthLinkButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import AuthLinkButton from './AuthLinkButton.vue'
import { signup } from "@/api/auth"; // 실제 API 연결 시 사용

const router = useRouter();
const email = ref("");
const name = ref("");
const nickname = ref("");
const password = ref("");

const handleSignup = async () => {
  try {
    await signup(email.value, name.value, nickname.value, password.value);
    alert("회원가입 성공!");
    router.push("/login");
  } catch (err) {
    const msg = err?.response?.data?.message || "회원가입 실패";
    alert(msg);
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
</style>
