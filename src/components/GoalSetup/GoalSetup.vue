<template>
    <div class="goal-wrapper">
        <div class="goal-card">
            <h2>이번달 목표를 설정해보세요!</h2>
            <p>이번달 달성하고 싶은 루틴 횟수를 입력해주세요</p>

            <input 
                type = "number"
                v-model.number = "goalCount"
                placeholder="횟수 입력"
                min="1"
            />
            <button @click="submitGoal" class="btn">확인</button>
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
.goal-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6b90d1, #9c5be6);
}
.goal-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  width: 350px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}
.input-box {
  width: 80%;
  padding: 10px;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.btn {
  width: 100%;
  padding: 12px;
  background: #2575fc;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.btn:hover {
  background: #1a5dcc;
}
</style>