<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HardwareType, CPU, GPU, RAM, Motherboard, PSU, Cooler, Case, CompatibilityIssue } from '../types'
import { cpuList, gpuList, ramList, storageList, motherboardList, psuList, coolerList, caseList } from '../mock/hardware'

interface ConfigItem {
  type: HardwareType
  label: string
  icon: string
  color: string
  selected: any
  options: any[]
}

const configItems = ref<ConfigItem[]>([
  { type: 'cpu', label: 'CPU处理器', icon: 'cpu', color: '#667eea', selected: null, options: cpuList },
  { type: 'gpu', label: '显卡', icon: 'image', color: '#00a870', selected: null, options: gpuList },
  { type: 'motherboard', label: '主板', icon: 'dashboard', color: '#ed7b2f', selected: null, options: motherboardList },
  { type: 'ram', label: '内存', icon: 'server', color: '#0052d9', selected: null, options: ramList },
  { type: 'storage', label: '存储', icon: 'hard-drive', color: '#e34d59', selected: null, options: storageList },
  { type: 'psu', label: '电源', icon: 'power-off', color: '#8b5cf6', selected: null, options: psuList },
  { type: 'cooler', label: '散热器', icon: 'refresh', color: '#06b6d4', selected: null, options: coolerList },
  { type: 'case', label: '机箱', icon: 'desktop', color: '#64748b', selected: null, options: caseList }
])

const activeCategory = ref<HardwareType>('cpu')
const showSelector = ref(false)

const currentOptions = computed(() => {
  const item = configItems.value.find(i => i.type === activeCategory.value)
  return item?.options || []
})

const totalPrice = computed(() => {
  return configItems.value.reduce((sum, item) => {
    return sum + (item.selected?.price || 0)
  }, 0)
})

const totalTDP = computed(() => {
  return configItems.value.reduce((sum, item) => {
    if (item.type === 'cpu' || item.type === 'gpu') {
      return sum + (item.selected?.specs?.tdp || item.selected?.tdp || 0)
    }
    return sum
  }, 0)
})

const compatibilityIssues = computed<CompatibilityIssue[]>(() => {
  const issues: CompatibilityIssue[] = []
  
  const cpu = configItems.value.find(i => i.type === 'cpu')?.selected as CPU | null
  const motherboard = configItems.value.find(i => i.type === 'motherboard')?.selected as Motherboard | null
  const gpu = configItems.value.find(i => i.type === 'gpu')?.selected as GPU | null
  const psu = configItems.value.find(i => i.type === 'psu')?.selected as PSU | null
  const pcCase = configItems.value.find(i => i.type === 'case')?.selected as Case | null
  const cooler = configItems.value.find(i => i.type === 'cooler')?.selected as Cooler | null
  const ram = configItems.value.find(i => i.type === 'ram')?.selected as RAM | null
  
  // CPU和主板插槽匹配检查
  if (cpu && motherboard) {
    if (cpu.specs.socket !== motherboard.specs.socket) {
      issues.push({
        type: 'error',
        code: 'SOCKET_MISMATCH',
        message: `CPU插槽 ${cpu.specs.socket} 与主板插槽 ${motherboard.specs.socket} 不兼容`,
        affectedParts: ['cpu', 'motherboard'],
        suggestion: `请选择支持 ${cpu.specs.socket} 插槽的主板，或更换CPU`
      })
    }
  }
  
  // 内存类型检查
  if (ram && motherboard) {
    if (ram.specs.type !== motherboard.specs.memoryType) {
      issues.push({
        type: 'error',
        code: 'MEMORY_TYPE_MISMATCH',
        message: `内存类型 ${ram.specs.type} 与主板支持的 ${motherboard.specs.memoryType} 不兼容`,
        affectedParts: ['ram', 'motherboard'],
        suggestion: `请选择 ${motherboard.specs.memoryType} 类型的内存`
      })
    }
  }
  
  // 电源功率检查
  if (psu && totalTDP.value > 0) {
    const recommendedWattage = totalTDP.value * 1.3
    if (psu.specs.wattage < recommendedWattage) {
      issues.push({
        type: 'warning',
        code: 'PSU_UNDERPOWERED',
        message: `电源功率 ${psu.specs.wattage}W 可能不足（建议 ${Math.ceil(recommendedWattage)}W 以上）`,
        affectedParts: ['psu'],
        suggestion: `当前配置TDP约 ${totalTDP.value}W，建议选择 ${Math.ceil(recommendedWattage)}W 以上电源`
      })
    }
  }
  
  // 显卡长度检查
  if (gpu && pcCase) {
    if (gpu.specs.length > pcCase.specs.maxGpuLength) {
      issues.push({
        type: 'error',
        code: 'GPU_TOO_LONG',
        message: `显卡长度 ${gpu.specs.length}mm 超过机箱支持的 ${pcCase.specs.maxGpuLength}mm`,
        affectedParts: ['gpu', 'case'],
        suggestion: '请选择更大的机箱或更短的显卡'
      })
    }
  }
  
  // 散热器高度检查
  if (cooler && pcCase && cooler.specs.type === 'Air') {
    if ((cooler.specs.height || 0) > pcCase.specs.maxCoolerHeight) {
      issues.push({
        type: 'error',
        code: 'COOLER_TOO_TALL',
        message: `散热器高度超过机箱支持的 ${pcCase.specs.maxCoolerHeight}mm`,
        affectedParts: ['cooler', 'case'],
        suggestion: '请选择更大的机箱或换用水冷散热器'
      })
    }
  }
  
  return issues
})

