<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Hardware, ProductListing } from '../types'
import { cpuList, gpuList, ramList, storageList } from '../mock/hardware'
import { generateProductListings } from '../mock/merchants'

type CategoryType = 'all' | 'cpu' | 'gpu' | 'ram' | 'storage'

const activeCategory = ref<CategoryType>('all')
const searchKeyword = ref('')
const sortBy = ref<'price' | 'sales' | 'rating'>('price')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedProduct = ref<Hardware | null>(null)
const showDetail = ref(false)
const productListings = ref<ProductListing[]>([])

const categories = [
  { value: 'all', label: '全部', icon: 'view-module' },
  { value: 'cpu', label: 'CPU', icon: 'cpu' },
  { value: 'gpu', label: '显卡', icon: 'image' },
  { value: 'ram', label: '内存', icon: 'server' },
  { value: 'storage', label: '存储', icon: 'hard-drive' }
]

const allProducts = computed(() => {
  let products: Hardware[] = []
  
  if (activeCategory.value === 'all' || activeCategory.value === 'cpu') {
    products = [...products, ...cpuList]
  }
  if (activeCategory.value === 'all' || activeCategory.value === 'gpu') {
    products = [...products, ...gpuList]
  }
  if (activeCategory.value === 'all' || activeCategory.value === 'ram') {
    products = [...products, ...ramList]
  }
  if (activeCategory.value === 'all' || activeCategory.value === 'storage') {
    products = [...products, ...storageList]
  }
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(keyword) ||
      p.brand.toLowerCase().includes(keyword) ||
      p.model.toLowerCase().includes(keyword)
    )
  }
  
  return products
})

const openProductDetail = (product: Hardware) => {
  selectedProduct.value = product
  productListings.value = generateProductListings(product.id)
  
  // 排序
  sortListings()
  showDetail.value = true
}

const sortListings = () => {
  productListings.value.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'price') {
      comparison = a.price - b.price
    } else if (sortBy.value === 'sales') {
      comparison = b.sales - a.sales
    } else if (sortBy.value === 'rating') {
      comparison = b.userRating - a.userRating
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
}

const handleSortChange = () => {
  sortListings()
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    cpu: 'CPU',
    gpu: '显卡',
    ram: '内存',
    storage: '存储',
    motherboard: '主板',
    psu: '电源',
    case: '机箱',
    cooler: '散热器'
  }
  return labels[type] || type
}

const formatPrice = (price: number) => {
  return `¥${price.toLocaleString()}`
}

const getRatingStars = (rating: number) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}

const getPriceTag = (listing: ProductListing, allListings: ProductListing[]) => {
  const minPrice = Math.min(...allListings.map(l => l.price))
  if (listing.price === minPrice) {
    return { text: '最低价', color: '#00a870' }
  }
  if (listing.originalPrice) {
    const discount = Math.round((1 - listing.price / listing.originalPrice) * 100)
    return { text: `降${discount}%`, color: '#e34d59' }
  }
  return null
}


</script>

