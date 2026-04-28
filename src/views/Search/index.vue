<template>
  <div class="search-page page-wrapper">
    <div class="search-header">
      <van-icon name="arrow-left" size="20" class="back-icon" @click="goBack" />
      <div class="search-input-wrapper">
        <van-icon name="search" size="16" color="#999" />
        <input 
          type="text" 
          v-model="keyword" 
          placeholder="搜索课程、讲师..."
          class="search-input"
          @keyup.enter="handleSearch"
          @focus="onInputFocus"
          ref="searchInputRef"
        />
        <van-icon 
          v-if="keyword" 
          name="cross" 
          size="16" 
          color="#999" 
          class="clear-icon"
          @click="clearKeyword"
        />
      </div>
      <span class="search-btn" @click="handleSearch">搜索</span>
    </div>

    <div class="search-content">
      <template v-if="!hasSearched">
        <div class="history-section" v-if="searchHistory.length > 0">
          <div class="section-header">
            <span class="section-title">搜索历史</span>
            <van-icon name="delete" size="16" color="#999" @click="clearHistory" />
          </div>
          <div class="tag-list">
            <span 
              v-for="(item, index) in searchHistory" 
              :key="index"
              class="history-tag"
              @click="selectHistory(item)"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div class="hot-section">
          <div class="section-header">
            <span class="section-title">热门搜索</span>
          </div>
          <div class="tag-list">
            <span 
              v-for="(item, index) in hotSearches" 
              :key="index"
              class="hot-tag"
              :class="{ top: index < 3 }"
              @click="selectHotSearch(item)"
            >
              <span v-if="index < 3" class="rank">{{ index + 1 }}</span>
              {{ item }}
            </span>
          </div>
        </div>
      </template>

      <template v-else>
        <template v-if="searchResults.length > 0">
          <div class="result-tabs">
            <span 
              class="tab-item"
              :class="{ active: resultType === 'all' }"
              @click="resultType = 'all'"
            >
              全部 ({{ searchResults.length }})
            </span>
            <span 
              class="tab-item"
              :class="{ active: resultType === 'course' }"
              @click="resultType = 'course'"
            >
              课程 ({{ courseResults.length }})
            </span>
            <span 
              class="tab-item"
              :class="{ active: resultType === 'teacher' }"
              @click="resultType = 'teacher'"
            >
              讲师 ({{ teacherResults.length }})
            </span>
          </div>

          <div class="result-list">
            <template v-if="displayResults.length > 0">
              <template v-for="item in displayResults" :key="item.id">
                <div 
                  v-if="item.type === 'course'" 
                  class="course-result-item"
                  @click="goToCourse(item)"
                >
                  <van-image :src="item.cover" class="course-cover" />
                  <div class="course-info">
                    <h4 class="course-title">
                      <span v-html="highlightKeyword(item.title)"></span>
                    </h4>
                    <p class="course-desc">{{ item.description }}</p>
                    <div class="course-meta">
                      <span class="teacher-name">{{ item.teacherName }}</span>
                      <span class="student-count">{{ formatNumber(item.studentCount) }}人学习</span>
                      <span class="rating">
                        <van-rate v-model="item.rating" readonly :size="10" />
                        {{ item.rating }}
                      </span>
                    </div>
                    <div class="course-price">
                      <span v-if="item.isFree" class="free-tag">免费</span>
                      <span v-else class="price">¥{{ item.price }}</span>
                      <span v-if="item.originalPrice > item.price" class="original-price">¥{{ item.originalPrice }}</span>
                    </div>
                  </div>
                </div>

                <div 
                  v-else-if="item.type === 'teacher'" 
                  class="teacher-result-item"
                  @click="goToTeacher(item)"
                >
                  <van-image :src="item.avatar" class="teacher-avatar" round />
                  <div class="teacher-info">
                    <h4 class="teacher-name">
                      <span v-html="highlightKeyword(item.name)"></span>
                      <van-tag type="primary" size="mini" plain>讲师</van-tag>
                    </h4>
                    <p class="teacher-title">{{ item.title }}</p>
                    <div class="teacher-stats">
                      <span class="stat">粉丝 {{ formatNumber(item.followerCount) }}</span>
                      <span class="stat">课程 {{ item.courseCount }}</span>
                      <span class="stat">学员 {{ formatNumber(item.totalStudentCount) }}</span>
                    </div>
                    <div class="teacher-tags">
                      <van-tag v-for="tag in item.tags?.slice(0, 3)" :key="tag" size="mini" type="primary" plain>
                        {{ tag }}
                      </van-tag>
                    </div>
                  </div>
                  <van-button 
                    size="small" 
                    :type="item.isFollowed ? 'default' : 'primary'"
                    :text="item.isFollowed ? '已关注' : '关注'"
                    @click.stop="toggleFollow(item)"
                  />
                </div>
              </template>
            </template>
            <van-empty v-else description="暂无相关内容" />
          </div>
        </template>
        <van-empty 
          v-else 
          image="search"
          description="没有找到相关内容"
        >
          <template #description>
            <p class="empty-text">没有找到"{{ keyword }}"相关的课程或讲师</p>
            <p class="empty-tip">试试其他关键词吧</p>
          </template>
          <van-button type="primary" size="small" @click="clearKeyword">
            清除搜索
          </van-button>
        </van-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { courses, teachers, formatNumber } from '@/data/mockData'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const searchInputRef = ref(null)
