<template>
  <div class="mg-auth-container mg-bg-gradient px-4">
    <div class="mg-card mg-card-p w-full max-w-md mx-auto">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-bold flex items-center gap-2">{{ currentMonthLabel }}</span>
        <div class="flex items-center gap-2">
          <button @click="goToProfile" class="text-2xl hover:scale-110 transition" title="프로필">
            👤
          </button>
          <button @click="addRoutine" class="text-2xl hover:scale-110 transition" title="루틴 추가">
            ➕
          </button>
          <button @click="toggleCalendar" class="text-2xl hover:scale-110 transition" title="달력">
            📅
          </button>
        </div>
      </div>

      <!-- 달력 -->
      <VCalendar
        v-if="showCalendar"
        v-model="selectedDate"
        :from-page="selectedDate"
        @dayclick="onDateChange"
        :attributes="attributes"
        class="mb-4 rounded-lg shadow-sm"
      />

      <!-- 요일 슬라이더 (주 단위) -->
      <div ref="sliderRef" class="keen-slider mb-4">
        <div v-for="(week, wIndex) in weeks" :key="wIndex" class="keen-slider__slide flex justify-between">
          <div
            v-for="(day, dIndex) in week"
            :key="dIndex"
            @click="selectDate(day)"
            class="flex flex-col items-center cursor-pointer"
          >
            <div class="text-sm mb-1">{{ day.label }}</div>
            <div
              class="w-12 h-12 flex items-center justify-center rounded-full transition-transform transition-colors duration-300"
              :class="day.date.toDateString() === selectedDate.toDateString()
                        ? 'bg-myBlue text-white scale-100'
                        : 'bg-gray-200 text-black'"
            >
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 루틴 리스트 -->
      <div class="p-0 space-y-3 routine-item">
        <div
          v-for="routine in routineList"
          :key="routine.id"
          class="routine-item"
        >
          <!-- 루틴 메인 카드 -->
          <div class="flex items-center bg-white rounded-2xl shadow p-3 space-x-3">
              <!-- 왼쪽 : 체크 + 제목 -->
            <!-- 체크 아이콘 -->
            <div class="flex items-center space-x-3 flex-1">
              <button
                @click="toggleCheck(routine)"
                class="w-8 h-8 flex items-center justify-center rounded-full border"
                :class="routine.isSuccess ? 'bg-mygreen text-white' : 'bg-gray-100 text-gray-400'"
              >
                <span v-if="routine.isSuccess">✔</span>
              </button>

              <!-- 내용 -->
              <div class="flex flex-col flex-1">
                <!-- 카테고리 태그 -->
                <!-- <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 w-fit">
                  {{ routine.category }}
                </span> -->
                <!-- 루틴 제목 -->
                <button
                  @click="toggleMenu(routine.id)"
                  class="text-base font-semibold mt-1 text-left hover:text-blue-600 transition-colors"
                >
                  {{ routine.title }}
                </button>
              </div>
            </div>

            <!-- 메뉴 드롭 다운 -->
            <div
              v-if="activeMenu===routine.id"
              class="bg-white border rounded-lg shadow-lg mt-2 py-1 mx-4"
            >
              <button
                @click="editRoutine(routine)"
                class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>수정하기</span>
              </button>
              <button
                @click="confirmDelete(routine)"
                class="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 삭제 확인 팝업 -->
      <div
        v-if="showDeleteRoutineConfirm"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        @click="cancelDelete"
      >
        <div
          class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full"
          @click.stop
        >
          <div class="text-center">
            <div class="mb-4">
              <span class="text-4xl">⚠️</span>
            </div>
            <h3 class="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</h3>
            <p class="text-gray-600 mb-6">{{ routineToDelete.title }}에 대한 기록이 전부 사라져요!</p>
            <div class="flex space-x-4">
              <button
                class="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-red-500 transition-colors" 
                @click="deleteConfirmRoutine"
              > 
                확인
              </button>
              <button
                class="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-500 transition-colors"
                @click="cancelDelete"
              >
                취소
              </button>

            </div>
          </div>
        </div>
      </div>

      <!-- 피드백 팝업 -->
      <div
        v-if="showPopup"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
          <!-- 닫기 버튼 -->
          <button
            @click="showPopup = false"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <!-- 내용 -->
          <!-- <h2 class="text-xl font-semibold mb-3">이번 주 AI 피드백 ✨</h2> -->
          <!-- <p class="text-gray-700 leading-relaxed"> -->
            <!-- {{ feedback }} -->

          <!-- </p> -->
          <p class="bg-white rounded-2xl shadow p-4 text-gray-800 text-center leading-relaxed">
          이번 주에는 
          <span class="font-semibold text-indigo-400">3개의 루틴 중 2개</span>
          를 달성했어요! <br />
          <span class="text-green-400 font-medium">꾸준히 잘하고 있어요 👏</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted  } from 'vue';
import { findByDateRoutine, routineCheckin, deleteRoutine } from '@/api/routine'; // eslint-disable-line no-unused-vars
import { useRouter } from 'vue-router';
import KeenSlider from 'keen-slider'; 
import 'keen-slider/keen-slider.min.css';

// 라우터 관련
const router = useRouter();

// 슬라이더 관련 변수
const sliderRef = ref(null);
let sliderInstance = null; // eslint-disable-line no-unused-vars

// 캘린더 클릭 시
const showCalendar = ref(false); 

// 오늘 날짜 -> 선택한 날짜
const selectedDate = ref(new Date());

