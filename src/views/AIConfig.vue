<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { ChatMessage, BuildConfig, CPU, GPU, RAM, Storage, Motherboard, PSU, Cooler, Case } from '../types'
import { cpuList, gpuList, ramList, storageList, motherboardList, psuList, coolerList, caseList } from '../mock/hardware'

const route = useRoute()

const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)
const isTyping = ref(false)

const currentConfig = ref<BuildConfig>({
  id: 'config-001',
  name: '我的配置',
  totalPrice: 0,
  estimatedBenchmark: 0,
  compatibility: { isCompatible: true, issues: [], warnings: [] }
})

const selectedUsages = ref<string[]>([])
const budget = ref(8000)
const step = ref(1)

onMounted(() => {
  const queryBudget = route.query.budget
  if (queryBudget) {
    budget.value = parseInt(queryBudget as string)
  }
  
  addAIMessage('👋 你好！我是AI装机助手，很高兴为你服务！\n\n请先告诉我：\n1. 你的预算范围是多少？\n2. 你主要用电脑做什么？\n\n我会根据你的需求推荐最合适的配置方案。', [
    '预算5000，主要办公',
    '预算8000，玩游戏',
    '预算15000，专业设计',
    '直接帮我推荐'
  ])
})

const addAIMessage = (content: string, suggestions?: string[]) => {
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    suggestions
  }
  messages.value.push(msg)
  scrollToBottom()
}

const addUserMessage = (content: string) => {
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date()
  }
  messages.value.push(msg)
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  }, 100)
}

const analyzeRequirements = () => {
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    let cpu: CPU
    let gpu: GPU
    let ram: RAM
    let storage: Storage
    let motherboard: Motherboard
    let psu: PSU
    let cooler: Cooler
    let pcCase: Case
    
    // 根据预算推荐配置
    if (budget.value >= 20000) {
      cpu = cpuList.find(c => c.id === 'cpu-001')!
      gpu = gpuList.find(g => g.id === 'gpu-001')!
      ram = ramList.find(r => r.id === 'ram-002')!
      storage = storageList.find(s => s.id === 'ssd-003')!
      motherboard = motherboardList.find(m => m.id === 'mb-001')!
      psu = psuList.find(p => p.id === 'psu-001')!
      cooler = coolerList.find(c => c.id === 'cooler-001')!
      pcCase = caseList.find(c => c.id === 'case-002')!
    } else if (budget.value >= 12000) {
      cpu = cpuList.find(c => c.id === 'cpu-002')!
      gpu = gpuList.find(g => g.id === 'gpu-002')!
      ram = ramList.find(r => r.id === 'ram-001')!
      storage = storageList.find(s => s.id === 'ssd-001')!
      motherboard = motherboardList.find(m => m.id === 'mb-001')!
      psu = psuList.find(p => p.id === 'psu-002')!
      cooler = coolerList.find(c => c.id === 'cooler-003')!
      pcCase = caseList.find(c => c.id === 'case-001')!
    } else if (budget.value >= 8000) {
      cpu = cpuList.find(c => c.id === 'cpu-004')!
      gpu = gpuList.find(g => g.id === 'gpu-003')!
      ram = ramList.find(r => r.id === 'ram-003')!
      storage = storageList.find(s => s.id === 'ssd-002')!
      motherboard = motherboardList.find(m => m.id === 'mb-004')!
      psu = psuList.find(p => p.id === 'psu-003')!
      cooler = coolerList.find(c => c.id === 'cooler-002')!
      pcCase = caseList.find(c => c.id === 'case-001')!
    } else {
      cpu = cpuList.find(c => c.id === 'cpu-005')!
      gpu = gpuList.find(g => g.id === 'gpu-005')!
      ram = ramList.find(r => r.id === 'ram-003')!
      storage = storageList.find(s => s.id === 'ssd-002')!
      motherboard = motherboardList.find(m => m.id === 'mb-004')!
      psu = psuList.find(p => p.id === 'psu-003')!
      cooler = coolerList.find(c => c.id === 'cooler-002')!
      pcCase = caseList.find(c => c.id === 'case-003')!
    }
    
    currentConfig.value = {
      ...currentConfig.value,
      cpu,
      gpu,
      ram,
      storage: [storage],
      motherboard,
      psu,
      cooler,
      case: pcCase,
      totalPrice: cpu.price + gpu.price + ram.price + storage.price + motherboard.price + psu.price + cooler.price + pcCase.price,
      estimatedBenchmark: (cpu.benchmark || 0) + (gpu.benchmark || 0)
    }
    
    const usageText = selectedUsages.value.length > 0 
      ? selectedUsages.value.join('、') 
      : '综合使用'
    
    addAIMessage(`🎯 根据你的需求分析：\n\n📊 **预算**: ¥${budget.value.toLocaleString()}\n🎮 **用途**: ${usageText}\n\n我为你推荐以下配置方案：\n\n🔹 **CPU**: ${cpu.name}\n  - ${cpu.specs.cores}核${cpu.specs.threads}线程，最高${cpu.specs.boostClock}GHz\n\n🔹 **显卡**: ${gpu.name}\n  - ${gpu.specs.vram}GB ${gpu.specs.vramType}显存\n\n🔹 **内存**: ${ram.name}\n  - ${ram.specs.capacity}GB ${ram.specs.type} ${ram.specs.speed}MHz\n\n🔹 **存储**: ${storage.name}\n  - ${storage.specs.capacity}GB ${storage.specs.type}\n\n💰 **总价**: ¥${currentConfig.value.totalPrice.toLocaleString()}\n📈 **预估跑分**: ${currentConfig.value.estimatedBenchmark.toLocaleString()}分\n\n✅ **兼容性检测**: 所有硬件兼容，无冲突！`, [
      '帮我换个显卡',
      '能不能再便宜点',
      '查看商家比价',
      '开始模拟装机'
    ])
    
    step.value = 2
  }, 1500)
}

