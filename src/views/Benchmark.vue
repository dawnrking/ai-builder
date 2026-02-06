<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CPU, GPU } from '../types'
import { cpuList, gpuList } from '../mock/hardware'

const selectedCpu = ref<CPU | null>(null)
const selectedGpu = ref<GPU | null>(null)
const isRunning = ref(false)
const progress = ref(0)
const currentTest = ref('')

interface BenchmarkScores {
  cpuSingle: number
  cpuMulti: number
  gpuGraphics: number
  gpu4K: number
  overall: number
}

const scores = ref<BenchmarkScores>({
  cpuSingle: 0,
  cpuMulti: 0,
  gpuGraphics: 0,
  gpu4K: 0,
  overall: 0
})

const benchmarkHistory = ref<Array<{
  id: string
  cpu: string
  gpu: string
  scores: BenchmarkScores
  date: Date
}>>([])

// 游戏预估帧数
const gamePerformance = computed(() => {
  if (!selectedGpu.value) return []
  
  const gpuScore = selectedGpu.value.benchmark || 0
  
  return [
    {
      name: '赛博朋克2077',
      image: '/images/game-cyberpunk.jpg',
      '1080p': Math.round(gpuScore / 250),
      '1440p': Math.round(gpuScore / 350),
      '4k': Math.round(gpuScore / 600)
    },
    {
      name: '艾尔登法环',
      image: '/images/game-eldenring.jpg',
      '1080p': Math.round(gpuScore / 200),
      '1440p': Math.round(gpuScore / 280),
      '4k': Math.round(gpuScore / 450)
    },
    {
      name: '荒野大镖客2',
      image: '/images/game-rdr2.jpg',
      '1080p': Math.round(gpuScore / 280),
      '1440p': Math.round(gpuScore / 400),
      '4k': Math.round(gpuScore / 650)
    },
    {
      name: 'CS2',
      image: '/images/game-cs2.jpg',
      '1080p': Math.round(gpuScore / 80),
      '1440p': Math.round(gpuScore / 120),
      '4k': Math.round(gpuScore / 200)
    },
    {
      name: '原神',
      image: '/images/game-genshin.jpg',
      '1080p': Math.round(gpuScore / 100),
      '1440p': Math.round(gpuScore / 140),
      '4k': Math.round(gpuScore / 220)
    }
  ]
})

// 性能等级评定
const performanceRating = computed(() => {
  const overall = scores.value.overall
  if (overall >= 80000) return { level: 'S+', color: '#ff6b6b', desc: '旗舰级性能' }
  if (overall >= 60000) return { level: 'S', color: '#ffa94d', desc: '高端游戏性能' }
  if (overall >= 45000) return { level: 'A', color: '#69db7c', desc: '主流游戏性能' }
  if (overall >= 30000) return { level: 'B', color: '#4dabf7', desc: '入门游戏性能' }
  if (overall >= 15000) return { level: 'C', color: '#748ffc', desc: '办公影音性能' }
  return { level: 'D', color: '#adb5bd', desc: '基础办公性能' }
})

// CPU性能对比数据
const cpuComparisonData = computed(() => {
  return cpuList.map(cpu => ({
    name: cpu.model,
    value: cpu.benchmark || 0
  })).sort((a, b) => b.value - a.value)
})

// GPU性能对比数据
const gpuComparisonData = computed(() => {
  return gpuList.map(gpu => ({
    name: gpu.model,
    value: gpu.benchmark || 0
  })).sort((a, b) => b.value - a.value)
})