<template>
  <div class="compare-page">
    <div class="page-header">
      <h1 class="page-title">商家比价</h1>
      <p class="page-subtitle">多平台价格对比，找到最优惠的商家</p>
    </div>
    
    <!-- 筛选栏 -->
    <div class="filter-bar card">
      <div class="category-tabs">
        <div 
          v-for="cat in categories" 
          :key="cat.value" 
          :class="['tab-item', { active: activeCategory === cat.value }]"
          @click="activeCategory = cat.value as CategoryType"
        >
          <t-icon :name="cat.icon" />
          <span>{{ cat.label }}</span>
        </div>
      </div>
      
      <div class="search-box">
        <t-input 
          v-model="searchKeyword" 
          placeholder="搜索产品型号、品牌..."
          clearable
        >
          <template #prefix-icon>
            <t-icon name="search" />
          </template>
        </t-input>
      </div>
    </div>
    
    <!-- 产品列表 -->
    <div class="products-grid">
      <div 
        v-for="product in allProducts" 
        :key="product.id" 
        class="product-card"
        @click="openProductDetail(product)"
      >
        <div class="product-badge">{{ getTypeLabel(product.type) }}</div>
        <div class="product-image">
          <t-icon name="image" size="48px" />
        </div>
        <div class="product-info">
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-specs">
            <template v-if="product.type === 'cpu'">
              {{ (product as any).specs.cores }}核 {{ (product as any).specs.boostClock }}GHz
            </template>
            <template v-else-if="product.type === 'gpu'">
              {{ (product as any).specs.vram }}GB {{ (product as any).specs.vramType }}
            </template>
            <template v-else-if="product.type === 'ram'">
              {{ (product as any).specs.capacity }}GB {{ (product as any).specs.speed }}MHz
            </template>
            <template v-else-if="product.type === 'storage'">
              {{ (product as any).specs.capacity }}GB {{ (product as any).specs.type }}
            </template>
          </div>
        </div>
        <div class="product-price">
          <div class="price-label">参考价</div>
          <div class="price-value">{{ formatPrice(product.price) }}</div>
        </div>
        <div class="compare-hint">
          <t-icon name="swap" />
          点击比价
        </div>
      </div>
    </div>
    
    <!-- 商家对比弹窗 -->
    <t-drawer 
      v-model:visible="showDetail" 
      size="700px"
      :header="selectedProduct?.name || '商家比价'"
    >
      <template v-if="selectedProduct">
        <div class="detail-header">
          <div class="detail-product">
            <div class="detail-image">
              <t-icon name="image" size="64px" />
            </div>
            <div class="detail-info">
              <div class="detail-brand">{{ selectedProduct.brand }}</div>
              <div class="detail-name">{{ selectedProduct.name }}</div>
              <div class="detail-specs">
                <template v-if="selectedProduct.type === 'cpu'">
                  {{ (selectedProduct as any).specs.cores }}核{{ (selectedProduct as any).specs.threads }}线程 | 
                  {{ (selectedProduct as any).specs.baseClock }}-{{ (selectedProduct as any).specs.boostClock }}GHz | 
                  {{ (selectedProduct as any).specs.socket }}
                </template>
                <template v-else-if="selectedProduct.type === 'gpu'">
                  {{ (selectedProduct as any).specs.vram }}GB {{ (selectedProduct as any).specs.vramType }} | 
                  {{ (selectedProduct as any).specs.tdp }}W
                </template>
              </div>
            </div>
          </div>
          
          <div class="sort-options">
            <span class="sort-label">排序：</span>
            <t-radio-group v-model="sortBy" @change="handleSortChange">
              <t-radio-button value="price">价格</t-radio-button>
              <t-radio-button value="sales">销量</t-radio-button>
              <t-radio-button value="rating">评分</t-radio-button>
            </t-radio-group>
            <t-button 
              variant="text" 
              @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; handleSortChange()"
            >
              <t-icon :name="sortOrder === 'asc' ? 'order-ascending' : 'order-descending'" />
            </t-button>
          </div>
        </div>
        
        <div class="merchants-list">
          <div 
            v-for="(listing, index) in productListings" 
            :key="listing.id" 
            :class="['merchant-card', { best: index === 0 && sortBy === 'price' }]"
          >
            <div class="merchant-rank" v-if="index < 3">
              {{ index + 1 }}
            </div>
            
            <div class="merchant-info">
              <div class="merchant-header">
                <div class="merchant-name">
                  {{ listing.merchant.name }}
                  <t-tag v-if="listing.merchant.verified" size="small" theme="primary" variant="light">
                    官方认证
                  </t-tag>
                </div>
                <div class="merchant-location">
                  <t-icon name="location" size="14px" />
                  {{ listing.merchant.location }}
                </div>
              </div>
              
              <div class="merchant-stats">
                <div class="stat-item">
                  <div class="stat-label">商家评分</div>
                  <div class="stat-value rating">
                    <span class="rating-number">{{ listing.merchant.rating.toFixed(1) }}</span>
                    <div class="rating-stars">
                      <t-icon 
                        v-for="n in getRatingStars(listing.merchant.rating).full" 
                        :key="`full-${n}`" 
                        name="star-filled" 
                        class="star filled"
                      />
                      <t-icon 
                        v-for="n in getRatingStars(listing.merchant.rating).empty" 
                        :key="`empty-${n}`" 
                        name="star" 
                        class="star"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-label">已售</div>
                  <div class="stat-value">{{ listing.sales.toLocaleString() }}+</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-label">库存</div>
                  <div class="stat-value" :class="{ low: listing.stock < 50 }">
                    {{ listing.stock > 100 ? '充足' : listing.stock + '件' }}
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-label">评价</div>
                  <div class="stat-value">
                    {{ listing.userRating.toFixed(1) }} ({{ listing.reviewCount }}条)
                  </div>
                </div>
              </div>
              
              <div class="merchant-tags">
                <t-tag size="small" variant="outline">{{ listing.shipping }}</t-tag>
                <t-tag size="small" variant="outline">{{ listing.warranty }}</t-tag>
              </div>
            </div>
            
            <div class="merchant-price">
              <div class="price-tag" v-if="getPriceTag(listing, productListings)">
                <span :style="{ color: getPriceTag(listing, productListings)?.color }">
                  {{ getPriceTag(listing, productListings)?.text }}
                </span>
              </div>
              <div class="price-original" v-if="listing.originalPrice">
                {{ formatPrice(listing.originalPrice) }}
              </div>
              <div class="price-current">{{ formatPrice(listing.price) }}</div>
              <t-button theme="primary" size="small">
                去购买
                <template #suffix><t-icon name="jump" /></template>
              </t-button>
            </div>
          </div>
        </div>
        
        <!-- 商家综合评分说明 -->
        <div class="score-explanation">
          <h4>商家评分说明</h4>
          <div class="explanation-grid">
            <div class="explanation-item">
              <t-icon name="star-filled" />
              <span>评分：商家服务评分占比75%</span>
            </div>
            <div class="explanation-item">
              <t-icon name="cart" />
              <span>销量：历史销量占比15%</span>
            </div>
            <div class="explanation-item">
              <t-icon name="secured" />
              <span>认证：官方认证加10分</span>
            </div>
          </div>
        </div>
      </template>
    </t-drawer>
  </div>