const hasErrors = computed(() => compatibilityIssues.value.some(i => i.type === 'error'))

const openSelector = (type: HardwareType) => {
  activeCategory.value = type
  showSelector.value = true
}

const selectHardware = (hardware: any) => {
  const item = configItems.value.find(i => i.type === activeCategory.value)
  if (item) {
    item.selected = hardware
  }
  showSelector.value = false
}

const removeHardware = (type: HardwareType) => {
  const item = configItems.value.find(i => i.type === type)
  if (item) {
    item.selected = null
  }
}

// 装机步骤动画
const installedParts = ref<HardwareType[]>([])
const isInstalling = ref(false)
const currentInstallStep = ref(0)

const installOrder: HardwareType[] = ['cpu', 'cooler', 'ram', 'motherboard', 'storage', 'psu', 'gpu', 'case']

const startInstallation = () => {
  if (hasErrors.value) {
    return
  }
  
  isInstalling.value = true
  installedParts.value = []
  currentInstallStep.value = 0
  
  const installNext = () => {
    if (currentInstallStep.value < installOrder.length) {
      const part = installOrder[currentInstallStep.value]
      if (part) {
        const item = configItems.value.find(i => i.type === part)
        if (item?.selected) {
          installedParts.value.push(part)
        }
      }
      currentInstallStep.value++
      setTimeout(installNext, 800)
    } else {
      isInstalling.value = false
    }
  }
  
  installNext()
}

const getInstallStepText = () => {
  if (currentInstallStep.value >= installOrder.length) {
    return '🎉 装机完成！'
  }
  const part = installOrder[currentInstallStep.value]
  const labels: Record<HardwareType, string> = {
    cpu: '安装CPU处理器',
    gpu: '安装显卡',
    motherboard: '安装主板',
    ram: '安装内存条',
    storage: '安装存储设备',
    psu: '连接电源',
    cooler: '安装散热器',
    case: '装入机箱'
  }
  return part ? `正在${labels[part]}...` : '准备中...'
}
</script>

