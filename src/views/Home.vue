<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: 'robot',
    title: 'AI智能选配',
    description: '根据预算和用途，AI为你推荐最优配置方案',
    color: '#667eea',
    path: '/ai-config'
  },
  {
    icon: 'tools',
    title: '模拟装机',
    description: '3D可视化装机过程，实时预览效果',
    color: '#00a870',
    path: '/builder'
  },
  {
    icon: 'chart-line',
    title: '跑分预测',
    description: '预测配置性能，对比主流硬件跑分',
    color: '#ed7b2f',
    path: '/benchmark'
  },
  {
    icon: 'chart-bar',
    title: '商家比价',
    description: '多平台价格对比，找到最优惠商家',
    color: '#0052d9',
    path: '/compare'
  },
  {
    icon: 'search',
    title: '问题诊断',
    description: 'AI排查装机问题，提供解决方案',
    color: '#e34d59',
    path: '/diagnosis'
  }
]

const stats = [
  { value: '50+', label: '硬件品牌' },
  { value: '1000+', label: '硬件型号' },
  { value: '10万+', label: '用户选择' },
  { value: '99.9%', label: '兼容性准确率' }
]

const quickBudgets = [
  { label: '入门级', budget: 3000, icon: 'desktop', description: '办公/轻度游戏' },
  { label: '主流级', budget: 6000, icon: 'laptop', description: '1080P高画质' },
  { label: '高端级', budget: 12000, icon: 'server', description: '2K/4K流畅' },
  { label: '旗舰级', budget: 25000, icon: 'cloud', description: '顶级性能' }
]

const handleQuickStart = (budget: number) => {
  router.push({ path: '/ai-config', query: { budget: budget.toString() } })
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">AI装机大师</span>
          </h1>
          <p class="hero-subtitle">
            从选配到装机，全程AI辅助，让装机变得简单高效
          </p>
          <div class="hero-actions">
            <t-button size="large" theme="primary" @click="router.push('/ai-config')">
              <template #icon><t-icon name="robot" /></template>
              开始智能选配
            </t-button>
            <t-button size="large" variant="outline" @click="router.push('/builder')">
              <template #icon><t-icon name="tools" /></template>
              自己动手装机
            </t-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="pc-showcase">
            <div class="pc-case-3d">
              <div class="case-front">
                <div class="case-glass"></div>
                <div class="rgb-glow"></div>
                <div class="component cpu"></div>
                <div class="component gpu"></div>
                <div class="component ram"></div>
              </div>
              <div class="case-side"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="hero-stats">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Quick Budget Section -->
    <section class="budget-section">
      <div class="section-header">
        <h2 class="section-title">快速开始</h2>
        <p class="section-subtitle">选择预算范围，AI为你推荐最优配置</p>
      </div>
      <div class="budget-grid">
        <div 
          v-for="item in quickBudgets" 
          :key="item.budget" 
          class="budget-card"
          @click="handleQuickStart(item.budget)"
        >
          <div class="budget-icon">
            <t-icon :name="item.icon" size="32px" />
          </div>
          <div class="budget-info">
            <div class="budget-label">{{ item.label }}</div>
            <div class="budget-price">¥{{ item.budget.toLocaleString() }}+</div>
            <div class="budget-desc">{{ item.description }}</div>
          </div>
          <t-icon name="chevron-right" class="budget-arrow" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">全方位的装机服务体验</p>
      </div>
      <div class="features-grid">
        <div 
          v-for="feature in features" 
          :key="feature.title" 
          class="feature-card"
          @click="router.push(feature.path)"
        >
          <div class="feature-icon" :style="{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}99 100%)` }">
            <t-icon :name="feature.icon" size="28px" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
          <div class="feature-link">
            了解更多 <t-icon name="arrow-right" />
          </div>
        </div>
      </div>
    </section>

    <!-- AI Highlight Section -->
    <section class="ai-section">
      <div class="ai-content">
        <div class="ai-text">
          <div class="ai-badge">
            <t-icon name="sparkles" />
            AI驱动
          </div>
          <h2 class="ai-title">智能对话，精准推荐</h2>
          <p class="ai-desc">
            只需告诉我们你的需求和预算，AI将为你分析最佳配置方案，
            并实时检测兼容性问题，确保每一个硬件都能完美配合。
          </p>
          <ul class="ai-features">
            <li><t-icon name="check-circle" /> 智能需求分析</li>
            <li><t-icon name="check-circle" /> 实时兼容性检测</li>
            <li><t-icon name="check-circle" /> 性价比优化</li>
            <li><t-icon name="check-circle" /> 问题自动诊断</li>
          </ul>
          <t-button theme="primary" size="large" @click="router.push('/ai-config')">
            体验AI选配
          </t-button>
        </div>
        <div class="ai-demo">
          <div class="chat-demo">
            <div class="chat-bubble ai">
              <div class="chat-avatar">🤖</div>
              <div class="chat-content">
                你好！我是AI装机助手。请告诉我你的预算和主要用途，我来为你推荐最合适的配置。
              </div>
            </div>
            <div class="chat-bubble user">
              <div class="chat-content">
                预算8000元左右，主要玩3A游戏
              </div>
            </div>
            <div class="chat-bubble ai">
              <div class="chat-avatar">🤖</div>
              <div class="chat-content">
                好的！针对你的需求，我推荐以下配置：
                <br><br>
                🔹 CPU: AMD Ryzen 7 7800X3D
                <br>
                🔹 GPU: RTX 4060 Ti
                <br>
                🔹 内存: 32GB DDR5
                <br><br>
                这套配置可以流畅运行各种3A大作...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 60px;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  padding: 60px 48px;
  margin-bottom: 48px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
  top: -200px;
  right: -100px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

/* PC 3D展示 */
.pc-showcase {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pc-case-3d {
  width: 280px;
  height: 350px;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateY(-20deg) rotateX(5deg);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: perspective(1000px) rotateY(-20deg) rotateX(5deg) translateY(0); }
  50% { transform: perspective(1000px) rotateY(-15deg) rotateX(8deg) translateY(-20px); }
}

.case-front {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%);
  border-radius: 12px;
  position: relative;
  box-shadow: 
    30px 30px 60px rgba(0, 0, 0, 0.5),
    inset 0 0 30px rgba(255, 255, 255, 0.02);
}