const runBenchmark = async () => {
  if (!selectedCpu.value || !selectedGpu.value) return
  
  isRunning.value = true
  progress.value = 0
  
  const tests = [
    { name: 'CPU单核性能测试', duration: 1500 },
    { name: 'CPU多核性能测试', duration: 2000 },
    { name: 'GPU 3D渲染测试', duration: 2500 },
    { name: '4K光追性能测试', duration: 2000 },
    { name: '综合性能评分', duration: 1000 }
  ]
  
  const cpuBenchmark = selectedCpu.value?.benchmark || 30000
  const gpuBenchmark = selectedGpu.value?.benchmark || 15000
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    if (!test) continue
    currentTest.value = test.name
    await new Promise(resolve => setTimeout(resolve, test.duration))
    progress.value = ((i + 1) / tests.length) * 100
    
    // 模拟分数递增动画
    if (i === 0) {
      animateScore('cpuSingle', Math.round(cpuBenchmark / 10))
    } else if (i === 1) {
      animateScore('cpuMulti', cpuBenchmark)
    } else if (i === 2) {
      animateScore('gpuGraphics', gpuBenchmark)
    } else if (i === 3) {
      animateScore('gpu4K', Math.round(gpuBenchmark * 0.6))
    } else {
      animateScore('overall', cpuBenchmark + gpuBenchmark)
    }
  }
  
  // 保存测试记录
  benchmarkHistory.value.unshift({
    id: `bench-${Date.now()}`,
    cpu: selectedCpu.value.model,
    gpu: selectedGpu.value.model,
    scores: { ...scores.value },
    date: new Date()
  })
  
  isRunning.value = false
  currentTest.value = ''
}

const animateScore = (key: keyof BenchmarkScores, target: number) => {
  const start = scores.value[key]
  const diff = target - start
  const duration = 500
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // ease-out
    
    scores.value[key] = Math.round(start + diff * eased)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}

const resetScores = () => {
  scores.value = {
    cpuSingle: 0,
    cpuMulti: 0,
    gpuGraphics: 0,
    gpu4K: 0,
    overall: 0
  }
}

const getFpsColor = (fps: number) => {
  if (fps >= 120) return '#00a870'
  if (fps >= 60) return '#0052d9'
  if (fps >= 30) return '#ed7b2f'
  return '#e34d59'
}
</script>

