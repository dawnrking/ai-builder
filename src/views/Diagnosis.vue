<script setup lang="ts">
import { ref, computed } from 'vue'

interface DiagnosticCategory {
  id: string
  name: string
  icon: string
  color: string
  issues: DiagnosticIssue[]
}

interface DiagnosticIssue {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  symptoms: string[]
  causes: string[]
  solutions: Solution[]
}

interface Solution {
  id: string
  title: string
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  tools?: string[]
}

const diagnosticCategories: DiagnosticCategory[] = [
  {
    id: 'boot',
    name: '开机故障',
    icon: 'power-off',
    color: '#e34d59',
    issues: [
      {
        id: 'no-power',
        title: '电脑无法开机',
        description: '按下电源按钮后电脑完全没有反应',
        severity: 'critical',
        symptoms: ['按电源键无反应', '指示灯不亮', '风扇不转'],
        causes: ['电源线未接好', '电源故障', '主板供电问题', '电源开关损坏'],
        solutions: [
          {
            id: 's1',
            title: '检查电源连接',
            steps: [
              '确认电源线已正确插入电源插座',
              '检查电源线与电源的连接是否牢固',
              '尝试更换电源插座测试',
              '检查电源后部的开关是否打开'
            ],
            difficulty: 'easy',
            estimatedTime: '5分钟'
          },
          {
            id: 's2',
            title: '跳线启动测试',
            steps: [
              '拔掉电源线，等待30秒',
              '找到主板上的Power Switch跳线针',
              '用金属物（如螺丝刀）短接这两个针脚',
              '如果能启动，说明机箱电源按钮故障'
            ],
            difficulty: 'medium',
            estimatedTime: '10分钟',
            tools: ['螺丝刀']
          },
          {
            id: 's3',
            title: '电源纸片测试',
            steps: [
              '断开电源与主板的所有连接',
              '找到24pin主板供电线',
              '用金属丝短接绿色线和任意黑色线',
              '插上电源线，打开电源开关',
              '如果风扇转动，电源正常；否则电源故障'
            ],
            difficulty: 'medium',
            estimatedTime: '15分钟',
            tools: ['金属丝或回形针']
          }
        ]
      },
      {
        id: 'no-display',
        title: '开机无显示',
        description: '电脑启动但显示器没有画面',
        severity: 'high',
        symptoms: ['风扇转动', '指示灯亮', '显示器黑屏', '无信号提示'],
        causes: ['显示线未接好', '显卡未插紧', '内存接触不良', '显示器设置错误'],
        solutions: [
          {
            id: 's1',
            title: '检查显示连接',
            steps: [
              '确认显示器电源已打开',
              '检查显示线两端连接是否牢固',
              '尝试更换显示线测试',
              '如果有独立显卡，确保显示线接在显卡上而非主板'
            ],
            difficulty: 'easy',
            estimatedTime: '5分钟'
          },
          {
            id: 's2',
            title: '重新插拔内存',
            steps: [
              '关机并拔掉电源线',
              '打开机箱侧板',
              '按下内存插槽两端的卡扣，取出内存',
              '用橡皮擦清洁内存金手指',
              '将内存重新插入，确保两端卡扣扣紧'
            ],
            difficulty: 'easy',
            estimatedTime: '10分钟',
            tools: ['橡皮擦']
          },
          {
            id: 's3',
            title: '重新安装显卡',
            steps: [
              '关机并拔掉电源线',
              '拔掉显卡供电线',
              '松开显卡固定螺丝',
              '按下PCIe插槽卡扣，取出显卡',
              '清洁显卡金手指',
              '重新安装显卡，确保完全插入'
            ],
            difficulty: 'medium',
            estimatedTime: '15分钟',
            tools: ['螺丝刀', '橡皮擦']
          }
        ]
      },
      {
        id: 'boot-loop',
        title: '反复重启',
        description: '电脑开机后自动重启，无法进入系统',
        severity: 'high',
        symptoms: ['开机后自动重启', '重启循环', '无法进入系统'],
        causes: ['CPU过热', '电源供电不足', '系统文件损坏', '硬件兼容性问题'],
        solutions: [
          {
            id: 's1',
            title: '检查散热系统',
            steps: [
              '检查CPU散热器是否正确安装',
              '确认散热风扇正常运转',
              '检查硅脂是否干涸需要更换',
              '清理散热器灰尘'
            ],
            difficulty: 'medium',
            estimatedTime: '20分钟',
            tools: ['螺丝刀', '硅脂', '清洁刷']
          },
          {
            id: 's2',
            title: '最小化启动测试',
            steps: [
              '只保留CPU、一根内存、电源',
              '移除显卡、硬盘等其他设备',
              '尝试开机观察是否正常',
              '逐个添加硬件排查问题设备'
            ],
            difficulty: 'medium',
            estimatedTime: '30分钟'
          }
        ]
      }
    ]
  },
  {
    id: 'performance',
    name: '性能问题',
    icon: 'chart-line',
    color: '#ed7b2f',
    issues: [
      {
        id: 'slow-boot',
        title: '开机速度慢',
        description: '从按下电源到进入桌面时间过长',
        severity: 'medium',
        symptoms: ['开机等待时间长', '进度条卡顿', 'Logo界面停留久'],
        causes: ['启动项过多', '硬盘性能差', '系统文件碎片化', 'BIOS设置不当'],
        solutions: [
          {
            id: 's1',
            title: '禁用不必要的启动项',
            steps: [
              '按Ctrl+Shift+Esc打开任务管理器',
              '切换到"启动"选项卡',
              '右键禁用不需要开机启动的程序',
              '重启电脑测试效果'
            ],
            difficulty: 'easy',
            estimatedTime: '5分钟'
          },
          {
            id: 's2',
            title: '升级到SSD',
            steps: [
              '购买合适的SSD（推荐NVMe）',
              '备份原硬盘重要数据',
              '使用克隆软件迁移系统',
              '或全新安装系统到SSD'
            ],
            difficulty: 'hard',
            estimatedTime: '2小时',
            tools: ['SSD', '硬盘克隆软件']
          }
        ]
      },
      {
        id: 'game-lag',
        title: '游戏卡顿',
        description: '游戏运行时帧数低或不稳定',
        severity: 'medium',
        symptoms: ['帧数低', '画面卡顿', '操作延迟', '加载时间长'],
        causes: ['显卡驱动过旧', '显存不足', 'CPU瓶颈', '散热不良导致降频'],
        solutions: [
          {
            id: 's1',
            title: '更新显卡驱动',
            steps: [
              '访问NVIDIA或AMD官网',
              '下载最新版显卡驱动',
              '使用DDU工具彻底卸载旧驱动',
              '安装新驱动并重启'
            ],
            difficulty: 'easy',
            estimatedTime: '15分钟'
          },
          {
            id: 's2',
            title: '优化游戏设置',
            steps: [
              '进入游戏图形设置',
              '将分辨率降低一档',
              '关闭或降低阴影质量',
              '关闭垂直同步和动态模糊',
              '适当降低材质质量'
            ],
            difficulty: 'easy',
            estimatedTime: '10分钟'
          },
          {
            id: 's3',
            title: '检查温度和散热',
            steps: [
              '下载HWMonitor等温度监控软件',
              '在游戏时观察CPU/GPU温度',
              '如果超过85°C考虑改善散热',
              '清理机箱灰尘，更换硅脂'
            ],
            difficulty: 'medium',
            estimatedTime: '30分钟',
            tools: ['温度监控软件', '清洁工具']
          }
        ]
      }
    ]
  },
  {
    id: 'hardware',
    name: '硬件故障',
    icon: 'tools',
    color: '#0052d9',
    issues: [
      {
        id: 'bsod',
        title: '蓝屏死机',
        description: '系统突然蓝屏并显示错误代码',
        severity: 'high',
        symptoms: ['蓝屏错误', '自动重启', '错误代码'],
        causes: ['驱动程序错误', '内存故障', '硬盘问题', '系统文件损坏'],
        solutions: [
          {
            id: 's1',
            title: '内存检测',
            steps: [
              '按Win+R输入mdsched.exe',
              '选择"立即重新启动并检查问题"',
              '等待内存诊断完成',
              '如果有错误，尝试更换内存插槽或内存条'
            ],
            difficulty: 'medium',
            estimatedTime: '30分钟'
          },
          {
            id: 's2',
            title: '系统文件修复',
            steps: [
              '以管理员身份打开命令提示符',
              '输入: sfc /scannow',
              '等待扫描完成',
              '如有损坏文件会自动修复'
            ],
            difficulty: 'easy',
            estimatedTime: '20分钟'
          }
        ]
      },
      {
        id: 'noise',
        title: '异常噪音',
        description: '电脑运行时发出异常声响',
        severity: 'medium',
        symptoms: ['风扇噪音大', '硬盘异响', '蜂鸣声', '电流声'],
        causes: ['风扇轴承磨损', '硬盘故障', '线缆干涉风扇', '电源老化'],
        solutions: [
          {
            id: 's1',
            title: '清理风扇灰尘',
            steps: [
              '关机并拔掉电源线',
              '打开机箱侧板',
              '使用压缩空气或软毛刷清理风扇',
              '特别注意CPU和显卡风扇'
            ],
            difficulty: 'easy',
            estimatedTime: '15分钟',
            tools: ['压缩空气罐', '软毛刷']
          },
          {
            id: 's2',
            title: '检查线缆整理',
            steps: [
              '检查所有线缆是否远离风扇',
              '使用扎带整理散乱的线缆',
              '确保没有线缆接触风扇叶片'
            ],
            difficulty: 'easy',
            estimatedTime: '10分钟',
            tools: ['扎带']
          }
        ]
      }
    ]
  },
  {
    id: 'compatibility',
    name: '兼容性问题',
    icon: 'link',
    color: '#00a870',
    issues: [
      {
        id: 'new-hardware',
        title: '新硬件无法识别',
        description: '安装新硬件后系统无法识别或无法使用',
        severity: 'medium',
        symptoms: ['设备管理器显示未知设备', '硬件不工作', '驱动安装失败'],
        causes: ['驱动未安装', '硬件未正确安装', '接口不匹配', 'BIOS设置问题'],
        solutions: [
          {
            id: 's1',
            title: '安装官方驱动',
            steps: [
              '访问硬件制造商官网',
              '下载对应型号和系统的驱动',
              '以管理员身份运行安装程序',
              '重启电脑'
            ],
            difficulty: 'easy',
            estimatedTime: '15分钟'
          },
          {
            id: 's2',
            title: '检查BIOS设置',
            steps: [
              '重启电脑按Del或F2进入BIOS',
              '检查相关接口是否启用',
              '如SATA模式、M.2接口等',
              '保存设置并重启'
            ],
            difficulty: 'medium',
            estimatedTime: '10分钟'
          }
        ]
      }
    ]
  }
]

