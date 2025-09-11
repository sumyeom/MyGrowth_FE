<template>
    <div class="mg-auth-container mg-bg-gradient px-4">
        <div class="mg-card mg-card-p w-full max-w-md mx-auto">
            <div class="flex flex-col items-center p-4">
                <h2 class="text-xl font-bold mb-4">성공률</h2>
            
                <!-- 주간/월간 원형 Progress 나란히 -->
                <div class="flex gap-8">
                    <div class="flex flex-col items-center">
                    <Doughnut v-if="weeklyData" :data="weeklyData" :options="chartOptions" class="w-40 h-40"/>
                    <p class="mt-2 font-semibold">{{ weeklyRate }}% (이번 주)</p>
                    </div>
                    <div class="flex flex-col items-center">
                    <Doughnut v-if="monthlyData" :data="monthlyData" :options="chartOptions" class="w-40 h-40"/>
                    <p class="mt-2 font-semibold">{{ monthlyRate }}% (이번 달)</p>
                    </div>
                </div>
            </div>

            <div class="w-full bg-rose-100 rounded-lg border border-gray-100 overflow-hidden p-2">
                <!-- 설명 텍스트 -->
                <p class="text-sm font-medium text-gray-700 mb-3">이번주 달성 횟수 / 목표 횟수</p>
                <div
                    class="bg-rose-500 h-6 text-white text-sm flex-1 items-center justify-center transition-all duration-500"
                    :style="{ width: Math.min(100, (weeklySuccess / weeklyGoal) * 100) + '%' }"
                    >
                    {{ weeklySuccess }} / {{ weeklyGoal }}
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { getSuccessRate } from '@/api/routine';

// Chart.js에 필요한 요소 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// 성공률 예시
const weeklyRate = ref(0);
const monthlyRate = ref(0);
const weeklyGoal = ref(0);
const weeklySuccess = ref(0);

const loadSuccessRate = async () => {
    try{
        const res = await getSuccessRate();
        weeklyRate.value = res.data.week;
        monthlyRate.value = res.data.month;
        weeklyGoal.value = res.data.weeklyGoal;
        weeklySuccess.value = res.data.weeklySuccess;
        console.log('통계 로드 weekly : ',weeklyRate.value);
        console.log('통계 로드 monthly : ',monthlyRate.value);
        console.log('통계 로드 weeklyGoal : ',weeklyGoal.value);
        console.log('통계 로드 weeklySuccess : ',weeklySuccess.value);
    } catch(err) {
        console.log('통계 로드 실패 : ',err);
    }
};

// Chart 데이터 (reactive로 감싸서 안전하게 렌더링)
const weeklyData = computed(() =>({
    labels: ['성공', '실패'],
    datasets: [
        { data: [weeklyRate.value, 100 - weeklyRate.value], backgroundColor: ["#36A2EB", '#e5e7eb'], borderWidth: 0 }
    ]
}));

const monthlyData = computed(() =>({
    labels: ['성공', '실패'],
    datasets: [
        { data: [monthlyRate.value, 100 - monthlyRate.value], backgroundColor: ["#36A2EB", '#e5e7eb'], borderWidth: 0 }
    ]
}));

// 공통 옵션
const chartOptions = reactive({
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
});

// eslint-disable-next-line no-undef
// const props = defineProps({
//     current : { type:Number, required:true}, // 현재 달성 횟수
//     goal:{ type:Number, required:true}, // 목표횟수
// })

// 퍼센트 계산
// const percentage = computed(() => 
//     props.goal > 0 ? Math.round((props.current / props.goal) * 100) : 0
// );

onMounted(() => {
    loadSuccessRate();
});
</script>
  
<style></style>