const handleSuggestionClick = (suggestion: string) => {
  addUserMessage(suggestion)
  
  if (suggestion.includes('预算') || suggestion.includes('直接帮我推荐')) {
    const match = suggestion.match(/预算(\d+)/)
    if (match && match[1]) {
      budget.value = parseInt(match[1])
    }
    if (suggestion.includes('办公')) {
      selectedUsages.value = ['办公']
    } else if (suggestion.includes('游戏')) {
      selectedUsages.value = ['游戏']
    } else if (suggestion.includes('设计')) {
      selectedUsages.value = ['设计/渲染']
    }
    analyzeRequirements()
  } else if (suggestion.includes('换个显卡')) {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      addAIMessage('🎮 好的，以下是同价位其他显卡选择：\n\n1. **AMD RX 7900 XTX** - ¥7,999\n   - 24GB GDDR6，光追性能较弱但性价比高\n\n2. **RTX 4070 Super** - ¥4,999\n   - 12GB GDDR6X，适合1440P游戏\n\n3. **RTX 4080** - ¥7,999\n   - 16GB GDDR6X，4K游戏首选\n\n你想换成哪个？', [
        '换成RX 7900 XTX',
        '换成RTX 4070 Super',
        '保持原来的配置',
        '查看详细对比'
      ])
    }, 1000)
  } else if (suggestion.includes('便宜')) {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      addAIMessage('💰 我帮你优化了配置，主要调整：\n\n1. CPU换成 i5-14600K（省¥900）\n2. 显卡换成 RTX 4060 Ti（省¥3,300）\n3. 内存降为32GB（省¥500）\n\n调整后总价：约 ¥9,500\n性能下降约15%，但仍能流畅运行主流游戏。\n\n你觉得这个方案怎么样？', [
        '接受这个方案',
        '只换显卡就好',
        '我要原来的配置',
        '还能再便宜吗'
      ])
    }, 1000)
  } else {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      addAIMessage('好的，已为你记录。还有什么需要调整的吗？', [
        '这个配置就很好',
        '查看商家比价',
        '开始模拟装机'
      ])
    }, 800)
  }
}