// 피드백 팝업 보여주는 변수
const showPopup = ref(false);
const feedback = ref("");// eslint-disable-line no-unused-vars

// 루틴 수정/삭제 메뉴 보여주는 변수
const activeMenu = ref(null);

// 삭제 모달 보여줄지 변수
const showDeleteRoutineConfirm = ref(false);

const routineToDelete = ref(null);

// 캘린더 토글
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
}

// 캘린더에서 날짜 강조
const attributes = computed(() => [
  {
    key: 'selected',
    dates: [new Date(selectedDate.value)],
    highlight: {
      color: 'purple',
      fillMode: 'solid',
      contentClass: 'italic',
    },
  }
]);


// 달력에서 날짜 선택 시 주 이동
const onDateChange = (day) => {
  if (!day || !day.date) return;
  selectedDate.value = new Date(day.date);
  if (sliderInstance) {
    const index = weeks.value.findIndex(week => 
      week.some(d => d.date.toDateString() === day.date.toDateString())
    );
    if (index !== -1) sliderInstance.moveToIdx(index);
  }

  const formattedDate = formatDate(selectedDate.value);
  loadRoutine(formattedDate);
 
  showCalendar.value = false;

}


// 프로필 이동
const goToProfile = () => {
  router.push('/profile');
}

// 루틴 추가 이동
const addRoutine = () => {
  router.push('/routines-create'); 
}


// 선택된 날짜 포맷 변환 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 초기 기준 주 시작
const initialWeekStart = new Date();
initialWeekStart.setDate(initialWeekStart.getDate() - initialWeekStart.getDay());
const currentWeekStart = ref(new Date(initialWeekStart));

// 헤더 월 라벨
const currentMonthLabel = computed(() => {
  return `${selectedDate.value.getFullYear()}년 ${selectedDate.value.getMonth() + 1}월`;
});

// 선택한 날짜 기준 주 시작일(일요일)
const getWeekStart = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

// 주 단위 7일 배열
const getWeek = (startDate) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      date,
      label: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
    };
  });
};

// 12주 정도 미리 만들어서 슬라이딩 가능하게
const weeks = computed(() => {
  const result = [];
  const start = getWeekStart(initialWeekStart);
  start.setDate(start.getDate() - 7 * 50); // 이전 5주
  for (let i = 0; i < 101; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    result.push(getWeek(weekStart));
  }
  return result;
});

// 슬라이더에서 날짜 선택 시 날짜 변경
const selectDate = (day) => {
  selectedDate.value = day.date;
  const formattedDate = formatDate(selectedDate.value);
  loadRoutine(formattedDate);
}


// 루틴 리스트 배열
const routineList = ref([]);

// 루틴 데이터 로드
const loadRoutine = async (date) => {
  try{
    const res = await findByDateRoutine(date);
    routineList.value = res.data.content;
    console.log('루틴 리스트 :' , routineList.value);
    
  }catch(err){
    console.error('루틴 리스트 로드 실패 : ', err);
  }
}

// 루틴 체크인
async function toggleCheck(routine){
  routine.isSuccess = !routine.isSuccess;
  const formattedDate = formatDate(selectedDate.value);
  await routineCheckin(routine.id, formattedDate);
}

// 수정/삭제 토글 메뉴
const toggleMenu = (routineId) => {
  activeMenu.value = activeMenu.value === routineId ? null : routineId;
}

const closeMenu = (event) => {
  // 메뉴 외부 클릭 시 메뉴 닫기
  if (!event.target.closest('.routine-item')) {
    activeMenu.value = null;
  }
};

const editRoutine = (routine) => {
  router.push({ name: 'RoutineUpdate', params: { id: routine.id } });
}

// 삭제하기 버튼 눌렀을 때
const confirmDelete = (routine) =>{
  activeMenu.value = null; // 메뉴 닫기기
  routineToDelete.value = routine;
  showDeleteRoutineConfirm.value = true;
}


// 삭제하기 - 취소
const cancelDelete = () => {
  routineToDelete.value = null;
  showDeleteRoutineConfirm.value = false;
}

// 삭제하기 - 확인
const deleteConfirmRoutine = async () => {
  if(routineToDelete.value){
    // 루틴 삭제 API 호출
    await deleteRoutine(routineToDelete.value.id);

    // 루틴 리스트에서 삭제된 리스트 제거
    routineList.value = routineList.value.filter(
      routine => routine.id !== routineToDelete.value.id
    );
    cancelDelete();
  }
  
}

/* 라이프 사이클 */
// KeenSlider 초기화
onMounted(() => {
  sliderInstance = new KeenSlider(sliderRef.value, {
    slidesPerView: 1,
    spacing: 10,
    loop: true,
    slideChanged(s) {
      const firstVisibleIndex = s.track.details.rel;
      const newWeekStart = new Date(initialWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() + (firstVisibleIndex - 50) * 7);
      currentWeekStart.value = newWeekStart;
      }
  });

  //초기 선택 날짜 주로 이동
  const idx = weeks.value.findIndex(week => week.some(d => d.date.toDateString() === selectedDate.value.toDateString()));
  if (idx !== -1) sliderInstance.moveToIdx(idx);

  // 루틴 리스트 로드드
  const formattedDate = formatDate(selectedDate.value);
  loadRoutine(formattedDate);

  // 문서 클릭 시 메뉴 닫기
  document.addEventListener('click', closeMenu);
});


onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style>
.keen-slider__slide {
  flex-shrink: 0;
}

.keen-slider {
  overflow: hidden;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
