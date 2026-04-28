<template>
  <div class="history-page page-wrapper">
    <van-nav-bar 
      title="观看历史" 
      left-arrow 
      @click-left="goBack"
      fixed 
      placeholder
    >
      <template #right>
        <span class="edit-btn" @click="toggleEdit">{{ isEdit ? '完成' : '编辑' }}</span>
      </template>
    </van-nav-bar>

    <div class="content-area">
      <div v-if="historyItems.length === 0" class="empty-state">
        <van-empty description="暂无观看历史" />
        <van-button type="primary" @click="goToHome">去逛逛</van-button>
      </div>
      
      <div v-else class="history-list">
        <div 
          v-for="item in historyItems" 
          :key="item.courseId"
          class="history-item card-hover"
          @click="!isEdit && goToCourse(item)"
        >
          <div class="checkbox-wrapper" v-if="isEdit">
            <van-checkbox 
              v-model="selectedIds" 
              :name="item.courseId"
              shape="square"
              @click.stop
            />
          </div>
          
          <div class="course-wrapper">
            <div class="course-cover-wrapper">
              <van-image :src="getCourseCover(item.courseId)" class="course-cover" lazy-load />
              <div class="progress-bar" v-if="item.progress > 0">
                <van-progress 
                  :percentage="item.progress" 
                  :stroke-width="3"
                  color="#667eea"
                  pivot-text=""
                />
              </div>
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ getCourseTitle(item.courseId) }}</h3>
              <p class="view-time">
                上次观看：{{ formatTime(item.viewedAt) }}
              </p>
              <p class="progress-text" v-if="item.progress > 0">
                已观看 {{ item.progress }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-actions" v-if="isEdit">
      <div class="action-left">
        <van-checkbox 
          v-model="isAllSelected"
          shape="square"
          @change="toggleSelectAll"
        >
          全选
        </van-checkbox>
      </div>
      <van-button 
        type="danger" 
        size="large"
        :disabled="selectedIds.length === 0"
        @click="handleDelete"
      >
        删除
      </van-button>
    </div>

    <div class="bottom-space" v-if="!isEdit"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { getCourseById } from '@/data/mockData'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const isEdit = ref(false)
const selectedIds = ref([])
const isAllSelected = ref(false)

const historyItems = computed(() => userStore.history)

watch(
  isEdit,
  (val) => {
    if (!val) {
      selectedIds.value = []
      isAllSelected.value = false
    }
  }
)

watch(
  selectedIds,
  (val) => {
    isAllSelected.value = val.length === historyItems.value.length && val.length > 0
  },
  { deep: true }
)

const getCourseCover = (courseId) => {
  const course = getCourseById(courseId)
  return course?.cover || ''
}

const getCourseTitle = (courseId) => {
  const course = getCourseById(courseId)
  return course?.title || ''
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

const toggleEdit = () => {
  isEdit.value = !isEdit.value
}

const toggleSelectAll = (val) => {
  if (val) {
    selectedIds.value = historyItems.value.map(item => item.courseId)
  } else {
    selectedIds.value = []
  }
}

const handleDelete = () => {
  showConfirmDialog({
    title: '提示',
    message: `确定要删除选中的 ${selectedIds.value.length} 条观看历史吗？`
  }).then(() => {
    userStore.history = userStore.history.filter(
      item => !selectedIds.value.includes(item.courseId)
    )
    localStorage.setItem('history', JSON.stringify(userStore.history))
    selectedIds.value = []
    isEdit.value = false
    showToast('删除成功')
  }).catch(() => {})
}

const goBack = () => {
  if (isEdit.value) {
    isEdit.value = false
    return
  }
  router.back()
}

const goToHome = () => {
  router.push('/home')
}

const goToCourse = (item) => {
  router.push(`/course/${item.courseId}`)
}
</script>

<style lang="less" scoped>
.history-page {
  background: #f5f7fa;
}

.edit-btn {
  font-size: 14px;
  color: #fff;
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

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 12px;
  box-shadow: var(--shadow-sm);
}

.checkbox-wrapper {
  margin-right: 12px;
}

.course-wrapper {
  display: flex;
  flex: 1;
}

.course-cover-wrapper {
  position: relative;
  flex-shrink: 0;
}

.course-cover {
  width: 120px;
  height: 85px;
  border-radius: var(--radius-md);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  overflow: hidden;
}

.course-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.view-time {
  font-size: 12px;
  color: var(--text-color-tertiary);
  margin-bottom: 4px;
}

.progress-text {
  font-size: 12px;
  color: var(--primary-color);
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.action-left {
  font-size: 14px;
  color: var(--text-color);
}

.bottom-space {
  height: 30px;
}
</style>