const activeCategory = ref(diagnosticCategories[0]!.id)
const selectedIssue = ref<DiagnosticIssue | null>(null)
const showSolutionDetail = ref(false)
const selectedSolution = ref<Solution | null>(null)

const currentCategory = computed(() => {
  return diagnosticCategories.find(c => c.id === activeCategory.value) ?? diagnosticCategories[0]!
})

const selectIssue = (issue: DiagnosticIssue) => {
  selectedIssue.value = issue
}

const showSolution = (solution: Solution) => {
  selectedSolution.value = solution
  showSolutionDetail.value = true
}

const getSeverityInfo = (severity: string) => {
  const map: Record<string, { label: string; color: string }> = {
    critical: { label: '严重', color: '#e34d59' },
    high: { label: '较高', color: '#ed7b2f' },
    medium: { label: '中等', color: '#0052d9' },
    low: { label: '轻微', color: '#00a870' }
  }
  return map[severity] || map.low
}

const getDifficultyInfo = (difficulty: string) => {
  const map: Record<string, { label: string; color: string }> = {
    easy: { label: '简单', color: '#00a870' },
    medium: { label: '中等', color: '#ed7b2f' },
    hard: { label: '困难', color: '#e34d59' }
  }
  return map[difficulty] || map.easy
}

// AI诊断功能
const problemDescription = ref('')
const isAnalyzing = ref(false)
const aiSuggestions = ref<string[]>([])

