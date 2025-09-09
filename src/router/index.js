import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/Auth/LoginForm.vue';
import GoalSetup from '@/components/GoalSetup/GoalSetup.vue';
import RoutineList from '@/components/Routine/RoutineList.vue';
import RoutineCreate from '@/components/Routine/RoutineCreate.vue';
import RoutineUpdate from '@/components/Routine/RoutineUpdate.vue';
import SignupForm from '@/components/Auth/SignupForm.vue';
import FindIdForm from '@/components/Auth/FindIdForm.vue';
import FindPasswordForm from '@/components/Auth/FindPasswordForm.vue';
import Profile from '@/components/Profile/ProfileView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginForm },
  { 
    path: '/goal-setup', 
    component: GoalSetup,
    meta: { requiresAuth: true }
  },
  { path: '/routines',
     component: RoutineList,
     meta: { requiresAuth: true }
  },
  { path: '/routines-create',
    component: RoutineCreate,
    meta: { requiresAuth: true }
  },
  { path: '/routine-update/:id',
    name: 'RoutineUpdate', 
    component: RoutineUpdate,
    meta: { requiresAuth: true },
    props: true
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },
  { path: '/signup', component: SignupForm },
  { path: '/find-id', component: FindIdForm },
  { path: '/find-password', component: FindPasswordForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
