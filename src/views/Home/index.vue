<template>
  <div class="home-page page-wrapper">
    <div class="home-header">
      <div class="header-top">
        <div class="greeting">
          <p class="greeting-text">欢迎回来 👋</p>
          <h1 class="username">{{ userInfo?.nickname || '学习者' }}</h1>
        </div>
        <div class="header-actions">
          <van-icon name="search" size="22" @click="onSearch" />
          <van-icon name="bell-o" size="22" @click="onNotification" />
        </div>
      </div>
      <div class="search-bar" @click="onSearch">
        <van-icon name="search" size="18" color="#999" />
        <span class="search-placeholder">搜索课程、讲师...</span>
      </div>
    </div>

    <div class="banner-section">
      <van-swipe :autoplay="3000" indicator-color="rgba(255,255,255,0.6)">
        <van-swipe-item v-for="banner in bannerList" :key="banner.id">
          <div class="banner-item" @click="onBannerClick(banner)">
            <van-image :src="banner.image" fit="cover" class="banner-image" />
            <div class="banner-content">
              <h3 class="banner-title">{{ banner.title }}</h3>
              <p class="banner-desc">{{ banner.description }}</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="quick-entry">
      <van-grid :column-num="5" clickable>
        <van-grid-item 
          v-for="category in quickCategories" 
          :key="category.id"
          @click="onCategoryClick(category)"
        >
          <div class="entry-icon">
            <van-icon :name="category.icon" size="26" :color="getCategoryColor(category.id)" />
          </div>
          <span class="entry-text">{{ category.name }}</span>
        </van-grid-item>
      </van-grid>
    </div>

    <div class="section">
      <div class="section-header">
        <h2 class="section-title">热门专栏</h2>
        <span class="section-more" @click="onMoreClick('column')">
          更多
          <van-icon name="arrow" size="12" />
        </span>
      </div>
      <div class="column-list">
        <div 
          v-for="column in columns" 
          :key="column.id" 
          class="column-card card-hover"
          @click="onColumnClick(column)"
        >
          <div class="column-cover">
            <van-image :src="column.cover" fit="cover" class="cover-image" />
            <div class="column-tags">
              <van-tag v-for="tag in column.tags" :key="tag" size="mini" type="danger">
                {{ tag }}
              </van-tag>
            </div>
          </div>
          <div class="column-info">
            <h3 class="column-title">{{ column.title }}</h3>
            <p class="column-desc">{{ column.description }}</p>
            <div class="column-meta">
              <div class="meta-left">
                <van-image :src="getTeacherAvatar(column.teacherId)" class="teacher-avatar" round />
                <span class="teacher-name">{{ column.teacherName }}</span>
              </div>
              <div class="meta-right">
                <span class="stat-item">{{ formatNumber(column.studentCount) }}人学习</span>
              </div>
            </div>
            <div class="column-footer">
              <div class="column-price">
                <span class="price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ column.price }}</span>
                </span>
                <span class="original-price">¥{{ column.originalPrice }}</span>
              </div>
              <span class="course-count">{{ column.courseCount }}门课程</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2 class="section-title">推荐课程</h2>
        <span class="section-more" @click="onMoreClick('recommend')">
          更多
          <van-icon name="arrow" size="12" />
        </span>
      </div>
      <div class="course-grid">
        <CourseCard v-for="course in recommendedCourses" :key="course.id" :course="course" />
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2 class="section-title">名师推荐</h2>
        <span class="section-more" @click="onMoreClick('teacher')">
          更多
          <van-icon name="arrow" size="12" />
        </span>
      </div>
      <div class="teacher-list">
        <div 
          v-for="teacher in featuredTeachers" 
          :key="teacher.id" 
          class="teacher-card card-hover"
          @click="onTeacherClick(teacher)"
        >
          <div class="teacher-header">
            <van-image :src="teacher.avatar" class="teacher-avatar-large" round />
            <div class="teacher-info">
              <h3 class="teacher-name">{{ teacher.name }}</h3>
              <p class="teacher-title">{{ teacher.title }}</p>
            </div>
            <van-button 
              v-if="!teacher.isFollowed" 
              size="small" 
              type="primary"
              @click.stop="onFollow(teacher)"
            >
              关注
            </van-button>
            <van-button 
              v-else 
              size="small" 
              plain
              @click.stop="onFollow(teacher)"
            >
              已关注
            </van-button>
          </div>
          <p class="teacher-intro">{{ teacher.introduction }}</p>
          <div class="teacher-stats">
            <div class="stat">
              <span class="stat-value">{{ formatNumber(teacher.followerCount) }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">{{ teacher.courseCount }}</span>
              <span class="stat-label">课程</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">{{ formatNumber(teacher.totalStudentCount) }}</span>
              <span class="stat-label">学员</span>
            </div>
          </div>
          <div class="teacher-tags">
            <van-tag v-for="tag in teacher.tags" :key="tag" size="mini" plain type="primary">
              {{ tag }}
            </van-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="section" v-if="freeCourses.length > 0">
      <div class="section-header">
        <h2 class="section-title">免费试听</h2>
        <span class="section-more" @click="onMoreClick('free')">
          更多
          <van-icon name="arrow" size="12" />
        </span>
      </div>
      <div class="course-grid">
        <CourseCard v-for="course in freeCourses" :key="course.id" :course="course" />
      </div>
    </div>

    <div class="bottom-space"></div>

    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { bannerList, columns, courses, teachers, formatNumber, getTeacherById } from '@/data/mockData'
import TabBar from '@/components/TabBar/index.vue'
import CourseCard from '@/components/CourseCard/index.vue'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

const quickCategories = computed(() => [
  { id: 2, name: '编程开发', icon: 'code-o' },
  { id: 3, name: '人工智能', icon: 'cpu' },
  { id: 4, name: '设计创意', icon: 'photo-o' },
  { id: 5, name: '产品运营', icon: 'shopping-cart-o' },
  { id: 6, name: '职场技能', icon: 'manager-o' }
])

const recommendedCourses = computed(() => {
  return courses.filter(c => c.tags?.includes('推荐') || c.tags?.includes('热门')).slice(0, 4)
})

const freeCourses = computed(() => {
  return courses.filter(c => c.isFree || c.hasTrial).slice(0, 3)
})

const featuredTeachers = computed(() => teachers.slice(0, 3))

const getTeacherAvatar = (teacherId) => {
  const teacher = getTeacherById(teacherId)
  return teacher?.avatar || ''
}

const getCategoryColor = (id) => {
  const colors = {
    2: '#667eea',
    3: '#764ba2',
    4: '#f093fb',
    5: '#f5576c',
    6: '#faad14'
  }
  return colors[id] || '#667eea'
}

const onSearch = () => {
  showToast('搜索功能开发中')
}

const onNotification = () => {
  showToast('暂无新消息')
}

const onBannerClick = (banner) => {
  showToast('跳转: ' + banner.title)
}

const onCategoryClick = (category) => {
  router.push({ path: '/category', query: { categoryId: category.id } })
}

const onMoreClick = (type) => {
  if (type === 'recommend' || type === 'free') {
    router.push('/category')
  } else {
    showToast('更多内容开发中')
  }
}

const onColumnClick = (column) => {
  router.push(`/course/${courses.find(c => c.columnId === column.id)?.id || 1}`)
}

const onTeacherClick = (teacher) => {
  router.push(`/teacher/${teacher.id}`)
}

const onFollow = (teacher) => {
  teacher.isFollowed = !teacher.isFollowed
  showToast(teacher.isFollowed ? '关注成功' : '已取消关注')
}
</script>

<style lang="less" scoped>
.home-page {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 15%, #f5f7fa 15%, #e4e8ec 100%);
}

.home-header {
  padding: 16px 16px 20px;
  background: var(--primary-gradient);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.greeting {
  .greeting-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 4px;
  }

  .username {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
}

.header-actions {
  display: flex;
  gap: 20px;
  color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .search-placeholder {
    font-size: 14px;
    color: #999;
  }
}

.banner-section {
  padding: 0 16px;
  margin-top: -8px;
}

.banner-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.banner-image {
  width: 100%;
  height: 160px;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: #fff;

  .banner-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .banner-desc {
    font-size: 13px;
    opacity: 0.9;
  }
}

.quick-entry {
  margin: 16px;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 16px 0;
  box-shadow: var(--shadow-sm);
}

.entry-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.entry-text {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
    position: relative;
    padding-left: 10px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 18px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }
  }

  .section-more {
    font-size: 13px;
    color: var(--text-color-tertiary);
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.column-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.column-cover {
  position: relative;
  height: 140px;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.column-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.column-info {
  padding: 12px 14px;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
}

.column-desc {
  font-size: 13px;
  color: var(--text-color-secondary);
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.column-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .meta-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .teacher-avatar {
      width: 24px;
      height: 24px;
    }

    .teacher-name {
      font-size: 13px;
      color: var(--text-color-secondary);
    }
  }

  .meta-right {
    .stat-item {
      font-size: 12px;
      color: var(--text-color-tertiary);
    }
  }
}

.column-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.column-price {
  .price {
    color: #ff6b6b;
    font-weight: 600;

    .price-symbol {
      font-size: 12px;
    }

    .price-value {
      font-size: 18px;
    }
  }

  .original-price {
    font-size: 12px;
    color: var(--text-color-tertiary);
    text-decoration: line-through;
    margin-left: 6px;
  }
}

.course-count {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.course-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.teacher-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.teacher-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.teacher-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.teacher-avatar-large {
  width: 56px;
  height: 56px;
}

.teacher-info {
  flex: 1;

  .teacher-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 4px;
  }

  .teacher-title {
    font-size: 13px;
    color: var(--text-color-secondary);
  }
}

.teacher-intro {
  font-size: 13px;
  color: var(--text-color-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.teacher-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 14px;
  padding: 12px 0;
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--radius-md);
}

.stat {
  text-align: center;

  .stat-value {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 2px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-color-tertiary);
  }
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 0, 0, 0.08);
}

.teacher-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bottom-space {
  height: 30px;
}
</style>
