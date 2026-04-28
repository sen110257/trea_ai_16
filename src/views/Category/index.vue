<template>
  <div class="category-page page-wrapper">
    <van-nav-bar title="课程分类" fixed placeholder />
    
    <div class="category-content">
      <div class="category-tabs">
        <van-tabs 
          v-model="activeCategory" 
          color="#667eea" 
          line-width="24"
          :animated="false"
        >
          <van-tab 
            v-for="category in categories" 
            :key="category.id" 
            :name="category.id"
            :title="category.name"
          />
        </van-tabs>
      </div>

      <div class="filter-bar">
        <div class="filter-section">
          <span class="filter-label">类型：</span>
          <div class="filter-options">
            <span 
              v-for="type in filterTypes" 
              :key="type.value"
              class="filter-option"
              :class="{ active: filters.type === type.value }"
              @click="updateFilter('type', type.value)"
            >
              {{ type.label }}
            </span>
          </div>
        </div>
        
        <div class="filter-section">
          <span class="filter-label">难度：</span>
          <div class="filter-options">
            <span 
              v-for="diff in difficulties" 
              :key="diff.value"
              class="filter-option"
              :class="{ active: filters.difficulty === diff.value }"
              @click="updateFilter('difficulty', diff.value)"
            >
              {{ diff.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="sort-bar">
        <div class="sort-options">
          <span 
            v-for="sort in sortOptions" 
            :key="sort.value"
            class="sort-option"
            :class="{ active: currentSort === sort.value }"
            @click="handleSort(sort.value)"
          >
            {{ sort.label }}
            <van-icon 
              v-if="currentSort === sort.value && sort.hasArrow" 
              :name="sortAsc ? 'arrow-up' : 'arrow-down'" 
              size="10"
            />
          </span>
        </div>
        <div class="sort-action" @click="toggleFilterPopup">
          <van-icon name="filter-o" size="14" />
          <span>筛选</span>
        </div>
      </div>

      <div class="course-list">
        <div v-if="filteredCourses.length === 0" class="empty-state">
          <van-empty description="暂无相关课程" />
        </div>
        <CourseCard 
          v-for="course in filteredCourses" 
          :key="course.id" 
          :course="course" 
        />
      </div>
    </div>

    <van-popup 
      v-model:show="showFilterPopup" 
      position="bottom" 
      :style="{ height: '60%' }"
      round
    >
      <div class="filter-popup">
        <div class="popup-header">
          <span class="popup-title">筛选条件</span>
          <van-icon name="close" size="20" @click="showFilterPopup = false" />
        </div>
        
        <div class="popup-content">
          <div class="filter-group">
            <h4 class="group-title">课程类型</h4>
            <div class="group-options">
              <van-tag 
                v-for="type in filterTypes" 
                :key="type.value"
                :type="filters.type === type.value ? 'primary' : 'default'"
                plain
                @click="updateFilter('type', type.value)"
              >
                {{ type.label }}
              </van-tag>
            </div>
          </div>

          <div class="filter-group">
            <h4 class="group-title">课程难度</h4>
            <div class="group-options">
              <van-tag 
                v-for="diff in difficulties" 
                :key="diff.value"
                :type="filters.difficulty === diff.value ? 'primary' : 'default'"
                plain
                @click="updateFilter('difficulty', diff.value)"
              >
                {{ diff.label }}
              </van-tag>
            </div>
          </div>

          <div class="filter-group">
            <h4 class="group-title">价格区间</h4>
            <div class="group-options">
              <van-tag 
                v-for="price in priceRanges" 
                :key="price.value"
                :type="filters.price === price.value ? 'primary' : 'default'"
                plain
                @click="updateFilter('price', price.value)"
              >
                {{ price.label }}
              </van-tag>
            </div>
          </div>
        </div>

        <div class="popup-footer">
          <van-button type="default" @click="resetFilters">重置</van-button>
          <van-button type="primary" @click="applyFilters">完成</van-button>
        </div>
      </div>
    </van-popup>

    <div class="bottom-space"></div>
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categories, getCoursesByCategory, formatNumber } from '@/data/mockData'
import TabBar from '@/components/TabBar/index.vue'
import CourseCard from '@/components/CourseCard/index.vue'

const route = useRoute()

const activeCategory = ref(1)
const currentSort = ref('popular')
const sortAsc = ref(false)
const showFilterPopup = ref(false)

const filters = ref({
  type: 'all',
  difficulty: 'all',
  price: 'all'
})

const filterTypes = [
  { label: '全部', value: 'all' },
  { label: '免费', value: 'free' },
  { label: '付费', value: 'paid' }
]

const difficulties = [
  { label: '全部', value: 'all' },
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const priceRanges = [
  { label: '全部', value: 'all' },
  { label: '0-50元', value: '0-50' },
  { label: '50-200元', value: '50-200' },
  { label: '200元以上', value: '200+' }
]

const sortOptions = [
  { label: '综合', value: 'default', hasArrow: false },
  { label: '人气', value: 'popular', hasArrow: true },
  { label: '最新', value: 'newest', hasArrow: true },
  { label: '价格', value: 'price', hasArrow: true }
]

watch(
  () => route.query.categoryId,
  (id) => {
    if (id) {
      activeCategory.value = parseInt(id)
    }
  },
  { immediate: true }
)

const categoryCourses = computed(() => {
  return getCoursesByCategory(activeCategory.value)
})

const filteredCourses = computed(() => {
  let result = [...categoryCourses.value]
  
  if (filters.value.type === 'free') {
    result = result.filter(c => c.isFree)
  } else if (filters.value.type === 'paid') {
    result = result.filter(c => !c.isFree)
  }
  
  if (filters.value.difficulty !== 'all') {
    result = result.filter(c => c.difficulty === filters.value.difficulty)
  }
  
  if (filters.value.price !== 'all') {
    const [min, max] = filters.value.price.split('-').map(Number)
    if (filters.value.price === '200+') {
      result = result.filter(c => c.price >= 200)
    } else {
      result = result.filter(c => c.price >= min && c.price <= max)
    }
  }
  
  switch (currentSort.value) {
    case 'popular':
      result.sort((a, b) => sortAsc.value ? a.studentCount - b.studentCount : b.studentCount - a.studentCount)
      break
    case 'newest':
      result.sort((a, b) => sortAsc.value 
        ? new Date(a.createdAt) - new Date(b.createdAt) 
        : new Date(b.createdAt) - new Date(a.createdAt)
      )
      break
    case 'price':
      result.sort((a, b) => sortAsc.value ? a.price - b.price : b.price - a.price)
      break
  }
  
  return result
})

const updateFilter = (key, value) => {
  filters.value[key] = value
}

const handleSort = (sortValue) => {
  if (currentSort.value === sortValue && sortValue !== 'default') {
    sortAsc.value = !sortAsc.value
  } else {
    currentSort.value = sortValue
    sortAsc.value = false
  }
}

const toggleFilterPopup = () => {
  showFilterPopup.value = !showFilterPopup.value
}

const resetFilters = () => {
  filters.value = {
    type: 'all',
    difficulty: 'all',
    price: 'all'
  }
}

const applyFilters = () => {
  showFilterPopup.value = false
}
</script>

<style lang="less" scoped>
.category-page {
  background: #f5f7fa;
}

.category-content {
  padding-top: 0;
}

.category-tabs {
  background: #fff;
  position: sticky;
  top: 46px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  :deep(.van-tabs__nav) {
    padding: 0 12px;
  }
  
  :deep(.van-tab) {
    font-size: 14px;
    color: #666;
    font-weight: normal;
    padding: 12px 16px;
    min-width: auto;
  }
  
  :deep(.van-tab--active) {
    color: var(--primary-color);
    font-weight: 600;
  }
  
  :deep(.van-tabs__line) {
    height: 3px;
    border-radius: 2px;
    bottom: 0;
    background: var(--primary-gradient);
  }
}

.filter-bar {
  background: #fff;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-top: 0;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  width: 50px;
  flex-shrink: 0;
}

.filter-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-option {
  font-size: 13px;
  color: #666;
  padding: 6px 14px;
  border-radius: 16px;
  background: #f7f7f7;
  transition: all 0.2s;
  border: 1px solid transparent;
  
  &.active {
    background: rgba(102, 126, 234, 0.1);
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
}

.sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.sort-options {
  display: flex;
  gap: 20px;
}

.sort-option {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
  }
}

.sort-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  padding: 4px 10px;
  background: #f7f7f7;
  border-radius: 14px;
}

.course-list {
  padding: 0 16px;
}

.empty-state {
  padding: 40px 0;
}

.filter-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.filter-group {
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.group-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  :deep(.van-tag) {
    padding: 6px 14px;
    font-size: 13px;
  }
}

.popup-footer {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #f5f5f5;
  
  .van-button {
    flex: 1;
  }
}

.bottom-space {
  height: 30px;
}
</style>
