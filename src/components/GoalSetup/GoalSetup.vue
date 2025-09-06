<template>
    <div class="mg-auth-container mg-bg-gradient px-4">
        <div class="mg-card mg-card-p w-full max-w-sm sm:max-w-md">
            <h2 class="mg-title">
                이번달 목표를 설정해보세요!
            </h2>
            <p class="text-gray-600 text-sm mb-4">이번달 달성하고 싶은 루틴 횟수를 입력해주세요</p>

            <input 
                type = "number"
                v-model.number = "goalCount"
                placeholder="횟수 입력"
                min="1"
                class="mg-input mb-3"
            />
            <button @click="submitGoal" class="mg-btn mt-2">확인</button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const goalCount = ref(0);
const router = useRouter();

const submitGoal = () => {
    if(!goalCount.value || goalCount.value <= 0){
        alert("올바른 횟수를 입력해주세요!");
        return;
    }

    console.log("목표 : ",goalCount.value);
    router.push({ path:'/routines', query : {goal:goalCount.value}});
    
}
</script>
<style scoped>
</style>
