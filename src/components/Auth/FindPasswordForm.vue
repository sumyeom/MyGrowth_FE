


<template>
  <div class="mg-auth-container mg-bg-gradient px-4">
    <div class="mg-card mg-card-p w-full max-w-sm sm:max-w-md">
      <h2 class="mg-title">
        비밀번호 찾기
      </h2>
      <input v-model="email" type="text" placeholder="이메일 입력" class="mg-input" />
      <button class="mg-btn mt-4" @click="findPw">비밀번호 찾기</button>
      <div class="mg-link-row">
        <AuthLinkButton :onClick="goLogin">로그인</AuthLinkButton>
        <span class="text-gray-300">|</span>
        <AuthLinkButton :onClick="goSignup">회원가입</AuthLinkButton>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import AuthLinkButton from "./AuthLinkButton.vue";
  const router = useRouter();
  const email = ref("");
  const findPw = () => alert("비밀번호 찾기(모의)");
  const goLogin = () => router.push("/login");
  const goSignup = () => router.push("/signup");
</script>
<style scoped>

</style>