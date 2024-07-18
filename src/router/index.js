import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue'; // Componente Login
import TaskManagementView from '../views/TaskManagementView.vue'; // Componente TaskManagement

const routes = [
  { path: '/login', component: Login, name: 'Login' },
  { path:'/task', component: TaskManagementView, name: 'Task', meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('token');
  console.log(isAuthenticated);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;