</template>

<style scoped>
.compare-page {
  min-height: calc(100vh - 200px);
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  gap: 8px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tab-item:hover {
  background: #f3f4f6;
}

.tab-item.active {
  background: var(--primary-color);
  color: #fff;
}

.search-box {
  width: 300px;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.product-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 82, 217, 0.12);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
}

.product-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  margin-bottom: 16px;
}

.product-info {
  text-align: center;
  margin-bottom: 16px;
}

.product-brand {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-specs {
  font-size: 12px;
  color: var(--text-secondary);
}

.product-price {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.price-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.compare-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 0 0 14px 14px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.product-card:hover .compare-hint {
  opacity: 1;
  transform: translateY(0);
}

/* 商家对比详情 */
.detail-header {
  margin-bottom: 24px;
}

.detail-product {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.detail-image {
  width: 100px;
  height: 100px;
  background: #f9fafb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
}

.detail-info {
  flex: 1;
}

.detail-brand {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.detail-specs {
  font-size: 13px;
  color: var(--text-secondary);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 商家列表 */
.merchants-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.merchant-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.merchant-card:hover {
  border-color: var(--primary-color);
}

.merchant-card.best {
  background: linear-gradient(135deg, rgba(0, 168, 112, 0.05), rgba(0, 168, 112, 0.1));
  border-color: var(--success-color);
}

.merchant-rank {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffd700, #ffb700);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.merchant-card:nth-child(2) .merchant-rank {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
}

.merchant-card:nth-child(3) .merchant-rank {
  background: linear-gradient(135deg, #cd7f32, #b87333);
}

.merchant-info {
  flex: 1;
  min-width: 0;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.merchant-location {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.merchant-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 13px;
  font-weight: 500;
}

.stat-value.rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating-number {
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: #d1d5db;
}

.star.filled {
  color: #fbbf24;
}

.stat-value.low {
  color: var(--error-color);
}

.merchant-tags {
  display: flex;
  gap: 8px;
}

.merchant-price {
  text-align: right;
  flex-shrink: 0;
}

.price-tag {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.price-original {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: line-through;
  margin-bottom: 2px;
}

.price-current {
  font-size: 24px;
  font-weight: 700;
  color: var(--error-color);
  margin-bottom: 12px;
}

/* 评分说明 */
.score-explanation {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px 20px;
}

.score-explanation h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.explanation-grid {
  display: flex;
  gap: 24px;
}

.explanation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-bar {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-box {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
