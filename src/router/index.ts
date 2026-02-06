import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/ai-config',
      name: 'AIConfig',
      component: () => import('../views/AIConfig.vue'),
      meta: { title: 'AI智能选配' }
    },
    {
      path: '/builder',
      name: 'Builder',
      component: () => import('../views/Builder.vue'),
      meta: { title: '模拟装机' }
    },
    {
      path: '/benchmark',
      name: 'Benchmark',
      component: () => import('../views/Benchmark.vue'),
      meta: { title: '跑分预测' }
    },
    {
      path: '/compare',
      name: 'Compare',
      component: () => import('../views/Compare.vue'),
      meta: { title: '商家比价' }
    },
    {
      path: '/diagnosis',
      name: 'Diagnosis',
      component: () => import('../views/Diagnosis.vue'),
      meta: { title: '问题诊断' }
    }
  ]
})

export default router
