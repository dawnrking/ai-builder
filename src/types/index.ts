// 硬件类型
export type HardwareType = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler'

// 硬件基础信息
export interface Hardware {
  id: string
  type: HardwareType
  name: string
  brand: string
  model: string
  price: number
  image: string
  specs: Record<string, string | number>
  benchmark?: number
  tdp?: number
  releaseDate: string
}

// CPU规格
export interface CPU extends Hardware {
  type: 'cpu'
  specs: {
    cores: number
    threads: number
    baseClock: number
    boostClock: number
    cache: string
    socket: string
    tdp: number
    architecture: string
  }
}

// 显卡规格
export interface GPU extends Hardware {
  type: 'gpu'
  specs: {
    vram: number
    vramType: string
    baseClock: number
    boostClock: number
    cudaCores?: number
    streamProcessors?: number
    tdp: number
    length: number
    slots: number
  }
}

// 主板规格
export interface Motherboard extends Hardware {
  type: 'motherboard'
  specs: {
    socket: string
    chipset: string
    formFactor: string
    memorySlots: number
    maxMemory: number
    memoryType: string
    pciSlots: number
    m2Slots: number
    sataSlots: number
  }
}

// 内存规格
export interface RAM extends Hardware {
  type: 'ram'
  specs: {
    capacity: number
    speed: number
    type: string
    timing: string
    voltage: number
    modules: number
  }
}

// 存储规格
export interface Storage extends Hardware {
  type: 'storage'
  specs: {
    capacity: number
    interface: string
    readSpeed: number
    writeSpeed: number
    formFactor: string
    type: 'SSD' | 'HDD' | 'NVMe'
  }
}

// 电源规格
export interface PSU extends Hardware {
  type: 'psu'
  specs: {
    wattage: number
    efficiency: string
    modular: 'Full' | 'Semi' | 'Non'
    formFactor: string
    fanSize: number
  }
}

// 机箱规格
export interface Case extends Hardware {
  type: 'case'
  specs: {
    formFactor: string
    maxGpuLength: number
    maxCoolerHeight: number
    driveBays: string
    fans: string
    material: string
  }
}

// 散热器规格
export interface Cooler extends Hardware {
  type: 'cooler'
  specs: {
    type: 'Air' | 'AIO' | 'Custom'
    tdp: number
    fanSize: number
    height?: number
    radiatorSize?: number
    noise: number
  }
}

// 装机配置
export interface BuildConfig {
  id: string
  name: string
  cpu?: CPU
  gpu?: GPU
  motherboard?: Motherboard
  ram?: RAM
  storage?: Storage[]
  psu?: PSU
  case?: Case
  cooler?: Cooler
  totalPrice: number
  estimatedBenchmark: number
  compatibility: CompatibilityResult
}

// 兼容性检查结果
export interface CompatibilityResult {
  isCompatible: boolean
  issues: CompatibilityIssue[]
  warnings: CompatibilityIssue[]
}

export interface CompatibilityIssue {
  type: 'error' | 'warning'
  code: string
  message: string
  affectedParts: HardwareType[]
  suggestion?: string
}

// 商家信息
export interface Merchant {
  id: string
  name: string
  logo: string
  rating: number
  reviews: number
  sales: number
  verified: boolean
  location: string
}

// 商品列表项
export interface ProductListing {
  id: string
  hardware: Hardware
  merchant: Merchant
  price: number
  originalPrice?: number
  stock: number
  sales: number
  shipping: string
  warranty: string
  userRating: number
  reviewCount: number
}

// 跑分数据
export interface BenchmarkResult {
  overall: number
  cpu: {
    singleCore: number
    multiCore: number
    rendering: number
  }
  gpu: {
    gaming1080p: number
    gaming1440p: number
    gaming4k: number
    compute: number
  }
  storage: {
    read: number
    write: number
  }
  memory: {
    bandwidth: number
    latency: number
  }
}

// AI对话消息
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  recommendedConfig?: BuildConfig
}

// 诊断问题
export interface DiagnosticIssue {
  id: string
  category: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  solutions: Solution[]
}

export interface Solution {
  id: string
  title: string
  description: string
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
}