.case-glass {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rgb-glow {
  position: absolute;
  left: 8px;
  top: 25px;
  bottom: 25px;
  width: 4px;
  background: linear-gradient(180deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
  border-radius: 2px;
  animation: rgbFlow 3s linear infinite;
  box-shadow: 0 0 20px currentColor;
}

@keyframes rgbFlow {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.component {
  position: absolute;
  border-radius: 4px;
}

.component.cpu {
  top: 60px;
  left: 80px;
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, #4a4a4a, #333);
  border: 2px solid #555;
}

.component.gpu {
  top: 180px;
  left: 40px;
  width: 180px;
  height: 50px;
  background: linear-gradient(145deg, #3a3a3a, #222);
  border: 2px solid #444;
}

.component.gpu::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #444;
}

.component.ram {
  top: 60px;
  right: 40px;
  width: 15px;
  height: 80px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  animation: ramGlow 2s ease-in-out infinite;
}

@keyframes ramGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; box-shadow: 0 0 15px #667eea; }
}

.case-side {
  position: absolute;
  right: -20px;
  top: 10px;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, #1a1a1a, #0d0d0d);
  transform: skewY(-5deg);
  border-radius: 0 8px 8px 0;
}

/* Stats */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

/* Budget Section */
.budget-section {
  margin-bottom: 48px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.budget-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.budget-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 82, 217, 0.15);
}

.budget-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.budget-info {
  flex: 1;
}

.budget-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.budget-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.budget-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.budget-arrow {
  color: var(--text-secondary);
  font-size: 20px;
}

/* Features Section */
.features-section {
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.feature-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 82, 217, 0.12);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-link {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* AI Section */
.ai-section {
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
  border-radius: 24px;
  padding: 60px 48px;
}

.ai-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.ai-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.ai-desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
}

.ai-features {
  list-style: none;
  margin-bottom: 32px;
}

.ai-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.ai-features li .t-icon {
  color: var(--success-color);
}

/* Chat Demo */
.chat-demo {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.chat-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.chat-bubble.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.chat-bubble.ai .chat-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 16px 16px 16px 4px;
}

.chat-bubble.user .chat-content {
  background: #f3f4f6;
  color: var(--text-primary);
  border-radius: 16px 16px 4px 16px;
}

.chat-content {
  padding: 14px 18px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 280px;
}

@media (max-width: 1200px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .pc-showcase {
    display: none;
  }
  
  .budget-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .ai-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 24px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .budget-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .ai-section {
    padding: 40px 24px;
  }
}
</style>
