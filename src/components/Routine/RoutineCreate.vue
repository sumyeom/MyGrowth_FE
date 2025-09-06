<template>
  <div class="mg-auth-container mg-bg-gradient px-4">
    <div class="mg-card mg-card-p w-full max-w-md mx-auto">
      <h2 class="mg-title mb-4">새 루틴 만들기</h2>

      <form @submit.prevent="handleCreate" class="space-y-4">
        <!-- 루틴 제목 -->
         <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">루틴 제목</label>
            <input 
                v-model="routine.title"
                type="text"
                class="mg-input"
                placeholder="예: 아침 운동"
                required
            />
         </div>

         <!-- 루틴 설명 -->
         <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">루틴 설명</label>
            <input 
                v-model="routine.description"
                type="text"
                class="mg-input"
                placeholder="루틴을 설명해주세요"
                required
            />
         </div>

         <!-- 반복 설정 -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">반복 설정</label>
            <select v-model="routine.repeatType" class="mg-input" @change="onRepeatTypeChange">
                <option value="DAY_OF_WEEK" selected>주간</option>
                <option value="MONTHLY">월간</option>
                <option value="YEARLY">연간</option>
            </select>
        </div>

        <!-- 요일별 반복 선택 (원형 버튼) -->
        <div v-if="routine.repeatType === 'DAY_OF_WEEK'">
            <label class="block text-sm font-medium text-gray-700 mb-2">반복 요일 선택</label>
            <div class="flex justify-center gap-e flex-wrap">
                <button
                    v-for="(day,index) in weekDays"
                    :key="index"
                    type="button"
                    @click="toggleDayOfWeek(day.value)"
                    class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200"
                    :class="routine.daysOfWeek.includes(day.value) 
                        ? 'bg-myBlue text-white border-myBlue' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-myBlue'"
                >
                {{ day.label }}
                </button>
            </div>
        </div>

        <!-- 월별 반복 선택 (달력) -->
        <div v-if="routine.repeatType === 'MONTHLY'">
          <label class="block text-sm font-medium text-gray-700 mb-2">매월 날짜 선택</label>
          <VCalendar
            v-model="selectedDate"
            mode="date"
            :attributes="monthlyAttributes"
            @dayclick="onMonthlyDateSelect"
            class="rounded-lg shadow-sm mb-2"
          />
          <p v-if="routine.dayOfMonth" class="text-sm text-gray-600 text-center">
            선택된 날짜: <span class="font-semibold text-myBlue">{{ routine.dayOfMonth }}일</span>
          </p>
        </div>

        <!-- 연별 반복 선택 (날짜 입력) -->
        <div v-if="routine.repeatType === 'YEARLY'">
          <label class="block text-sm font-medium text-gray-700 mb-2">매년 날짜 선택</label>
          <VCalendar
            v-model="selectedDate"
            mode="date"
            :attributes="yearlyAttributes"
            @dayclick="onYearlyDateSelect"
            class="rounded-lg shadow-sm mb-2"
          />
          <p v-if="routine.dayOfYear" class="text-sm text-gray-600 text-center">
            선택된 날짜: <span class="font-semibold text-myBlue">{{ routine.dayOfYear }}</span>
          </p>
        </div>

        <!-- 목표 횟수 -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">주간 목표 횟수</label>
            <input 
                v-model="routine.goalCount" 
                type="number"
                class="mg-input"
                min="1"
                placeholder="목표를 설정해주세요"
                required
            />
        </div>

        <!-- 공개 여부 -->
        <div>
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">공개 여부</label>
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                    @click="routine.isPublic = !routine.isPublic">
                    <input 
                        type="checkbox" 
                        :checked="routine.isPublic"
                        class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                    />
                    <label 
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                </div>
            </div>
        </div>

        <!-- 시작일 -->
        <div>
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 flex-shrink-0 w-20">시작일</label>
                <div class="flex-1">
                    <v-date-picker v-model="selectedDate" class="w-full">
                        <template #default="{inputValue, inputEvents}">
                            <input 
                                class="mg-input w-full"
                                :value="inputValue"
                                v-on="inputEvents"
                                placeholder="날짜 선택"
                                readonly
                            />
                        </template>
                    </v-date-picker>
                </div>
            </div>
        </div>

        <!-- 종료일 -->
        <div>
            <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 flex-shrink-0 w-20">종료일</label>
                <div class="flex-1">
                    <v-date-picker 
                        v-model="selectedEndDate" 
                        :disabled="isEndDateDisabled"
                        :min-date="selectedDate"
                        class="w-full"
                    >
                        <template #default="{inputValue, inputEvents}">
                            <input 
                                class="mg-input w-full"
                                :value="inputValue"
                                v-on="inputEvents"
                                placeholder="날짜 선택"
                                readonly
                            />
                        </template>
                    </v-date-picker>
                </div>
            </div>
            <div class="mt-2 text-right">
                <label class="flex items-center justify-end text-sm text-gray-500">
                    <span class="mr-2">쭉 진행하실 건가요?</span>
                    <input
                        type="checkbox"
                        v-model="isEndDateDisabled"
                        class="form-checkbox h-4 w-4 text-myBlue rounded"
                    />
                </label>
            </div>
        </div>
        

         <!-- 버튼 -->
        <div class="flex gap-3 pt-4">
            <button type="button" @click="goBack" class="mg-btn-sub flex-1">
                취소
            </button>
            <button type="submit" class="mg-btn flex-1">
                루틴 생성
            </button>
        </div>
      </form>
    </div>
