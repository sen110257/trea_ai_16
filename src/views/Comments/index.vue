<template>
  <div class="comments-page page-wrapper">
    <van-nav-bar 
      title="学员评价" 
      left-arrow 
      @click-left="goBack"
      fixed 
      placeholder
    />

    <div class="rating-summary">
      <div class="rating-score">
        <span class="score">{{ course?.rating || 0 }}</span>
        <span class="max-score">/ 5.0</span>
      </div>
      <div class="rating-detail">
        <van-rate v-model="ratingValue" readonly :size="20" />
        <span class="count">共 {{ course?.ratingCount || 0 }} 人评价</span>
      </div>
    </div>

    <div class="filter-tabs">
      <div 
        v-for="filter in filterOptions" 
        :key="filter.value"
        class="filter-tab"
        :class="{ active: currentFilter === filter.value }"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </div>
    </div>

    <div class="comments-list">
      <div 
        v-for="comment in filteredComments" 
        :key="comment.id" 
        class="comment-item"
      >
        <div class="comment-header">
          <van-image :src="comment.userAvatar" class="user-avatar" round />
          <div class="user-info">
            <h4 class="user-name">{{ comment.userName }}</h4>
            <div class="comment-meta">
              <van-rate v-model="comment.rating" readonly :size="14" />
              <span class="comment-date">{{ comment.createdAt }}</span>
            </div>
          </div>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-images" v-if="comment.images?.length > 0">
          <van-image 
            v-for="(img, index) in comment.images" 
            :key="index"
            :src="img"
            class="comment-image"
          />
        </div>
        <div class="comment-actions">
          <div class="action-item" @click="toggleLike(comment)">
            <van-icon 
              :name="comment.isLiked ? 'good-job' : 'good-job-o'" 
              size="16"
              :color="comment.isLiked ? '#667eea' : '#999'"
            />
            <span>{{ comment.likeCount }}</span>
          </div>
          <div class="action-item" @click="showReplyInput(comment)">
            <van-icon name="comment-o" size="16" color="#999" />
            <span>回复</span>
          </div>
        </div>
        
        <div class="reply-section" v-if="showReply.commentId === comment.id">
          <van-field
            v-model="replyContent"
            placeholder="写下你的回复..."
            :border="false"
          >
            <template #button>
              <van-button 
                type="primary" 
                size="small"
                :disabled="!replyContent.trim()"
                @click="submitReply(comment)"
              >
                发送
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
      
      <van-empty v-if="filteredComments.length === 0" description="暂无评价" />
    </div>

    <div class="write-comment-bar" v-if="userStore.isLoggedIn" @click="showWriteComment = true">
      <van-icon name="edit" size="16" color="#667eea" />
      <span>写评价</span>
    </div>

    <van-popup 
      v-model:show="showWriteComment"
      position="bottom"
      :style="{ height: '70%', paddingBottom: 'env(safe-area-inset-bottom)' }"
      round
    >
      <div class="write-comment-popup">
        <div class="popup-header">
          <h3 class="popup-title">写评价</h3>
          <van-icon name="cross" size="20" @click="showWriteComment = false" />
        </div>
        
        <div class="course-preview">
          <van-image :src="course?.cover" class="preview-cover" />
          <div class="preview-info">
            <h4 class="preview-title">{{ course?.title }}</h4>
            <p class="preview-teacher">讲师：{{ course?.teacherName }}</p>
          </div>
        </div>

        <div class="rating-section">
          <span class="rating-label">综合评分</span>
          <van-rate 
            v-model="newComment.rating" 
            :size="28"
            color="#ffc107"
            void-color="#ddd"
          />
          <span class="rating-text">{{ ratingText }}</span>
        </div>

        <div class="content-section">
          <van-field
            v-model="newComment.content"
            type="textarea"
            placeholder="分享你的学习体验，帮助其他用户了解这门课程~"
            :rows="6"
            :maxlength="500"
            show-word-limit
          />
        </div>

        <div class="image-section">
          <van-uploader 
            v-model="newComment.images"
            :max-count="3"
            upload-text="上传图片"
          />
        </div>

        <div class="popup-footer">
          <van-button 
            type="primary" 
            size="large"
            :disabled="!canSubmit"
            @click="submitComment"
          >
            发布评价
          </van-button>
        </div>
      </div>
    </van-popup>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import { getCourseById, getCommentsByCourseId, courses } from '@/data/mockData'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const courseId = computed(() => parseInt(route.params.courseId))
const course = ref(null)
const courseComments = ref([])

const currentFilter = ref('all')
const showWriteComment = ref(false)
const showReply = ref({ commentId: null })
const replyContent = ref('')

