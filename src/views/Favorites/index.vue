<template>
  <div class="favorites-page page-wrapper">
    <van-nav-bar title="我的收藏" left-arrow @click-left="goBack" fixed placeholder />

    <div class="content-area">
      <div v-if="favoriteCourses.length === 0" class="empty-state">
        <van-empty description="暂无收藏课程" />
        <van-button type="primary" @click="goToHome">去逛逛</van-button>
      </div>
      
      <div v-else class="course-list">
        <div 
          v-for="course in favoriteCourses" 
          :key="course.id"
          class="course-item card-hover"
          @click="goToCourse(course)"
        >
          <van-image :src="course.cover" class="course-cover" lazy-load />
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-meta">
              <div class="meta-left">
                <van-rate v-model="ratingList[course.id]" readonly :size="12" />
                <span class="rating-text">{{ course.rating }}</span>
              </div>
              <div class="meta-right">
                <span class="student-count">{{ formatNumber(course.studentCount) }}人学习</span>
              </div>
            </div>
            <div class="course-footer">
              <div class="price-info">
                <span v-if="course.isFree" class="free-text">免费</span>
                <span v-else class="price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ course.price }}</span>
                </span>
                <span v-if="course.originalPrice > course.price" class="original-price">
                  ¥{{ course.originalPrice }}
                </span>
              </div>
              <van-button 
                size="mini" 
                type="danger" 
                plain
                @click.stop="removeFavorite(course)"
              >
                取消收藏
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { getCourseById, formatNumber } from '@/data/mockData'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const ratingList = ref({})

const favoriteCourses = computed(() => {
  const result = []
  userStore.favorites.forEach(courseId => {
    const course = getCourseById(courseId)
    if (course) {
      result.push(course)
      ratingList.value[courseId] = Math.round(course.rating)
    }
  })
  return result
})

const goBack = () => {
  router.back()
}

const goToHome = () => {
  router.push('/home')
}

const goToCourse = (course) => {
  router.push(`/course/${course.id}`)
}

const removeFavorite = (course) => {
  showConfirmDialog({
    title: '提示',
    message: '确定要取消收藏该课程吗？'
  }).then(() => {
    userStore.toggleFavorite(course.id)
    showToast('已取消收藏')
  }).catch(() => {})
}
</script>

<style lang="less" scoped>
.favorites-page {
  background: #f5f7fa;
}

.content-area {
  padding: 10px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  
  .van-button {
    margin-top: 20px;
  }
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-item {
  display: flex;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: var(--shadow-sm);
}

.course-cover {
  width: 120px;
  height: 85px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .rating-text {
    font-size: 12px;
    color: var(--text-color-secondary);
  }
}

.meta-right {
  .student-count {
    font-size: 12px;
    color: var(--text-color-tertiary);
  }
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.price-info {
  .free-text {
    font-size: 16px;
    font-weight: 600;
    color: #52c41a;
  }
  
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

.bottom-space {
  height: 30px;
}
</style>
