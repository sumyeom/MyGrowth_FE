import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/Auth/LoginForm.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