const analyzeWithAI = () => {
  if (!problemDescription.value.trim()) return
  
  isAnalyzing.value = true
  aiSuggestions.value = []
  
  setTimeout(() => {
    const desc = problemDescription.value.toLowerCase()
    
    if (desc.includes('开机') || desc.includes('启动')) {
      aiSuggestions.value = [
        '检测到开机相关问题',
        '建议先检查电源连接是否正常',
        '如果有显示器无信号，尝试重新插拔内存和显卡',
        '监听是否有报警蜂鸣声，不同声响代表不同故障'
      ]
    } else if (desc.includes('卡') || desc.includes('慢') || desc.includes('帧')) {
      aiSuggestions.value = [
        '检测到性能相关问题',
        '建议检查CPU和GPU温度是否过高',
        '更新显卡驱动到最新版本',
        '检查后台是否有占用资源的程序',
        '考虑清理系统垃圾和优化启动项'
      ]
    } else if (desc.includes('蓝屏') || desc.includes('死机')) {
      aiSuggestions.value = [
        '检测到系统稳定性问题',
        '记录蓝屏错误代码以便进一步分析',
        '运行内存诊断工具检查内存',
        '使用sfc /scannow命令修复系统文件',
        '检查最近是否安装了新驱动或软件'
      ]
    } else if (desc.includes('噪音') || desc.includes('声音')) {
      aiSuggestions.value = [
        '检测到硬件噪音问题',
        '首先排查是否是风扇灰尘导致',
        '检查线缆是否干涉风扇转动',
        '如果是硬盘异响，建议立即备份数据',
        '电源噪音可能是电容老化的信号'
      ]
    } else {
      aiSuggestions.value = [
        '已分析您的问题描述',
        '建议您从左侧选择对应的故障类型',
        '或提供更详细的故障现象描述',
        '如有硬件型号信息会更有助于诊断'
      ]
    }
    
    isAnalyzing.value = false
  }, 1500)
}
</script>