const keyword = ref('')
const hasSearched = ref(false)
const resultType = ref('all')
const searchResults = ref([])
const searchHistory = ref([])

const hotSearches = [
  'Python', 'Java', '前端开发', 'UI设计', '产品经理',
  '机器学习', '人工智能', '数据分析', '运营', '职场'
]

onMounted(() => {
  const savedHistory = localStorage.getItem('searchHistory')
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory)
  }
  
  if (route.query.keyword) {
    keyword.value = route.query.keyword
    nextTick(() => {
      handleSearch()
    })
  }
})

const courseResults = computed(() => {
  return searchResults.value.filter(item => item.type === 'course')
})

const teacherResults = computed(() => {
  return searchResults.value.filter(item => item.type === 'teacher')
})

const displayResults = computed(() => {
  if (resultType.value === 'course') return courseResults.value
  if (resultType.value === 'teacher') return teacherResults.value
  return searchResults.value
})

const goBack = () => {
  router.back()
}

const clearKeyword = () => {
  keyword.value = ''
  hasSearched.value = false
  searchResults.value = []
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const onInputFocus = () => {
  if (hasSearched.value && !keyword.value) {
    hasSearched.value = false
  }
}

const handleSearch = () => {
  if (!keyword.value.trim()) {
    showToast('请输入搜索关键词')
    return
  }

  const searchKey = keyword.value.trim().toLowerCase()
  
  const matchedCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(searchKey) ||
           course.description.toLowerCase().includes(searchKey) ||
           course.teacherName.toLowerCase().includes(searchKey) ||
           course.categoryName.toLowerCase().includes(searchKey) ||
           (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchKey)))
  }).map(course => ({ ...course, type: 'course' }))

  const matchedTeachers = teachers.filter(teacher => {
    return teacher.name.toLowerCase().includes(searchKey) ||
           teacher.title.toLowerCase().includes(searchKey) ||
           teacher.introduction.toLowerCase().includes(searchKey) ||
           (teacher.tags && teacher.tags.some(tag => tag.toLowerCase().includes(searchKey)))
  }).map(teacher => ({ ...teacher, type: 'teacher' }))

  searchResults.value = [...matchedCourses, ...matchedTeachers]
  hasSearched.value = true

  if (keyword.value.trim()) {
    addToHistory(keyword.value.trim())
  }
}

const addToHistory = (item) => {
  const index = searchHistory.value.indexOf(item)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(item)
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
  showToast('已清空搜索历史')
}

const selectHistory = (item) => {
  keyword.value = item
  handleSearch()
}

const selectHotSearch = (item) => {
  keyword.value = item
  handleSearch()
}

const highlightKeyword = (text) => {
  if (!keyword.value || !text) return text
  const regex = new RegExp(`(${keyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="highlight-text">$1</span>')
}

const goToCourse = (course) => {
  router.push(`/course/${course.id}`)
}

const goToTeacher = (teacher) => {
  router.push(`/teacher/${teacher.id}`)
}

const toggleFollow = (teacher) => {
  teacher.isFollowed = !teacher.isFollowed
  showToast(teacher.isFollowed ? '关注成功' : '已取消关注')
}
</script>

<style lang="less" scoped>
.search-page {
  background: #f5f7fa;
  min-height: 100vh;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.back-icon {
  color: #333;
  flex-shrink: 0;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fa;
  border-radius: 20px;
  padding: 10px 16px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
}

.clear-icon {
  flex-shrink: 0;
}

.search-btn {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  flex-shrink: 0;
}

.search-content {
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-tag {
  font-size: 13px;
  color: var(--text-color-secondary);
  padding: 8px 16px;
  background: #f5f7fa;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
}

.hot-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-color-secondary);
  padding: 8px 16px;
  background: #f5f7fa;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  
  &.top {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
    color: var(--primary-color);
  }
}

.rank {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-section {
  margin-bottom: 24px;
}

.hot-section {
  margin-bottom: 24px;
}

.result-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  font-size: 14px;
  color: var(--text-color-secondary);
  position: relative;
  
  &.active {
    color: var(--primary-color);
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }
  }
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-result-item {
  display: flex;
  gap: 12px;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: var(--shadow-sm);
}

.course-cover {
  width: 120px;
  height: 80px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.course-desc {
  font-size: 12px;
  color: var(--text-color-tertiary);
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px;
  color: var(--text-color-tertiary);
}

.teacher-name {
  font-size: 11px;
}

.student-count {
  font-size: 11px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
}

.course-price {
  display: flex;
  align-items: center;
  gap: 6px;
}

.free-tag {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
}

.price {
  font-size: 14px;
  font-weight: 600;
  color: #ff6b6b;
}

.original-price {
  font-size: 12px;
  color: var(--text-color-tertiary);
  text-decoration: line-through;
}

.teacher-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-sm);
}

.teacher-avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.teacher-title {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-bottom: 6px;
}

.teacher-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 11px;
  color: var(--text-color-tertiary);
}

.teacher-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.highlight-text {
  color: var(--primary-color);
  font-weight: 600;
}

.empty-text {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.empty-tip {
  font-size: 12px;
  color: var(--text-color-tertiary);
}
</style>
