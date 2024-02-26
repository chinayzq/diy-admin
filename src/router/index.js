import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/order',
      component: Layout,
      children: [
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '用户' },
        },
        {
          path: '/user/detail',
          name: 'userDetail',
          component: () => import('@/views/user/model/detail.vue'),
          meta: {
            title: '用户详情',
            detail: true,
            parrentPath: '/user',
          },
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/order/index.vue'),
          meta: { title: '订单管理' },
        },
        {
          path: '/order/detail',
          name: 'orderDetail',
          component: () => import('@/views/order/model/detail.vue'),
          meta: {
            title: '订单详情',
            detail: true,
            parrentPath: '/order',
          },
        },
        {
          path: '/model',
          name: 'model',
          component: () => import('@/views/model/index.vue'),
          meta: { title: '机型' },
        },
        {
          path: '/stickerModel',
          name: 'stickerModel',
          component: () => import('@/views/stickerModel/index.vue'),
          meta: { title: '贴纸机型' },
        },
        {
          path: '/sticker',
          name: 'sticker',
          component: () => import('@/views/sticker/index.vue'),
          meta: { title: '贴纸' },
        },
        {
          path: '/stickerList',
          name: 'stickerList',
          component: () => import('@/views/stickerList/index.vue'),
          meta: { title: '贴纸' },
        },
        {
          path: '/template',
          name: 'template',
          component: () => import('@/views/template/index.vue'),
          meta: { title: '模板' },
        },
        {
          path: '/stickerTemplate',
          name: 'stickerTemplate',
          component: () => import('@/views/stickerTemplate/index.vue'),
          meta: { title: '模板' },
        },
        {
          path: '/template/detail',
          name: 'phoneTemplateDetail',
          component: () => import('@/views/template/model/detail.vue'),
          meta: {
            title: '模板详情',
            detail: true,
            parrentPath: '/template',
          },
        },
        {
          path: '/stickerTemplate/detail',
          name: 'templateDetail',
          component: () => import('@/views/stickerTemplate/model/detail.vue'),
          meta: {
            title: '模板详情',
            detail: true,
            parrentPath: '/stickerTemplate',
          },
        },
        {
          path: '/dictionary',
          name: 'dictionary',
          component: () => import('@/views/dictionary/index.vue'),
          meta: { title: '数据字典' },
        },
        {
          path: '/pageConfig',
          name: 'pageConfig',
          component: () => import('@/views/pageConfig/index.vue'),
          meta: { title: '页面配置' },
        },
        {
          path: '/coupon',
          name: 'coupon',
          component: () => import('@/views/coupon/index.vue'),
          meta: { title: '优惠券' },
        },
        {
          path: '/partner',
          name: 'partner',
          component: () => import('@/views/partner/index.vue'),
          meta: { title: '合作网红' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentRoleId = localStorage.getItem('diy-role-id');
  console.log('to', to);
  if (
    currentRoleId === '2' &&
    !['/order/detail', '/order', '/login', '/coupon', '/partner'].includes(
      to.path
    )
  ) {
    next('/order');
    return;
  }
  next();
});
export default router;