const sendMessage = () => {
  if (!inputMessage.value.trim()) return
  
  addUserMessage(inputMessage.value)
  const userMsg = inputMessage.value.toLowerCase()
  inputMessage.value = ''
  
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    if (userMsg.includes('预算') || userMsg.includes('元') || userMsg.includes('块')) {
      const match = userMsg.match(/(\d+)/)
      if (match && match[1]) {
        budget.value = parseInt(match[1])
        addAIMessage(`已记录你的预算：¥${budget.value.toLocaleString()}。\n\n请告诉我你的主要用途是什么？`, [
          '主要玩游戏',
          '办公和学习',
          '设计和渲染',
          '视频剪辑'
        ])
      }
    } else if (userMsg.includes('游戏')) {
      selectedUsages.value = ['游戏']
      analyzeRequirements()
    } else if (userMsg.includes('办公') || userMsg.includes('学习')) {
      selectedUsages.value = ['办公']
      analyzeRequirements()
    } else if (userMsg.includes('设计') || userMsg.includes('渲染')) {
      selectedUsages.value = ['设计/渲染']
      analyzeRequirements()
    } else {
      addAIMessage('好的，我已记录你的需求。还有其他要求吗？', [
        '开始推荐配置',
        '我想调整预算',
        '查看热门配置'
      ])
    }
  }, 1000)
}

const totalPrice = computed(() => {
  const config = currentConfig.value
  let total = 0
  if (config.cpu) total += config.cpu.price
  if (config.gpu) total += config.gpu.price
  if (config.motherboard) total += config.motherboard.price
  if (config.ram) total += config.ram.price
  if (config.storage) total += config.storage.reduce((sum, s) => sum + s.price, 0)
  if (config.psu) total += config.psu.price
  if (config.cooler) total += config.cooler.price
  if (config.case) total += config.case.price
  return total
})
</script>