</div>
</template>
<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { DatePicker as VDatePicker } from 'v-calendar'; // eslint-disable-line no-unused-vars
import 'v-calendar/style.css';
import { useRouter } from 'vue-router';
import { createRoutine } from '@/api/routine';

const router = useRouter();

// 요일 데이터
const weekDays = [
    { label : '월', value : 'MONDAY'},
    { label : '화', value : 'TUESDAY'},
    { label : '수', value : 'WEDNESDAY'},
    { label : '목', value : 'THURSDAY'},
    { label : '금', value : 'FRIDAY'},
    { label : '토', value : 'SATURDAY'},
    { label : '일', value : 'SUNDAY'}
]

const selectedDate = ref(new Date());
const selectedEndDate = ref(null);
const isEndDateDisabled = ref(false);

// isEndDateDisabled 변수 변경될 때마다 실행
watch(isEndDateDisabled, (newValue)=>{
    if(newValue){
        selectedEndDate.value = null;
    }
})

// selectedEndDate가 설정되면 isEndDateDisabled 를 null로 설정
watch(selectedEndDate, (newValue) => {
    if(newValue!=null){
        isEndDateDisabled.value = false;
    }
})

const formattedDate = computed(() => {
    const date = selectedDate.value;
    if(!date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
})

// 루틴 데이터
const routine = reactive({
    title:'',
    description:'',
    repeatType: 'DAY_OF_WEEK', // 'k'를 'K'로 수정
    daysOfWeek: [],
    dayOfMonth: null, // null로 변경
    dayOfYear: null, // null로 변경
    goalCount:1,
    isPublic:true,
    startDate:formattedDate,
    endDate:null
})

// 연별 반복용 입력값
const monthInput = ref('');
const dayInput = ref('');

// 반복 타입 변경 시 초기화화
const onRepeatTypeChange = () => {
    routine.daysOfWeek = [];
    routine.dayOfMonth = null;
    routine.dayOfYear = null;
    monthInput.value = '';
    dayInput.value = '';
}

// 요일 토글
const toggleDayOfWeek = (dayValue) => {
    const index = routine.daysOfWeek.indexOf(dayValue);
    if(index > -1){
        routine.daysOfWeek.splice(index,1);
    }else{
        routine.daysOfWeek.push(dayValue);
    }
}

// 월별 날짜 선택
const onMonthlyDateSelect = (day) => {
  console.log(routine.dayOfMonth);
  routine.dayOfMonth = day.date.getDate();
  
};

// 연별 날짜 선택
const onYearlyDateSelect = (day) => {
  const month = (day.date.getMonth() + 1).toString().padStart(2, '0');
  const dayOfMonth = day.date.getDate().toString().padStart(2, '0');
  routine.dayOfYear = `${month}-${dayOfMonth}`;
  console.log(routine.dayOfYear);
};


// 달력 속성들 (선택된 날짜 강조)
const monthlyAttributes = computed(() => [
  {
    key: 'selected',
    dates: routine.dayOfMonth ? [new Date(2024, 0, routine.dayOfMonth)] : [],
    highlight: { 
      color: 'blue', 
      fillMode: 'solid',
      contentClass: 'font-bold'
    }
  }
]);

const yearlyAttributes = computed(() => [
  {
    key: 'selected',
    dates: routine.dayOfYear ? [new Date(2024, parseInt(routine.dayOfYear.split('-')[0]) - 1, parseInt(routine.dayOfYear.split('-')[1]))] : [],
    highlight: { 
      color: 'green', 
      fillMode: 'solid',
      contentClass: 'font-bold'
    }
  }
]);

const handleCreate = async () =>{
    try{
        // 유효성 검사
        if(routine.repeatType === 'DAY_OF_WEEK' && routine.daysOfWeek.length === 0){
            alert('최소 하나의 요일을 선택해주세요');
            return;
        } 
        if(routine.repeatType === 'MONTHLY' && routine.dayOfMonth===0){
            alert('월별 반복 날짜를 선택해주세요');
            return;
        } 
        if(routine.repeatType === 'YEARLY' && !routine.dayOfYear){
            alert('연별 반복 날짜를 선택해주세요');
            return;
        }
        console.log('API로 보내는 데이터:', routine); 
        await createRoutine(
            routine.title, 
            routine.description,
            routine.repeatType, 
            routine.daysOfWeek, 
            routine.dayOfMonth, 
            routine.dayOfYear, 
            routine.goalCount, 
            routine.isPublic, 
            routine.startDate, 
            routine.endDate
        );
        console.log('루틴 생성 : ', routine);
        alert('루틴이 생성되었습니다.')
        router.push("/routines")
    } catch(err){
        console.log('루틴 생성 실패 : ', err);
        alert('루틴 생성에 실패했습니다.')
    }
}

const goBack = () =>{
    router.push('/routines');
}
</script>
<style scoped>
/* 요일 버튼 호버 효과 */
button[type="button"]:hover {
  transform: scale(1.05);
}

/* 달력 스타일링 */
:deep(.vc-container) {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.vc-day-content) {
  font-weight: 500;
}

/* 토글 스위치의 CSS를 여기서 정의 */
.toggle-checkbox:checked {
  right: 0;
  border-color: #3c5677; /* 예시 색상: 파란색 */
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3c5677;; /* 예시 색상: 파란색 */
}

</style>