const ratingValue = computed(() => Math.round(course.value?.rating || 0))

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '好评', value: 'good' },
  { label: '中评', value: 'medium' },
  { label: '差评', value: 'bad' },
  { label: '有图', value: 'image' }
]

const newComment = ref({
  rating: 5,
  content: '',
  images: []
})

const ratingText = computed(() => {
  const texts = {
    1: '非常差',
    2: '较差',
    3: '一般',
    4: '满意',
    5: '超棒'
  }
  return texts[newComment.value.rating] || ''
})

const canSubmit = computed(() => {
  return newComment.value.content.trim().length > 0
})

const filteredComments = computed(() => {
  let result = [...courseComments.value]
  
  switch (currentFilter.value) {
    case 'good':
      result = result.filter(c => c.rating >= 4)
      break
    case 'medium':
      result = result.filter(c => c.rating === 3)
      break
    case 'bad':
      result = result.filter(c => c.rating <= 2)
      break
    case 'image':
      result = result.filter(c => c.images?.length > 0)
      break
  }
  
  return result
})

const loadData = () => {
  course.value = getCourseById(courseId.value)
  courseComments.value = getCommentsByCourseId(courseId.value)
  
  if (!course.value && courses.length > 0) {
    course.value = courses[0]
    courseComments.value = getCommentsByCourseId(courses[0].id)
  }
}

const goBack = () => {
  router.back()
}

const toggleLike = (comment) => {
  if (comment.isLiked) {
    comment.isLiked = false
    comment.likeCount--
  } else {
    comment.isLiked = true
    comment.likeCount++
  }
}

const showReplyInput = (comment) => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  
  if (showReply.value.commentId === comment.id) {
    showReply.value = { commentId: null }
  } else {
    showReply.value = { commentId: comment.id }
    replyContent.value = ''
  }
}

const submitReply = (comment) => {
  if (!replyContent.value.trim()) return
  
  showToast('回复成功')
  showReply.value = { commentId: null }
  replyContent.value = ''
}

const submitComment = () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  
  if (!newComment.value.content.trim()) {
    showToast('请输入评价内容')
    return
  }
  
  showToast('评价发布成功')
  showWriteComment.value = false
  
  const userInfo = userStore.userInfo
  courseComments.value.unshift({
    id: Date.now(),
    courseId: courseId.value,
    userId: userInfo.id,
    userName: userInfo.nickname,
    userAvatar: userInfo.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20placeholder&image_size=square',
    rating: newComment.value.rating,
    content: newComment.value.content,
    likeCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString().split('T')[0],
    images: newComment.value.images
  })
  
  newComment.value = {
    rating: 5,
    content: '',
    images: []
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.comments-page {
  background: #f5f7fa;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 16px;
  background: #fff;
  margin: 10px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.rating-score {
  text-align: center;
  
  .score {
    font-size: 36px;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .max-score {
    font-size: 14px;
    color: var(--text-color-tertiary);
  }
}

.rating-detail {
  flex: 1;
  
  .count {
    display: block;
    font-size: 13px;
    color: var(--text-color-tertiary);
    margin-top: 6px;
  }
}

.filter-tabs {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 13px;
  color: var(--text-color-secondary);
  background: #fff;
  border-radius: 16px;
  
  &.active {
    background: var(--primary-gradient);
    color: #fff;
  }
}

.comments-list {
  padding: 0 10px;
}

.comment-item {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.user-info {
  flex: 1;
  margin-left: 10px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-date {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.comment-content {
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.comment-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-color-tertiary);
}

.reply-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
  
  :deep(.van-field) {
    background: #f5f5f5;
    border-radius: var(--radius-md);
    padding: 10px 12px;
  }
}

.write-comment-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 16px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
  background: #fff;
  color: var(--primary-color);
  font-size: 14px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.write-comment-popup {
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

.course-preview {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.preview-cover {
  width: 80px;
  height: 60px;
  border-radius: var(--radius-md);
}

.preview-info {
  flex: 1;
  margin-left: 12px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-teacher {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.rating-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.rating-label {
  font-size: 14px;
  color: var(--text-color);
}

.rating-text {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
}

.content-section {
  padding: 16px;
  
  :deep(.van-field) {
    background: #f5f5f5;
    border-radius: var(--radius-md);
    padding: 12px;
  }
}

.image-section {
  padding: 0 16px 16px;
}

.popup-footer {
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #f5f5f5;
  margin-top: auto;
  
  .van-button {
    background: var(--primary-gradient);
    border: none;
  }
}

.bottom-space {
  height: 70px;
}
</style>
