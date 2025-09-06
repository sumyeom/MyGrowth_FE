<template>
  <div class="mg-auth-container mg-bg-gradient px-4">
    <div class="mg-card mg-card-p w-full max-w-md mx-auto">
      <!-- 헤더 -->
      <div class="text-center mb-6">
        <h2 class="mg-title mb-2">프로필</h2>
        <p class="text-gray-600 text-sm">내 정보를 확인하고 편집하세요</p>
      </div>

      <!-- 프로필 사진 -->
      <div class="text-center mb-6">
        <div class="relative inline-block">
          <img 
            :src="profile.photo || '/default-avatar.png'" 
            :alt="profile.name"
            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button 
            @click="triggerFileUpload"
            class="absolute -bottom-2 -right-2 bg-myBlue text-white rounded-full p-2 hover:bg-blue-600 transition"
          >
            📷
          </button>
        </div>
        <input 
          ref="fileInput"
          type="file" 
          accept="image/*" 
          @change="handlePhotoChange"
          class="hidden"
        />
      </div>

      <!-- 편집 모드 토글 -->
      <div class="text-center mb-4">
        <button 
          @click="toggleEditMode"
          class="mg-btn-sub text-sm px-4 py-2"
        >
          {{ isEditing ? '취소' : '편집' }}
        </button>
      </div>

      <!-- 프로필 정보 폼 -->
      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- 이름 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input 
            v-model="profile.name"
            :readonly="!isEditing"
            type="text"
            class="mg-input"
            :class="{ 'bg-gray-100': !isEditing }"
            placeholder="이름을 입력하세요"
          />
        </div>

        <!-- 닉네임 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
          <input 
            v-model="profile.nickname"
            :readonly="!isEditing"
            type="text"
            class="mg-input"
            :class="{ 'bg-gray-100': !isEditing }"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        <!-- 자기소개 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
          <textarea 
            v-model="profile.selfIntroduction"
            :readonly="!isEditing"
            rows="3"
            class="mg-input resize-none"
            :class="{ 'bg-gray-100': !isEditing }"
            placeholder="자기소개를 입력하세요"
          ></textarea>
        </div>

        <!-- 저장 버튼 (편집 모드일 때만) -->
        <div v-if="isEditing" class="pt-4">
          <button type="submit" class="mg-btn w-full">
            저장하기
          </button>
        </div>
      </form>

      <!-- 로그아웃 버튼 -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <button 
          @click="handleLogout"
          class="w-full py-3 px-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition"
        >
          로그아웃
        </button>
      </div>

      <!-- 하단 네비게이션 -->
      <div class="mt-6 flex justify-center space-x-4">
        <button 
          @click="goToRoutines"
          class="text-myBlue hover:underline text-sm"
        >
          루틴으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getProfile, updateProfile } from '@/api/user';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout as apiLogout } from '@/api/auth';
import { tokenManager } from '@/api/axios';

const router = useRouter();
const fileInput = ref(null);
const isEditing = ref(false);


// 프로필 데이터
const profile = reactive({
  name: '',
  nickname: '',
  selfIntroduction: '',
  photo: null
});

// 편집 모드 토글
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 취소 시 원래 데이터로 복원
    loadProfile();
  }
};

// 파일 업로드 트리거
const triggerFileUpload = () => {
  if (isEditing.value) {
    fileInput.value.click();
  }
};

// 사진 변경 처리
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.photo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 프로필 저장
const handleSave = async () => {
  try {
    await updateProfile(profile.name, profile.nickname, profile.selfIntroduction);
    console.log('프로필 저장:', profile);
    alert('프로필이 저장되었습니다!');
    isEditing.value = false;
  } catch (error) {
    console.error('프로필 저장 실패:', error);
    alert('프로필 저장에 실패했습니다.');
  }
};

const handleLogout = async () => {
  if (confirm('정말 로그아웃하시겠습니까?')) {
    try {
      await apiLogout();              // 서버에 refresh 무효화 요청
    } catch (e) {
      // 서버 실패해도 클라 토큰 정리는 진행
    } finally {
      tokenManager.clearAccessToken(); // 메모리 토큰 삭제
      router.push('/login');
    }
  }
};

// 루틴으로 이동
const goToRoutines = () => {
  router.push('/routines');
};

// 프로필 데이터 로드
const loadProfile = async () => {
  try {
    const res = await getProfile();
    profile.name = res.data.name;
    profile.nickname = res.data.nickname;
    profile.selfIntroduction = res.data.selfIntroduction;
    profile.photo = null;
  } catch (error) {
    console.error('프로필 로드 실패:', error);
  }
};

// 컴포넌트 마운트 시 프로필 로드
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
/* 추가 스타일이 필요하면 여기에 */
</style>