<template>
  <div class="builder-page">
    <div class="page-header">
      <h1 class="page-title">模拟装机</h1>
      <p class="page-subtitle">选择配件，实时预览装机效果</p>
    </div>
    
    <div class="builder-layout">
      <!-- 左侧3D预览区 -->
      <div class="preview-section">
        <div class="preview-container">
          <div class="pc-case-3d" :class="{ installing: isInstalling }">
            <div class="case-frame">
              <div class="case-glass">
                <!-- CPU -->
                <div 
                  class="component cpu" 
                  :class="{ installed: installedParts.includes('cpu'), glow: installedParts.includes('cpu') }"
                >
                  <div class="component-label">CPU</div>
                </div>
                
                <!-- 散热器 -->
                <div 
                  class="component cooler" 
                  :class="{ installed: installedParts.includes('cooler') }"
                >
                  <div class="fan-blades" v-if="installedParts.includes('cooler')"></div>
                </div>
                
                <!-- 内存 -->
                <div 
                  class="component ram" 
                  :class="{ installed: installedParts.includes('ram'), glow: installedParts.includes('ram') }"
                >
                  <div class="ram-stick"></div>
                  <div class="ram-stick"></div>
                </div>
                
                <!-- 显卡 -->
                <div 
                  class="component gpu" 
                  :class="{ installed: installedParts.includes('gpu'), glow: installedParts.includes('gpu') }"
                >
                  <div class="gpu-fans">
                    <div class="fan" :class="{ spinning: installedParts.includes('gpu') }"></div>
                    <div class="fan" :class="{ spinning: installedParts.includes('gpu') }"></div>
                    <div class="fan" :class="{ spinning: installedParts.includes('gpu') }"></div>
                  </div>
                </div>
                
                <!-- 存储 -->
                <div 
                  class="component storage" 
                  :class="{ installed: installedParts.includes('storage') }"
                >
                  <div class="ssd-led" v-if="installedParts.includes('storage')"></div>
                </div>
                
                <!-- RGB灯带 -->
                <div class="rgb-strip" v-if="installedParts.length > 3"></div>
              </div>
              
              <!-- 电源 -->
              <div 
                class="component psu" 
                :class="{ installed: installedParts.includes('psu') }"
              >
                <div class="psu-fan" :class="{ spinning: installedParts.includes('psu') }"></div>
              </div>
            </div>
          </div>
          
          <!-- 安装进度 -->
          <div class="install-progress" v-if="isInstalling">
            <div class="progress-text">{{ getInstallStepText() }}</div>
            <t-progress 
              :percentage="(currentInstallStep / installOrder.length) * 100" 
              theme="plump"
              color="#667eea"
            />
          </div>
          
          <!-- 完成提示 -->
          <div class="install-complete" v-if="!isInstalling && installedParts.length === 8">
            <div class="complete-icon">🎉</div>
            <div class="complete-text">装机完成！</div>
            <div class="complete-stats">
              <div class="stat">
                <span class="label">总价</span>
                <span class="value">¥{{ totalPrice.toLocaleString() }}</span>
              </div>
              <div class="stat">
                <span class="label">TDP</span>
                <span class="value">{{ totalTDP }}W</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-actions">
          <t-button 
            size="large" 
            theme="primary" 
            :disabled="hasErrors || isInstalling || configItems.every(i => !i.selected)"
            @click="startInstallation"
          >
            <template #icon><t-icon name="play" /></template>
            {{ isInstalling ? '装机中...' : '开始模拟装机' }}
          </t-button>
          <t-button 
            size="large" 
            variant="outline"
            @click="installedParts = []; currentInstallStep = 0"
          >
            <template #icon><t-icon name="refresh" /></template>
            重置预览
          </t-button>
        </div>
      </div>
      
      <!-- 右侧配置选择 -->
      <div class="config-section">
        <!-- 兼容性提示 -->
        <div class="compatibility-panel" v-if="compatibilityIssues.length > 0">
          <div class="panel-header">
            <t-icon :name="hasErrors ? 'error-circle' : 'info-circle'" />
            <span>兼容性检测</span>
          </div>
          <div class="issue-list">
            <div 
              v-for="issue in compatibilityIssues" 
              :key="issue.code" 
              :class="['issue-item', issue.type]"
            >
              <t-icon :name="issue.type === 'error' ? 'close-circle' : 'error-circle'" />
              <div class="issue-content">
                <div class="issue-message">{{ issue.message }}</div>
                <div class="issue-suggestion" v-if="issue.suggestion">
                  💡 {{ issue.suggestion }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 配件列表 -->
        <div class="parts-list">
          <div 
            v-for="item in configItems" 
            :key="item.type" 
            :class="['part-card', { selected: item.selected }]"
            @click="openSelector(item.type)"
          >
            <div class="part-icon" :style="{ backgroundColor: item.color }">
              <t-icon :name="item.icon" />
            </div>
            <div class="part-info">
              <div class="part-type">{{ item.label }}</div>
              <div class="part-name" v-if="item.selected">
                {{ item.selected.name }}
              </div>
              <div class="part-placeholder" v-else>
                点击选择{{ item.label }}
              </div>
            </div>
            <div class="part-price" v-if="item.selected">
              ¥{{ item.selected.price.toLocaleString() }}
            </div>
            <t-icon 
              v-if="item.selected" 
              name="close" 
              class="remove-btn"
              @click.stop="removeHardware(item.type)"
            />
          </div>
        </div>
        
        <!-- 价格汇总 -->
        <div class="price-summary">
          <div class="summary-row">
            <span>配件总价</span>
            <span class="total">¥{{ totalPrice.toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span>总功耗</span>
            <span>{{ totalTDP }}W</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 硬件选择弹窗 -->
    <t-drawer 
      v-model:visible="showSelector" 
      size="500px"
      :header="`选择${configItems.find(i => i.type === activeCategory)?.label}`"
    >
      <div class="hardware-selector">
        <div 
          v-for="hw in currentOptions" 
          :key="hw.id" 
          class="hardware-option"
          @click="selectHardware(hw)"
        >
          <div class="hw-main">
            <div class="hw-brand">{{ hw.brand }}</div>
            <div class="hw-name">{{ hw.name }}</div>
            <div class="hw-specs">
              <template v-if="hw.type === 'cpu'">
                {{ hw.specs.cores }}核{{ hw.specs.threads }}线程 | {{ hw.specs.boostClock }}GHz | {{ hw.specs.socket }}
              </template>
              <template v-else-if="hw.type === 'gpu'">
                {{ hw.specs.vram }}GB {{ hw.specs.vramType }} | {{ hw.specs.tdp }}W
              </template>
              <template v-else-if="hw.type === 'motherboard'">
                {{ hw.specs.chipset }} | {{ hw.specs.socket }} | {{ hw.specs.formFactor }}
              </template>
              <template v-else-if="hw.type === 'ram'">
                {{ hw.specs.capacity }}GB {{ hw.specs.type }} {{ hw.specs.speed }}MHz
              </template>
              <template v-else-if="hw.type === 'storage'">
                {{ hw.specs.capacity }}GB {{ hw.specs.type }} | {{ hw.specs.readSpeed }}MB/s读取
              </template>
              <template v-else-if="hw.type === 'psu'">
                {{ hw.specs.wattage }}W | {{ hw.specs.efficiency }}
              </template>
              <template v-else-if="hw.type === 'cooler'">
                {{ hw.specs.type }} | TDP {{ hw.specs.tdp }}W | {{ hw.specs.noise }}dB
              </template>
              <template v-else-if="hw.type === 'case'">
                {{ hw.specs.formFactor }} | 最大显卡{{ hw.specs.maxGpuLength }}mm
              </template>
            </div>
          </div>
          <div class="hw-price">¥{{ hw.price.toLocaleString() }}</div>
        </div>
      </div>
    </t-drawer>
  </div>
</template>

<style scoped>
.builder-page {
  min-height: calc(100vh - 200px);
}

.builder-layout {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 24px;
}

/* 预览区域 */
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px;
}

/* 3D机箱 */
.pc-case-3d {
  width: 350px;
  height: 450px;
  transform-style: preserve-3d;
  transform: perspective(1200px) rotateY(-15deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.pc-case-3d.installing {
  animation: caseRotate 8s linear infinite;
}

@keyframes caseRotate {
  0% { transform: perspective(1200px) rotateY(-15deg) rotateX(5deg); }
  50% { transform: perspective(1200px) rotateY(15deg) rotateX(5deg); }
  100% { transform: perspective(1200px) rotateY(-15deg) rotateX(5deg); }
}

.case-frame {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%);
  border-radius: 12px;
  position: relative;
  box-shadow: 
    30px 30px 60px rgba(0, 0, 0, 0.6),
    -10px -10px 30px rgba(255, 255, 255, 0.03);
}

.case-glass {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 80px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

/* 组件样式 */
.component {
  position: absolute;
  transition: all 0.5s ease;
  opacity: 0.3;
}

.component.installed {
  opacity: 1;
}

.component.glow::after {
  content: '';
  position: absolute;
  inset: -5px;
  background: inherit;
  filter: blur(15px);
  opacity: 0.5;
  z-index: -1;
}

/* CPU */
.component.cpu {
  top: 80px;
  left: 100px;
  width: 70px;
  height: 70px;
  background: linear-gradient(145deg, #4a4a4a, #333);
  border: 3px solid #555;
  border-radius: 4px;
}

.component.cpu.glow::after {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.component-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

/* 散热器 */
.component.cooler {
  top: 50px;
  left: 85px;
  width: 100px;
  height: 100px;
  background: linear-gradient(145deg, #3a3a3a, #222);
  border-radius: 50%;
}

.fan-blades {
  width: 100%;
  height: 100%;
  background: 
    conic-gradient(from 0deg, #333 0deg 30deg, #444 30deg 60deg, #333 60deg 90deg, #444 90deg 120deg, 
                   #333 120deg 150deg, #444 150deg 180deg, #333 180deg 210deg, #444 210deg 240deg,
                   #333 240deg 270deg, #444 270deg 300deg, #333 300deg 330deg, #444 330deg 360deg);
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

/* 内存 */
.component.ram {
  top: 70px;
  right: 50px;
  display: flex;
  gap: 8px;
}

.ram-stick {
  width: 12px;
  height: 90px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 2px;
}

.component.ram.glow::after {
  background: linear-gradient(180deg, #667eea, #764ba2);
}

/* 显卡 */
.component.gpu {
  bottom: 60px;
  left: 30px;
  width: 250px;
  height: 60px;
  background: linear-gradient(90deg, #2a2a2a, #1a1a1a);
  border-radius: 4px;
  border: 2px solid #444;
}

.gpu-fans {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
}

.fan {
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, #333, #222);
  border-radius: 50%;
  border: 2px solid #444;
}

.fan.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.component.gpu.glow::after {
  background: linear-gradient(90deg, #00a870, #00c896);
}

/* 存储 */
.component.storage {
  bottom: 130px;
  right: 30px;
  width: 80px;
  height: 25px;
  background: linear-gradient(90deg, #2a2a2a, #1a1a1a);
  border-radius: 3px;
}

.ssd-led {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: blink 0.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 电源 */
.component.psu {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  height: 60px;
  background: linear-gradient(90deg, #1a1a1a, #0d0d0d);
  border-radius: 4px;
}

.psu-fan {
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, #222, #111);
  border-radius: 50%;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid #333;
}

.psu-fan.spinning {
  animation: spin 3s linear infinite;
}

/* RGB灯带 */
.rgb-strip {
  position: absolute;
  left: 5px;
  top: 20px;
  bottom: 20px;
  width: 5px;
  background: linear-gradient(180deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
  border-radius: 3px;
  animation: rgbFlow 3s linear infinite;
  box-shadow: 0 0 30px currentColor;
}

@keyframes rgbFlow {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* 安装进度 */
.install-progress {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 16px 20px;
}

.progress-text {
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
}

/* 完成提示 */
.install-complete {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  background: linear-gradient(135deg, rgba(0, 168, 112, 0.9), rgba(0, 200, 150, 0.9));
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #fff;
}

.complete-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.complete-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.complete-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.complete-stats .stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.complete-stats .label {
  font-size: 12px;
  opacity: 0.8;
}

.complete-stats .value {
  font-size: 18px;
  font-weight: 700;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

/* 配置区域 */
.config-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 兼容性面板 */
.compatibility-panel {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #fef3cd;
  color: #856404;
  font-weight: 500;
}

.panel-header:has(+ .issue-list .issue-item.error) {
  background: #f8d7da;
  color: #721c24;
}

.issue-list {
  padding: 12px;
}

.issue-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.issue-item:last-child {
  margin-bottom: 0;
}

.issue-item.error {
  background: #fff5f5;
  color: #c53030;
}

.issue-item.warning {
  background: #fffbeb;
  color: #b45309;
}

.issue-content {
  flex: 1;
}

.issue-message {
  font-size: 13px;
  font-weight: 500;
}

.issue-suggestion {
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.8;
}

/* 配件列表 */
.parts-list {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 12px;
  flex: 1;
  overflow-y: auto;
}

.part-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
}

.part-card:hover {
  background: #f9fafb;
}

.part-card.selected {
  border-color: var(--primary-color);
  background: rgba(0, 82, 217, 0.03);
}

.part-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.part-info {
  flex: 1;
  min-width: 0;
}

.part-type {
  font-size: 12px;
  color: var(--text-secondary);
}

.part-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.part-placeholder {
  font-size: 13px;
  color: var(--text-secondary);
}

.part-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.remove-btn {
  position: absolute;
  right: 8px;
  top: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.remove-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* 价格汇总 */
.price-summary {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.summary-row .total {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

/* 硬件选择器 */
.hardware-selector {
  padding: 16px;
}

.hardware-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
  border: 2px solid var(--border-color);
}

.hardware-option:hover {
  border-color: var(--primary-color);
  background: rgba(0, 82, 217, 0.03);
}

.hw-brand {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.hw-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.hw-specs {
  font-size: 13px;
  color: var(--text-secondary);
}

.hw-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 1200px) {
  .builder-layout {
    grid-template-columns: 1fr;
  }
  
  .preview-container {
    min-height: 400px;
  }
}
</style>
