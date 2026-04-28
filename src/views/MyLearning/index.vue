<template>
  <div class="my-learning-page page-wrapper">
    <van-nav-bar title="我的学习" fixed placeholder />

    <div class="learning-stats">
      <div class="stat-item">
        <div class="stat-icon">
          <van-icon name="play-circle-o" size="24" color="#667eea" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ learningCourses.length }}</span>
          <span class="stat-label">在学课程</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon green">
          <van-icon name="checked" size="24" color="#52c41a" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ completedCourses.length }}</span>
          <span class="stat-label">已完成</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon orange">
          <van-icon name="clock-o" size="24" color="#faad14" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalLearningTime }}</span>
          <span class="stat-label">学习时长</span>
        </div>
      </div>
    </div>

    <van-tabs v-model:active="activeTab" color="#667eea" sticky offset-top="46">
      <van-tab :title="`在学中 (${learningCourses.length})`">
        <div class="tab-content">
          <div v-if="learningCourses.length === 0" class="empty-state">
            <van-empty description="暂无在学课程" />
            <van-button type="primary" @click="goToHome">去逛逛</van-button>
          </div>
          <div 
            v-for="item in learningCourses" 
            :key="item.course.id" 
            class="course-item card-hover"
            @click="continueLearning(item.course)"
          >
            <van-image :src="item.course.cover" class="course-cover" lazy-load />
            <div class="course-info">
              <h3 class="course-title">{{ item.course.title }}</h3>
              <div class="progress-info">
                <div class="progress-bar">
                  <van-progress 
                    :percentage="item.progress" 
                    :stroke-width="6"
                    color="#667eea"
                    pivot-text=""
                  />
                </div>
                <span class="progress-text">{{ item.progress }}%</span>
              </div>
              <div class="course-footer">
                <span class="current-chapter" v-if="item.currentChapter">
                  学到：{{ item.currentChapter.title }}
                </span>
                <van-button size="mini" type="primary" plain @click.stop>继续学习</van-button>
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab :title="`已完结 (${completedCourses.length})`">
        <div class="tab-content">
          <div v-if="completedCourses.length === 0" class="empty-state">
            <van-empty description="暂无已完成课程" />
          </div>
          <div 
            v-for="item in completedCourses" 
            :key="item.course.id" 
            class="course-item card-hover"
            @click="reviewCourse(item.course)"
          >
            <van-image :src="item.course.cover" class="course-cover" lazy-load />
            <div class="course-info">
              <h3 class="course-title">{{ item.course.title }}</h3>
              <div class="completed-badge">
                <van-icon name="checked" size="16" color="#52c41a" />
                <span>已完成学习</span>
              </div>
              <div class="course-footer">
                <van-button size="mini" type="default" @click.stop>重新学习</van-button>
                <van-button size="mini" type="primary" plain @click.stop>评价</van-button>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <div class="bottom-space"></div>
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { getCourseById, formatNumber } from '@/data/mockData'
import TabBar from '@/components/TabBar/index.vue'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref(0)

const learningProgress = computed(() => userStore.learningProgress)

const learningCourses = computed(() => {
  const result = []
  Object.keys(learningProgress.value).forEach(courseId => {
    const course = getCourseById(parseInt(courseId))
    if (course) {
      const progress = learningProgress.value[courseId]
      const totalProgress = progress.totalProgress || 0
      
      if (totalProgress < 100) {
        let currentChapter = null
        if (progress.lastChapterId) {
          currentChapter = course.chapters?.find(c => c.id === progress.lastChapterId)
        }
        
        result.push({
          course,
          progress: Math.round(totalProgress),
          currentChapter
        })
      }
    }
  })
  return result
})

const completedCourses = computed(() => {
  const result = []
  Object.keys(learningProgress.value).forEach(courseId => {
    const course = getCourseById(parseInt(courseId))
    if (course) {
      const progress = learningProgress.value[courseId]
      const totalProgress = progress.totalProgress || 0
      
      if (totalProgress >= 100) {
        result.push({
          course,
          progress: 100
        })
      }
    }
  })
  return result
})

const totalLearningTime = computed(() => {
  let totalSeconds = 0
  Object.values(learningProgress.value).forEach(progress => {
    if (progress.chapters) {
      Object.values(progress.chapters).forEach(chapter => {
        totalSeconds += (chapter.currentTime || 0)
      })
    }
  })
  
  const minutes = Math.floor(totalSeconds / 60)
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}小时${remainingMinutes}分钟`
})

const continueLearning = (course) => {
  router.push(`/course/${course.id}`)
}

const reviewCourse = (course) => {
  router.push(`/course/${course.id}`)
}

const goToHome = () => {
  router.push('/home')
}
</script>

<style lang="less" scoped>
.my-learning-page {
  background: #f5f7fa;
}

.learning-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fff;
  margin: 10px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.green {
    background: rgba(82, 196, 26, 0.1);
  }
  
  &.orange {
    background: rgba(250, 173, 20, 0.1);
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.tab-content {
  padding: 16px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
  
  .van-button {
    margin-top: 20px;
  }
}

.course-item {
  display: flex;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 12px;
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
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-bar {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

.current-chapter {
  font-size: 12px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.completed-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
  margin-bottom: 10px;
}

.bottom-space {
  height: 30px;
}
</style>