<template>
  <div class="benchmark-page">
    <div class="page-header">
      <h1 class="page-title">跑分预测</h1>
      <p class="page-subtitle">预测配置性能，了解游戏表现</p>
    </div>
    
    <div class="benchmark-layout">
      <!-- 左侧配置选择和结果 -->
      <div class="main-section">
        <!-- 硬件选择 -->
        <div class="config-selector card">
          <h3 class="card-title">
            <t-icon name="setting" />
            选择测试配置
          </h3>
          
          <div class="selector-grid">
            <div class="selector-item">
              <label>CPU处理器</label>
              <t-select v-model="selectedCpu" placeholder="选择CPU" @change="resetScores">
                <t-option v-for="cpu in cpuList" :key="cpu.id" :value="cpu" :label="cpu.name">
                  <div class="option-content">
                    <span class="option-name">{{ cpu.name }}</span>
                    <span class="option-spec">{{ cpu.specs.cores }}核 {{ cpu.specs.boostClock }}GHz</span>
                  </div>
                </t-option>
              </t-select>
            </div>
            
            <div class="selector-item">
              <label>显卡</label>
              <t-select v-model="selectedGpu" placeholder="选择显卡" @change="resetScores">
                <t-option v-for="gpu in gpuList" :key="gpu.id" :value="gpu" :label="gpu.name">
                  <div class="option-content">
                    <span class="option-name">{{ gpu.name }}</span>
                    <span class="option-spec">{{ gpu.specs.vram }}GB {{ gpu.specs.vramType }}</span>
                  </div>
                </t-option>
              </t-select>
            </div>
          </div>
          
          <t-button 
            theme="primary" 
            size="large" 
            block 
            :loading="isRunning"
            :disabled="!selectedCpu || !selectedGpu"
            @click="runBenchmark"
          >
            <template #icon><t-icon name="play" /></template>
            {{ isRunning ? currentTest : '开始性能测试' }}
          </t-button>
          
          <t-progress 
            v-if="isRunning" 
            :percentage="progress" 
            theme="plump" 
            color="#667eea"
            style="margin-top: 16px"
          />
        </div>
        
        <!-- 跑分结果 -->
        <div class="scores-section card" v-if="scores.overall > 0">
          <h3 class="card-title">
            <t-icon name="chart-line" />
            性能评分
          </h3>
          
          <div class="overall-score">
            <div class="score-circle" :style="{ borderColor: performanceRating.color }">
              <div class="score-value">{{ scores.overall.toLocaleString() }}</div>
              <div class="score-label">综合跑分</div>
            </div>
            <div class="rating-badge" :style="{ backgroundColor: performanceRating.color }">
              {{ performanceRating.level }}
            </div>
            <div class="rating-desc">{{ performanceRating.desc }}</div>
          </div>
          
          <div class="score-details">
            <div class="score-item">
              <div class="score-header">
                <span class="score-name">CPU单核</span>
                <span class="score-number">{{ scores.cpuSingle.toLocaleString() }}</span>
              </div>
              <t-progress :percentage="scores.cpuSingle / 60" :showLabel="false" color="#667eea" />
            </div>
            
            <div class="score-item">
              <div class="score-header">
                <span class="score-name">CPU多核</span>
                <span class="score-number">{{ scores.cpuMulti.toLocaleString() }}</span>
              </div>
              <t-progress :percentage="scores.cpuMulti / 600" :showLabel="false" color="#764ba2" />
            </div>
            
            <div class="score-item">
              <div class="score-header">
                <span class="score-name">GPU图形</span>
                <span class="score-number">{{ scores.gpuGraphics.toLocaleString() }}</span>
              </div>
              <t-progress :percentage="scores.gpuGraphics / 360" :showLabel="false" color="#00a870" />
            </div>
            
            <div class="score-item">
              <div class="score-header">
                <span class="score-name">4K光追</span>
                <span class="score-number">{{ scores.gpu4K.toLocaleString() }}</span>
              </div>
              <t-progress :percentage="scores.gpu4K / 220" :showLabel="false" color="#ed7b2f" />
            </div>
          </div>
        </div>
        
        <!-- 游戏性能预估 -->
        <div class="game-performance card" v-if="selectedGpu">
          <h3 class="card-title">
            <t-icon name="gamepad" />
            游戏帧数预估
          </h3>
          
          <div class="game-list">
            <div v-for="game in gamePerformance" :key="game.name" class="game-item">
              <div class="game-info">
                <div class="game-icon">🎮</div>
                <div class="game-name">{{ game.name }}</div>
              </div>
              <div class="fps-grid">
                <div class="fps-item">
                  <div class="fps-label">1080P</div>
                  <div class="fps-value" :style="{ color: getFpsColor(game['1080p']) }">
                    {{ game['1080p'] }} FPS
                  </div>
                </div>
                <div class="fps-item">
                  <div class="fps-label">1440P</div>
                  <div class="fps-value" :style="{ color: getFpsColor(game['1440p']) }">
                    {{ game['1440p'] }} FPS
                  </div>
                </div>
                <div class="fps-item">
                  <div class="fps-label">4K</div>
                  <div class="fps-value" :style="{ color: getFpsColor(game['4k']) }">
                    {{ game['4k'] }} FPS
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="fps-legend">
            <span class="legend-item"><span class="dot" style="background:#00a870"></span>流畅 (≥120)</span>
            <span class="legend-item"><span class="dot" style="background:#0052d9"></span>良好 (≥60)</span>
            <span class="legend-item"><span class="dot" style="background:#ed7b2f"></span>可玩 (≥30)</span>
            <span class="legend-item"><span class="dot" style="background:#e34d59"></span>卡顿 (&lt;30)</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧对比图表 -->
      <div class="chart-section">
        <!-- CPU排行 -->
        <div class="chart-card card">
          <h3 class="card-title">
            <t-icon name="cpu" />
            CPU性能天梯
          </h3>
          <div class="chart-list">
            <div 
              v-for="(item, index) in cpuComparisonData" 
              :key="item.name" 
              :class="['chart-item', { active: selectedCpu?.model === item.name }]"
            >
              <div class="chart-rank">{{ index + 1 }}</div>
              <div class="chart-info">
                <div class="chart-name">{{ item.name }}</div>
                <div class="chart-bar-container">
                  <div 
                    class="chart-bar" 
                    :style="{ 
                      width: `${(item.value / (cpuComparisonData[0]?.value || 1)) * 100}%`,
                      background: selectedCpu?.model === item.name ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#e5e7eb'
                    }"
                  ></div>
                </div>
              </div>
              <div class="chart-score">{{ item.value.toLocaleString() }}</div>
            </div>
          </div>
        </div>
        
        <!-- GPU排行 -->
        <div class="chart-card card">
          <h3 class="card-title">
            <t-icon name="image" />
            GPU性能天梯
          </h3>
          <div class="chart-list">
            <div 
              v-for="(item, index) in gpuComparisonData" 
              :key="item.name" 
              :class="['chart-item', { active: selectedGpu?.model === item.name }]"
            >
              <div class="chart-rank">{{ index + 1 }}</div>
              <div class="chart-info">
                <div class="chart-name">{{ item.name }}</div>
                <div class="chart-bar-container">
                  <div 
                    class="chart-bar" 
                    :style="{ 
                      width: `${(item.value / (gpuComparisonData[0]?.value || 1)) * 100}%`,
                      background: selectedGpu?.model === item.name ? 'linear-gradient(90deg, #00a870, #00c896)' : '#e5e7eb'
                    }"
                  ></div>
                </div>
              </div>
              <div class="chart-score">{{ item.value.toLocaleString() }}</div>
            </div>
          </div>
        </div>
        
        <!-- 测试历史 -->
        <div class="history-card card" v-if="benchmarkHistory.length > 0">
          <h3 class="card-title">
            <t-icon name="history" />
            测试记录
          </h3>
          <div class="history-list">
            <div v-for="record in benchmarkHistory.slice(0, 5)" :key="record.id" class="history-item">
              <div class="history-config">
                <div class="history-cpu">{{ record.cpu }}</div>
                <div class="history-gpu">{{ record.gpu }}</div>
              </div>
              <div class="history-score">{{ record.scores.overall.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.benchmark-page {
  min-height: calc(100vh - 200px);
}

.benchmark-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 配置选择 */
.config-selector {
  padding: 24px;
}

.selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.selector-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-name {
  font-weight: 500;
}

.option-spec {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 跑分结果 */
.scores-section {
  padding: 24px;
}

.overall-score {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.score-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #f8faff, #eef2ff);
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
}

.score-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.rating-badge {
  display: inline-block;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  padding: 8px 24px;
  border-radius: 30px;
  margin-bottom: 8px;
}

.rating-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.score-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.score-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.score-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.score-number {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* 游戏性能 */
.game-performance {
  padding: 24px;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.game-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.game-icon {
  font-size: 24px;
}

.game-name {
  font-size: 14px;
  font-weight: 500;
}

.fps-grid {
  display: flex;
  gap: 24px;
}

.fps-item {
  text-align: center;
}

.fps-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.fps-value {
  font-size: 14px;
  font-weight: 700;
}

.fps-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 图表区域 */
.chart-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  padding: 20px;
}

.chart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

.chart-item.active {
  background: rgba(102, 126, 234, 0.1);
}

.chart-rank {
  width: 24px;
  height: 24px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.chart-item:first-child .chart-rank {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #fff;
}

.chart-item:nth-child(2) .chart-rank {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #fff;
}

.chart-item:nth-child(3) .chart-rank {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: #fff;
}

.chart-info {
  flex: 1;
  min-width: 0;
}

.chart-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-bar-container {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.chart-score {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 50px;
  text-align: right;
}

/* 历史记录 */
.history-card {
  padding: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.history-cpu {
  font-size: 12px;
  font-weight: 500;
}

.history-gpu {
  font-size: 11px;
  color: var(--text-secondary);
}

.history-score {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 1200px) {
  .benchmark-layout {
    grid-template-columns: 1fr;
  }
  
  .selector-grid {
    grid-template-columns: 1fr;
  }
  
  .score-details {
    grid-template-columns: 1fr;
  }
}
</style>
