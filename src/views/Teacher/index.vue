<template>
  <div class="teacher-page page-wrapper">
    <van-nav-bar 
      fixed 
      placeholder
      :style="navBarStyle"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" @click="goBack" />
      </template>
      <template #right>
        <van-icon name="share-o" size="20" @click="onShare" />
      </template>
    </van-nav-bar>

    <div class="teacher-header">
      <div class="header-bg"></div>
      <div class="teacher-info">
        <van-image :src="teacher?.avatar" class="teacher-avatar" round />
        <div class="info-content">
          <div class="name-row">
            <h1 class="teacher-name">{{ teacher?.name }}</h1>
            <van-button 
              :type="teacher?.isFollowed ? 'default' : 'primary'"
              size="small"
              :plain="teacher?.isFollowed"
              @click="toggleFollow"
            >
              {{ teacher?.isFollowed ? '已关注' : '关注' }}
            </van-button>
          </div>
          <p class="teacher-title">{{ teacher?.title }}</p>
          <div class="teacher-tags">
            <van-tag v-for="tag in teacher?.tags" :key="tag" size="mini" plain type="primary">
              {{ tag }}
            </van-tag>
          </div>
        </div>
      </div>
      
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ formatNumber(teacher?.followerCount || 0) }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ teacher?.courseCount || 0 }}</span>
          <span class="stat-label">课程</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ formatNumber(teacher?.totalStudentCount || 0) }}</span>
          <span class="stat-label">学员</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ teacher?.rating || 0 }}</span>
          <span class="stat-label">评分</span>
        </div>
      </div>
    </div>

    <div class="intro-section">
      <h3 class="section-title">讲师简介</h3>
      <p class="intro-text">{{ teacher?.introduction }}</p>
    </div>

    <div class="courses-section">
      <div class="section-header">
        <h3 class="section-title">全部课程</h3>
        <div class="sort-options">
          <span 
            v-for="sort in sortOptions" 
            :key="sort.value"
            class="sort-option"
            :class="{ active: currentSort === sort.value }"
            @click="currentSort = sort.value"
          >
            {{ sort.label }}
          </span>
        </div>
      </div>
      
      <div class="course-list">
        <CourseCard v-for="course in sortedCourses" :key="course.id" :course="course" />
      </div>
      
      <div v-if="sortedCourses.length === 0" class="empty-state">
        <van-empty description="暂无课程" />
      </div>
    </div>

    <div class="bottom-space"></div>

    <van-action-sheet 
      v-model:show="showShareSheet" 
      :actions="shareActions"
      cancel-text="取消"
      @select="onShareSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTeacherById, teachers, courses, formatNumber } from '@/data/mockData'
import CourseCard from '@/components/CourseCard/index.vue'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()

const teacherId = computed(() => parseInt(route.params.id))
const teacher = ref(null)

const currentSort = ref('popular')
const scrollTop = ref(0)
const showShareSheet = ref(false)

const shareActions = [
  { name: '分享到微信', icon: 'wechat' },
  { name: '分享到朋友圈', icon: 'friends-o' },
  { name: '复制链接', icon: 'link-o' }
]

const sortOptions = [
  { label: '人气', value: 'popular' },
  { label: '最新', value: 'newest' },
  { label: '价格', value: 'price' }
]

const navBarStyle = computed(() => ({
  background: scrollTop.value > 100 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
  position: 'absolute',
  top: 'var(--safe-area-top)',
  zIndex: 100
}))

const teacherCourses = computed(() => {
  return courses.filter(c => c.teacherId === teacherId.value)
})

const sortedCourses = computed(() => {
  let result = [...teacherCourses.value]
  
  switch (currentSort.value) {
    case 'popular':
      result.sort((a, b) => b.studentCount - a.studentCount)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'price':
      result.sort((a, b) => a.price - b.price)
      break
  }
  
  return result
})

const loadTeacherData = () => {
  teacher.value = getTeacherById(teacherId.value)
  if (!teacher.value && teachers.length > 0) {
    teacher.value = teachers[0]
  }
}

const goBack = () => {
  router.back()
}

const onShare = () => {
  showShareSheet.value = true
}

const onShareSelect = (action) => {
  if (action.name === '复制链接') {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('链接已复制到剪贴板')
    }).catch(() => {
      showToast('复制失败，请手动复制')
    })
  } else {
    showToast(`${action.name}分享成功`)
  }
}

const toggleFollow = () => {
  if (teacher.value) {
    teacher.value.isFollowed = !teacher.value.isFollowed
    if (teacher.value.isFollowed) {
      teacher.value.followerCount++
      showToast('关注成功')
    } else {
      teacher.value.followerCount--
      showToast('已取消关注')
    }
  }
}

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop || window.scrollY
}

onMounted(() => {
  loadTeacherData()
  window.addEventListener('scroll', handleScroll, true)
})

watch(
  () => route.params.id,
  () => {
    loadTeacherData()
  }
)
</script>

<style lang="less" scoped>
.teacher-page {
  background: #f5f7fa;
}

.teacher-header {
  position: relative;
  padding-top: 46px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: var(--primary-gradient);
  z-index: 0;
}

.teacher-info {
  position: relative;
  z-index: 1;
  padding: 20px 16px;
  display: flex;
  gap: 16px;
}

.teacher-avatar {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.teacher-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.teacher-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
}

.teacher-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 16px;
  padding: 16px 0;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 0, 0, 0.08);
}

.intro-section {
  margin: 16px;
  padding: 16px;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
  position: relative;
  padding-left: 10px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background: var(--primary-gradient);
    border-radius: 2px;
  }
}

.intro-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.8;
}

.courses-section {
  margin: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sort-options {
  display: flex;
  gap: 16px;
}

.sort-option {
  font-size: 13px;
  color: var(--text-color-tertiary);
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
  }
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  padding: 40px 0;
}

.bottom-space {
  height: 30px;
}
</style>
