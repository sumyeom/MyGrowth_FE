import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/Auth/LoginForm.vue';
import GoalSetup from '@/components/GoalSetup/GoalSetup.vue';
import RoutineList from '@/components/Routine/RoutineList.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginForm },
  { path: '/goal-setup', component: GoalSetup },
  { path: '/routines', component: RoutineList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
