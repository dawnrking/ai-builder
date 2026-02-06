import type { Merchant, ProductListing } from '../types'
import { cpuList, gpuList, ramList, storageList } from './hardware'

export const merchants: Merchant[] = [
  {
    id: 'merchant-001',
    name: '京东自营',
    logo: '/images/jd-logo.png',
    rating: 4.9,
    reviews: 125680,
    sales: 3560000,
    verified: true,
    location: '北京'
  },
  {
    id: 'merchant-002',
    name: '天猫旗舰店',
    logo: '/images/tmall-logo.png',
    rating: 4.8,
    reviews: 89320,
    sales: 2340000,
    verified: true,
    location: '上海'
  },
  {
    id: 'merchant-003',
    name: '拼多多百亿补贴',
    logo: '/images/pdd-logo.png',
    rating: 4.6,
    reviews: 56780,
    sales: 1890000,
    verified: true,
    location: '上海'
  },
  {
    id: 'merchant-004',
    name: '淘宝皇冠店铺',
    logo: '/images/taobao-logo.png',
    rating: 4.7,
    reviews: 34560,
    sales: 890000,
    verified: false,
    location: '深圳'
  },
  {
    id: 'merchant-005',
    name: 'Newegg中国',
    logo: '/images/newegg-logo.png',
    rating: 4.5,
    reviews: 12340,
    sales: 456000,
    verified: true,
    location: '广州'
  },
  {
    id: 'merchant-006',
    name: '苏宁易购',
    logo: '/images/suning-logo.png',
    rating: 4.7,
    reviews: 67890,
    sales: 1560000,
    verified: true,
    location: '南京'
  }
]

// 生成商品列表
export const generateProductListings = (hardwareId: string): ProductListing[] => {
  const hardware = [...cpuList, ...gpuList, ...ramList, ...storageList].find(h => h.id === hardwareId)
  if (!hardware) return []

  return merchants.map((merchant, index) => {
    const priceVariation = (Math.random() - 0.5) * 0.1 // ±5% 价格浮动
    const basePrice = hardware.price
    const adjustedPrice = Math.round(basePrice * (1 + priceVariation))
    
    return {
      id: `listing-${hardwareId}-${merchant.id}`,
      hardware,
      merchant,
      price: adjustedPrice,
      originalPrice: index === 2 ? Math.round(adjustedPrice * 1.15) : undefined, // 拼多多显示原价
      stock: Math.floor(Math.random() * 500) + 10,
      sales: Math.floor(Math.random() * 10000) + 100,
      shipping: index === 0 ? '免运费' : index === 2 ? '包邮' : '满99包邮',
      warranty: index < 3 ? '官方质保' : '店铺质保',
      userRating: 4 + Math.random() * 1,
      reviewCount: Math.floor(Math.random() * 5000) + 50
    }
  }).sort((a, b) => a.price - b.price)
}

// 热门商品对比数据
export const popularComparisons = [
  {
    category: 'CPU',
    products: cpuList.slice(0, 3).map(cpu => ({
      ...cpu,
      listings: generateProductListings(cpu.id).slice(0, 4)
    }))
  },
  {
    category: 'GPU',
    products: gpuList.slice(0, 3).map(gpu => ({
      ...gpu,
      listings: generateProductListings(gpu.id).slice(0, 4)
    }))
  }
]
