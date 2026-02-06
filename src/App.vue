<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { value: '/', label: '首页', icon: 'home' },
  { value: '/ai-config', label: 'AI智能选配', icon: 'robot' },
  { value: '/builder', label: '模拟装机', icon: 'tools' },
  { value: '/benchmark', label: '跑分预测', icon: 'chart-line' },
  { value: '/compare', label: '商家比价', icon: 'chart-bar' },
  { value: '/diagnosis', label: '问题诊断', icon: 'search' }
]

const activeMenu = ref(route.path)

const handleMenuChange = (value: string) => {
  router.push(value)
}
</script>

<template>
  <div class="app-container">
    <t-head-menu 
      v-model="activeMenu" 
      theme="light"
      @change="handleMenuChange"
    >
      <template #logo>
        <div class="logo">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">AI装机大师</span>
        </div>
      </template>
      
      <t-menu-item v-for="item in menuItems" :key="item.value" :value="item.value">
        <template #icon>
          <t-icon :name="item.icon" />
        </template>
        {{ item.label }}
      </t-menu-item>
      
      <template #operations>
        <t-button theme="primary" variant="text">
          <template #icon><t-icon name="user" /></template>
          登录
        </t-button>
      </template>
    </t-head-menu>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="app-footer">
      <p>© 2026 AI装机大师 - 智能硬件选配平台</p>
    </footer>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #0052d9 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-footer {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
  font-size: 13px;
  border-top: 1px solid var(--border-color);
}
</style>