<template>
  <div class="diagnosis-page">
    <div class="page-header">
      <h1 class="page-title">问题诊断</h1>
      <p class="page-subtitle">AI辅助排查装机问题，提供专业解决方案</p>
    </div>
    
    <div class="diagnosis-layout">
      <!-- 左侧分类导航 -->
      <div class="category-nav">
        <div class="nav-header">故障分类</div>
        <div 
          v-for="cat in diagnosticCategories" 
          :key="cat.id"
          :class="['nav-item', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id; selectedIssue = null"
        >
          <div class="nav-icon" :style="{ backgroundColor: cat.color }">
            <t-icon :name="cat.icon" />
          </div>
          <div class="nav-info">
            <div class="nav-name">{{ cat.name }}</div>
            <div class="nav-count">{{ cat.issues.length }}个常见问题</div>
          </div>
        </div>
        
        <!-- AI诊断入口 -->
        <div class="ai-diagnosis">
          <div class="ai-header">
            <t-icon name="robot" />
            AI智能诊断
          </div>
          <t-textarea 
            v-model="problemDescription"
            placeholder="描述您遇到的问题，如：电脑开机后黑屏，风扇转但无显示..."
            :maxlength="200"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
          <t-button 
            theme="primary" 
            block 
            :loading="isAnalyzing"
            @click="analyzeWithAI"
          >
            <template #icon><t-icon name="search" /></template>
            开始分析
          </t-button>
          
          <div class="ai-results" v-if="aiSuggestions.length > 0">
            <div class="result-header">
              <t-icon name="lightbulb" />
              AI分析结果
            </div>
            <div class="result-list">
              <div v-for="(suggestion, index) in aiSuggestions" :key="index" class="result-item">
                <span class="result-number">{{ index + 1 }}</span>
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间问题列表 -->
      <div class="issues-panel">
        <div class="panel-header">
          <t-icon :name="currentCategory.icon || 'help'" :style="{ color: currentCategory.color }" />
          {{ currentCategory.name }} - 常见问题
        </div>
        
        <div class="issues-list">
          <div 
            v-for="issue in currentCategory.issues" 
            :key="issue.id"
            :class="['issue-card', { active: selectedIssue?.id === issue.id }]"
            @click="selectIssue(issue)"
          >
            <div class="issue-header">
              <div class="issue-title">{{ issue.title }}</div>
              <t-tag 
                :theme="getSeverityInfo(issue.severity).color === '#e34d59' ? 'danger' : 
                        getSeverityInfo(issue.severity).color === '#ed7b2f' ? 'warning' : 
                        getSeverityInfo(issue.severity).color === '#00a870' ? 'success' : 'primary'"
                size="small"
              >
                {{ getSeverityInfo(issue.severity).label }}
              </t-tag>
            </div>
            <div class="issue-desc">{{ issue.description }}</div>
            <div class="issue-symptoms">
              <t-icon name="error-circle" />
              {{ issue.symptoms.slice(0, 3).join(' · ') }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧解决方案 -->
      <div class="solutions-panel" v-if="selectedIssue">
        <div class="panel-header">
          <t-icon name="lightbulb" />
          解决方案
        </div>
        
        <div class="issue-detail">
          <h3>{{ selectedIssue.title }}</h3>
          <p>{{ selectedIssue.description }}</p>
          
          <div class="detail-section">
            <div class="section-title">
              <t-icon name="error-circle" />
              故障现象
            </div>
            <div class="tag-list">
              <t-tag v-for="symptom in selectedIssue.symptoms" :key="symptom" variant="light">
                {{ symptom }}
              </t-tag>
            </div>
          </div>
          
          <div class="detail-section">
            <div class="section-title">
              <t-icon name="help-circle" />
              可能原因
            </div>
            <div class="tag-list">
              <t-tag v-for="cause in selectedIssue.causes" :key="cause" variant="outline">
                {{ cause }}
              </t-tag>
            </div>
          </div>
        </div>
        
        <div class="solutions-list">
          <div 
            v-for="solution in selectedIssue.solutions" 
            :key="solution.id"
            class="solution-card"
            @click="showSolution(solution)"
          >
            <div class="solution-main">
              <div class="solution-title">{{ solution.title }}</div>
              <div class="solution-meta">
                <span class="meta-item">
                  <t-icon name="time" />
                  {{ solution.estimatedTime }}
                </span>
                <t-tag 
                  size="small" 
                  :theme="getDifficultyInfo(solution.difficulty).color === '#00a870' ? 'success' : 
                          getDifficultyInfo(solution.difficulty).color === '#ed7b2f' ? 'warning' : 'danger'"
                >
                  {{ getDifficultyInfo(solution.difficulty).label }}
                </t-tag>
              </div>
              <div class="solution-preview">
                {{ solution.steps[0] }}...
              </div>
            </div>
            <t-icon name="chevron-right" class="solution-arrow" />
          </div>
        </div>
      </div>
      
      <!-- 未选择时的提示 -->
      <div class="empty-panel" v-else>
        <t-icon name="gesture-click" size="64px" />
        <p>选择左侧的问题类型查看解决方案</p>
      </div>
    </div>
    
    <!-- 解决方案详情弹窗 -->
    <t-drawer 
      v-model:visible="showSolutionDetail" 
      size="500px"
      :header="selectedSolution?.title"
    >
      <template v-if="selectedSolution">
        <div class="solution-detail">
          <div class="detail-meta">
            <div class="meta-card">
              <t-icon name="time" />
              <div>
                <div class="meta-label">预计用时</div>
                <div class="meta-value">{{ selectedSolution?.estimatedTime }}</div>
              </div>
            </div>
            <div class="meta-card">
              <t-icon name="chart-bar" />
              <div>
                <div class="meta-label">难度等级</div>
                <div class="meta-value">{{ selectedSolution ? getDifficultyInfo(selectedSolution.difficulty).label : '' }}</div>
              </div>
            </div>
          </div>
          
          <div class="tools-section" v-if="selectedSolution?.tools?.length">
            <div class="section-title">
              <t-icon name="tools" />
              所需工具
            </div>
            <div class="tools-list">
              <t-tag v-for="tool in selectedSolution?.tools" :key="tool" variant="light" theme="primary">
                {{ tool }}
              </t-tag>
            </div>
          </div>
          
          <div class="steps-section">
            <div class="section-title">
              <t-icon name="order-ascending" />
              操作步骤
            </div>
            <div class="steps-list">
              <div v-for="(step, index) in selectedSolution?.steps" :key="index" class="step-item">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">{{ step }}</div>
              </div>
            </div>
          </div>
          
          <div class="tips-section">
            <t-alert theme="info" title="温馨提示">
              <template #message>
                <ul>
                  <li>操作前请确保电脑已断电</li>
                  <li>如果不确定，建议寻求专业人员帮助</li>
                  <li>重要数据请提前备份</li>
                </ul>
              </template>
            </t-alert>
          </div>
        </div>
      </template>
    </t-drawer>
  </div>
</template>

<style scoped>
.diagnosis-page {
  min-height: calc(100vh - 200px);
}

.diagnosis-layout {
  display: grid;
  grid-template-columns: 280px 350px 1fr;
  gap: 20px;
  min-height: 600px;
}

/* 左侧导航 */
.category-nav {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.nav-name {
  font-size: 14px;
  font-weight: 500;
}

.nav-count {
  font-size: 12px;
  color: var(--text-secondary);
}

/* AI诊断 */
.ai-diagnosis {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.ai-diagnosis .t-textarea {
  margin-bottom: 12px;
}

.ai-results {
  margin-top: 16px;
  background: #f8faff;
  border-radius: 10px;
  padding: 12px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.5;
}

.result-number {
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}

/* 问题列表 */
.issues-panel {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.issue-card {
  padding: 16px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.issue-card:hover {
  border-color: var(--primary-color);
}

.issue-card.active {
  border-color: var(--primary-color);
  background: rgba(102, 126, 234, 0.05);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-title {
  font-size: 15px;
  font-weight: 600;
}

.issue-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.issue-symptoms {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 解决方案 */
.solutions-panel {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.issue-detail {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.issue-detail h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.issue-detail p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.detail-section {
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.solution-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.solution-card:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.solution-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.solution-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.solution-preview {
  font-size: 12px;
  color: var(--text-secondary);
}

.solution-arrow {
  color: var(--text-secondary);
}

.empty-panel {
  background: var(--card-bg);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.empty-panel p {
  margin-top: 16px;
  font-size: 14px;
}

/* 解决方案详情 */
.solution-detail {
  padding: 20px;
}

.detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.meta-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.meta-card .t-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.meta-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.meta-value {
  font-size: 16px;
  font-weight: 600;
}

.tools-section,
.steps-section {
  margin-bottom: 24px;
}

.tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 12px;
}

.step-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  padding-top: 4px;
}

.tips-section ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
}

.tips-section li {
  margin-bottom: 6px;
}

@media (max-width: 1200px) {
  .diagnosis-layout {
    grid-template-columns: 1fr;
  }
  
  .category-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-header {
    width: 100%;
  }
  
  .ai-diagnosis {
    width: 100%;
  }
}
</style>
