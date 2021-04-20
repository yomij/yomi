import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
    name: 'Index',
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页',
    },
    component: () => import('../pages/index/index.vue'),
  },
  {
    path: '/photograph',
    name: 'Photograph',
    meta: {
      title: '摄影小站',
    },
    component: () => import('../pages/photograph/index.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