<template>
  <div class="ai-config-page">
    <div class="page-header">
      <h1 class="page-title">AI智能选配</h1>
      <p class="page-subtitle">告诉我你的需求，AI为你推荐最佳配置</p>
    </div>
    
    <div class="config-layout">
      <!-- 左侧聊天区域 -->
      <div class="chat-section">
        <div class="chat-container" ref="chatContainerRef">
          <div v-for="msg in messages" :key="msg.id" :class="['message', msg.role]">
            <div v-if="msg.role === 'assistant'" class="avatar">🤖</div>
            <div class="message-content">
              <div class="message-text" v-html="msg.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></div>
              <div v-if="msg.suggestions && msg.suggestions.length > 0" class="suggestions">
                <t-button 
                  v-for="suggestion in msg.suggestions" 
                  :key="suggestion"
                  size="small"
                  variant="outline"
                  @click="handleSuggestionClick(suggestion)"
                >
                  {{ suggestion }}
                </t-button>
              </div>
            </div>
          </div>
          
          <div v-if="isTyping" class="message assistant">
            <div class="avatar">🤖</div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <t-input 
            v-model="inputMessage"
            placeholder="输入你的需求，如：预算8000，玩游戏..."
            @keyup.enter="sendMessage"
          >
            <template #suffix>
              <t-button theme="primary" @click="sendMessage">
                <t-icon name="send" />
              </t-button>
            </template>
          </t-input>
        </div>
      </div>
      
      <!-- 右侧配置预览 -->
      <div class="config-preview">
        <div class="preview-header">
          <h3>当前配置</h3>
          <t-tag v-if="currentConfig.compatibility.isCompatible" theme="success">兼容</t-tag>
          <t-tag v-else theme="danger">存在问题</t-tag>
        </div>
        
        <div class="config-list">
          <div class="config-item" v-if="currentConfig.cpu">
            <div class="item-icon cpu">
              <t-icon name="cpu" />
            </div>
            <div class="item-info">
              <div class="item-type">CPU</div>
              <div class="item-name">{{ currentConfig.cpu.name }}</div>
              <div class="item-price">¥{{ currentConfig.cpu.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.gpu">
            <div class="item-icon gpu">
              <t-icon name="image" />
            </div>
            <div class="item-info">
              <div class="item-type">显卡</div>
              <div class="item-name">{{ currentConfig.gpu.name }}</div>
              <div class="item-price">¥{{ currentConfig.gpu.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.motherboard">
            <div class="item-icon motherboard">
              <t-icon name="dashboard" />
            </div>
            <div class="item-info">
              <div class="item-type">主板</div>
              <div class="item-name">{{ currentConfig.motherboard.name }}</div>
              <div class="item-price">¥{{ currentConfig.motherboard.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.ram">
            <div class="item-icon ram">
              <t-icon name="server" />
            </div>
            <div class="item-info">
              <div class="item-type">内存</div>
              <div class="item-name">{{ currentConfig.ram.name }}</div>
              <div class="item-price">¥{{ currentConfig.ram.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.storage && currentConfig.storage.length > 0 && currentConfig.storage[0]">
            <div class="item-icon storage">
              <t-icon name="hard-drive" />
            </div>
            <div class="item-info">
              <div class="item-type">存储</div>
              <div class="item-name">{{ currentConfig.storage[0]!.name }}</div>
              <div class="item-price">¥{{ currentConfig.storage[0]!.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.psu">
            <div class="item-icon psu">
              <t-icon name="power-off" />
            </div>
            <div class="item-info">
              <div class="item-type">电源</div>
              <div class="item-name">{{ currentConfig.psu.name }}</div>
              <div class="item-price">¥{{ currentConfig.psu.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.cooler">
            <div class="item-icon cooler">
              <t-icon name="refresh" />
            </div>
            <div class="item-info">
              <div class="item-type">散热器</div>
              <div class="item-name">{{ currentConfig.cooler.name }}</div>
              <div class="item-price">¥{{ currentConfig.cooler.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="config-item" v-if="currentConfig.case">
            <div class="item-icon case">
              <t-icon name="desktop" />
            </div>
            <div class="item-info">
              <div class="item-type">机箱</div>
              <div class="item-name">{{ currentConfig.case.name }}</div>
              <div class="item-price">¥{{ currentConfig.case.price.toLocaleString() }}</div>
            </div>
          </div>
          
          <div v-if="!currentConfig.cpu" class="empty-config">
            <t-icon name="add-circle" size="48px" />
            <p>等待AI推荐配置...</p>
          </div>
        </div>
        
        <div class="config-summary" v-if="totalPrice > 0">
          <div class="summary-row">
            <span>配件总价</span>
            <span class="total-price">¥{{ totalPrice.toLocaleString() }}</span>
          </div>
          <div class="summary-row">
            <span>预估跑分</span>
            <span class="benchmark">{{ currentConfig.estimatedBenchmark.toLocaleString() }} 分</span>
          </div>
          <div class="summary-actions">
            <t-button block theme="primary">
              <template #icon><t-icon name="shop" /></template>
              一键比价购买
            </t-button>
            <t-button block variant="outline">
              <template #icon><t-icon name="tools" /></template>
              模拟装机
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-config-page {
  min-height: calc(100vh - 200px);
}

.config-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  height: calc(100vh - 250px);
  min-height: 600px;
}

/* 聊天区域 */
.chat-section {
  background: var(--card-bg);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
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

.message-content {
  max-width: 70%;
}

.message.assistant .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 16px 16px 16px 4px;
}

.message.user .message-text {
  background: #f3f4f6;
  color: var(--text-primary);
  border-radius: 16px 16px 4px 16px;
}

.message-text {
  padding: 14px 18px;
  font-size: 14px;
  line-height: 1.8;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px 16px 16px 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

/* 配置预览 */
.config-preview {
  background: var(--card-bg);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.config-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: background 0.2s;
}

.config-item:hover {
  background: #f9fafb;
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.item-icon.cpu { background: linear-gradient(135deg, #667eea, #764ba2); }
.item-icon.gpu { background: linear-gradient(135deg, #00a870, #00c896); }
.item-icon.motherboard { background: linear-gradient(135deg, #ed7b2f, #f59e0b); }
.item-icon.ram { background: linear-gradient(135deg, #0052d9, #2563eb); }
.item-icon.storage { background: linear-gradient(135deg, #e34d59, #f43f5e); }
.item-icon.psu { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
.item-icon.cooler { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.item-icon.case { background: linear-gradient(135deg, #64748b, #475569); }

.item-info {
  flex: 1;
  min-width: 0;
}

.item-type {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 2px;
}

.empty-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-secondary);
  text-align: center;
}

.empty-config p {
  margin-top: 16px;
  font-size: 14px;
}

.config-summary {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background: #f9fafb;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.benchmark {
  font-size: 16px;
  font-weight: 600;
  color: var(--success-color);
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .config-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .chat-section {
    height: 500px;
  }
  
  .config-preview {
    max-height: 400px;
  }
}
</style>
