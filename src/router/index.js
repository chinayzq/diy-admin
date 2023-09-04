import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: Layout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: 'dashboard' },
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@/views/setting/index.vue'),
          meta: { title: 'setting' },
        },
      ],
    },
  ],
});
router.beforeEach((to, from, next) => {
  next();
});
export default router;
