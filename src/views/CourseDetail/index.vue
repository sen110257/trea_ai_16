<template>
  <div class="course-detail-page">
    <div v-if="!course" class="loading-container">
      <van-loading size="24">加载中...</van-loading>
    </div>

    <template v-else>
      <div class="video-section" v-if="currentChapter">
        <video 
          ref="videoRef"
          class="course-video"
          :src="currentChapter.videoUrl"
          :poster="course.cover"
          controls
          playsinline
          webkit-playsinline
          x5-playsinline
          @timeupdate="onTimeUpdate"
          @ended="onVideoEnded"
          @play="onVideoPlay"
        ></video>
        <div class="video-overlay" v-if="!canPlay && !isPlaying" @click="handleVideoClick">
          <div class="play-icon">
            <van-icon name="play" size="32" color="#fff" />
          </div>
          <div class="lock-mask" v-if="!canPlay && !isTrial">
            <van-icon name="lock" size="24" />
            <span>购买后可观看</span>
          </div>
        </div>
        <div class="video-info">
          <div class="chapter-info">
            <h3 class="chapter-title">{{ currentChapter?.title }}</h3>
            <span class="video-time">{{ currentTimeText }} / {{ durationText }}</span>
          </div>
        </div>
      </div>

      <van-nav-bar 
        v-if="!isFullscreen" 
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

      <div class="course-content" v-if="!isFullscreen">
        <div class="course-header">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-meta">
            <div class="meta-left">
              <van-rate v-model="ratingValue" readonly :size="14" />
              <span class="rating-text">{{ course.rating }}</span>
              <span class="student-count">{{ formatNumber(course.studentCount) }}人学习</span>
            </div>
            <div class="meta-right">
              <van-icon 
                :name="isFavorite ? 'star' : 'star-o'" 
                size="20" 
                :color="isFavorite ? '#ffc107' : '#999'"
                @click="toggleFavorite"
              />
            </div>
          </div>
        </div>

        <van-tabs v-model:active="activeTab" color="#667eea">
          <van-tab title="课程详情">
            <div class="tab-content">
              <div class="teacher-card" @click="goToTeacher">
                <van-image :src="course.teacherAvatar" class="teacher-avatar" round />
                <div class="teacher-info">
                  <h4 class="teacher-name">{{ course.teacherName }}</h4>
                  <p class="teacher-title">{{ getTeacherTitle() }}</p>
                </div>
                <van-button size="small" type="primary" plain @click.stop="toggleFollow">
                  {{ teacher?.isFollowed ? '已关注' : '关注' }}
                </van-button>
              </div>

              <div class="intro-section">
                <h3 class="section-title">课程简介</h3>
                <p class="intro-text">{{ course.intro }}</p>
              </div>

              <div class="stats-section">
                <div class="stat-item">
                  <span class="stat-value">{{ course.chapterCount }}</span>
                  <span class="stat-label">课时</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ formatDuration(course.duration) }}</span>
                  <span class="stat-label">总时长</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value">{{ course.ratingCount }}</span>
                  <span class="stat-label">评价</span>
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab :title="`课程大纲 (${course.chapters?.length || 0})`">
            <div class="tab-content">
              <div class="chapter-list">
                <div 
                  v-for="(chapter, index) in course.chapters" 
                  :key="chapter.id"
                  class="chapter-item"
                  :class="{ active: currentChapter?.id === chapter.id, locked: !canPlayChapter(chapter) }"
                  @click="selectChapter(chapter)"
                >
                  <div class="chapter-left">
                    <div class="chapter-number">
                      <van-icon 
                        v-if="currentChapter?.id === chapter.id && isPlaying" 
                        name="volume-o" 
                        size="18" 
                        color="#667eea"
                      />
                      <span v-else class="number-text">{{ index + 1 }}</span>
                    </div>
                    <div class="chapter-info">
                      <h4 class="chapter-title">{{ chapter.title }}</h4>
                      <div class="chapter-meta">
                        <span class="duration">{{ formatDuration(chapter.duration) }}</span>
                        <van-tag 
                          v-if="chapter.isTrial" 
                          type="primary" 
                          size="mini"
                        >
                          试看
                        </van-tag>
                        <van-tag 
                          v-else-if="chapter.isFree" 
                          type="success" 
                          size="mini"
                        >
                          免费
                        </van-tag>
                      </div>
                    </div>
                  </div>
                  <div class="chapter-right">
                    <van-icon 
                      v-if="canPlayChapter(chapter)" 
                      name="play-circle-o" 
                      size="22" 
                      color="#667eea"
                    />
                    <van-icon v-else name="lock" size="20" color="#ccc" />
                  </div>
                  <div v-if="getChapterProgress(chapter.id) > 0" class="progress-bar">
                    <van-progress 
                      :percentage="getChapterProgress(chapter.id)" 
                      :stroke-width="2"
                      color="#667eea"
                      pivot-text=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab :title="`评价 (${course.ratingCount})`">
            <div class="tab-content">
              <div class="rating-summary">
                <div class="rating-score">
                  <span class="score">{{ course.rating }}</span>
                  <span class="max-score">/ 5.0</span>
                </div>
                <div class="rating-detail">
                  <van-rate v-model="ratingValue" readonly :size="18" />
                  <span class="count">共 {{ course.ratingCount }} 人评价</span>
                </div>
              </div>

              <div class="comments-list">
                <div 
                  v-for="comment in courseComments" 
                  :key="comment.id" 
                  class="comment-item"
                >
                  <div class="comment-header">
                    <van-image :src="comment.userAvatar" class="user-avatar" round />
                    <div class="user-info">
                      <h4 class="user-name">{{ comment.userName }}</h4>
                      <div class="comment-meta">
                        <van-rate v-model="comment.rating" readonly :size="12" />
                        <span class="comment-date">{{ comment.createdAt }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <div class="like-action" @click="toggleLike(comment)">
                      <van-icon 
                        :name="comment.isLiked ? 'good-job' : 'good-job-o'" 
                        size="16"
                        :color="comment.isLiked ? '#667eea' : '#999'"
                      />
                      <span>{{ comment.likeCount }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="view-all-comments" @click="viewAllComments">
                查看全部评价
                <van-icon name="arrow" size="12" />
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>

      <div class="bottom-bar" v-if="!isFullscreen">
        <div class="bar-left">
          <div v-if="!hasPurchased && course.price > 0" class="price-info">
            <span v-if="course.isFree" class="free-text">免费</span>
            <span v-else class="price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ course.price }}</span>
            </span>
            <span v-if="course.originalPrice > course.price" class="original-price">
              ¥{{ course.originalPrice }}
            </span>
          </div>
          <div v-else class="purchased-info">
            <van-icon name="checked" size="16" color="#52c41a" />
            <span>已购买</span>
          </div>
        </div>
        <div class="bar-right">
          <van-button 
            v-if="!hasPurchased && course.price > 0" 
            type="primary" 
            size="large"
            class="buy-btn"
            @click="showBuyPopup = true"
          >
            立即购买
          </van-button>
          <van-button 
            v-else-if="!hasPurchased && !course.isFree && currentChapter"
            type="primary" 
            size="large"
            class="buy-btn"
            @click="showBuyPopup = true"
          >
            购买解锁全部
          </van-button>
          <van-button 
            v-else
            type="primary" 
            size="large"
            class="continue-btn"
            @click="continueLearning"
          >
            继续学习
          </van-button>
        </div>
      </div>

      <van-popup 
        v-model:show="showBuyPopup" 
        position="bottom"
        :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
        round
      >
        <div class="buy-popup">
          <div class="popup-header">
            <h3 class="popup-title">购买课程</h3>
            <van-icon name="cross" size="20" @click="showBuyPopup = false" />
          </div>
          
          <div class="course-preview">
            <van-image :src="course.cover" class="preview-cover" />
            <div class="preview-info">
              <h4 class="preview-title">{{ course.title }}</h4>
              <p class="preview-teacher">讲师：{{ course.teacherName }}</p>
            </div>
          </div>

          <div class="buy-options">
            <div 
              class="buy-option"
              :class="{ active: buyType === 'single' }"
              @click="buyType = 'single'"
            >
              <div class="option-info">
                <span class="option-title">单课购买</span>
                <span class="option-desc">购买当前课程</span>
              </div>
              <div class="option-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ course.price }}</span>
              </div>
            </div>
            <div 
              v-if="course.columnId"
              class="buy-option"
              :class="{ active: buyType === 'column' }"
              @click="buyType = 'column'"
            >
              <div class="option-info">
                <span class="option-title">专栏打包</span>
                <span class="option-desc">更优惠，享全部专栏内容</span>
              </div>
              <div class="option-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ getColumnPrice() }}</span>
                <span class="original-tag">专栏价</span>
              </div>
            </div>
          </div>

          <div class="pay-methods">
            <h4 class="pay-title">选择支付方式</h4>
            <div class="pay-options">
              <div 
                class="pay-option"
                :class="{ active: payMethod === 'wechat' }"
                @click="payMethod = 'wechat'"
              >
                <div class="pay-left">
                  <div class="pay-icon wechat">
                    <van-icon name="wechat" size="20" />
                  </div>
                  <span class="pay-name">微信支付</span>
                </div>
                <van-radio :checked="payMethod === 'wechat'" />
              </div>
              <div 
                class="pay-option"
                :class="{ active: payMethod === 'alipay' }"
                @click="payMethod = 'alipay'"
              >
                <div class="pay-left">
                  <div class="pay-icon alipay">
                    <van-icon name="apps-o" size="20" />
                  </div>
                  <span class="pay-name">支付宝</span>
                </div>
                <van-radio :checked="payMethod === 'alipay'" />
              </div>
            </div>
          </div>

          <div class="buy-footer">
            <div class="total-price">
              <span class="total-label">实付金额：</span>
              <span class="total-value">
                <span class="price-symbol">¥</span>
                <span class="price-amount">{{ getTotalPrice() }}</span>
              </span>
            </div>
            <van-button 
              type="primary" 
              size="large"
              class="confirm-btn"
              @click="handlePay"
            >
              立即支付
            </van-button>
          </div>
        </div>
      </van-popup>

      <van-action-sheet 
        v-model:show="showShareSheet" 
        :actions="shareActions"
        cancel-text="取消"
        @select="onShareSelect"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { getCourseById, getTeacherById, getCommentsByCourseId, columns, formatDuration, formatNumber } from '@/data/mockData'
import { showToast, showLoadingToast, closeToast } from 'vant'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const courseId = computed(() => parseInt(route.params.id))
const course = ref(null)
const teacher = ref(null)
const courseComments = ref([])

const videoRef = ref(null)
const currentChapter = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const isPlaying = ref(false)
const isFullscreen = ref(false)

const activeTab = ref(0)
const showBuyPopup = ref(false)
const showShareSheet = ref(false)
const buyType = ref('single')
const payMethod = ref('wechat')

const ratingValue = computed(() => {
  if (!course.value) return 0
  return Math.round(course.value.rating || 0)
})

const hasPurchased = computed(() => {
  if (!userStore.isLoggedIn) return false
  return userStore.hasPurchased(courseId.value)
})

const isFavorite = computed(() => userStore.isFavorite(courseId.value))

const isTrial = computed(() => {
  if (!currentChapter.value) return false
  return currentChapter.value.isTrial || currentChapter.value.isFree
})

const canPlay = computed(() => {
  if (!currentChapter.value) return false
  if (hasPurchased.value || currentChapter.value.isFree) return true
  return currentChapter.value.isTrial
})

const currentTimeText = computed(() => {
  if (!currentTime.value) return '00:00'
  return formatDuration(Math.floor(currentTime.value))
})

const durationText = computed(() => {
  if (!duration.value) return '00:00'
  return formatDuration(Math.floor(duration.value))
})

const navBarStyle = computed(() => ({
  background: isPlaying.value ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'absolute',
  top: 'var(--safe-area-top)',
  zIndex: 100
}))

const shareActions = [
  { name: '分享到微信', icon: 'wechat' },
  { name: '分享到朋友圈', icon: 'friends-o' },
  { name: '复制链接', icon: 'link-o' }
]

const canPlayChapter = (chapter) => {
  if (!chapter) return false
  if (hasPurchased.value || chapter.isFree) return true
  return chapter.isTrial
}

const getTeacherTitle = () => {
  return teacher.value?.title || '资深讲师'
}

const getColumnPrice = () => {
  if (!course.value) return 0
  const column = columns.find(c => c.id === course.value.columnId)
  return column?.price || course.value?.price || 0
}

const getTotalPrice = () => {
  if (buyType.value === 'column') {
    return getColumnPrice()
  }
  return course.value?.price || 0
}

const getChapterProgress = (chapterId) => {
  const progress = userStore.getLearningProgress(courseId.value)
  if (progress?.chapters?.[chapterId]) {
    return Math.round(progress.chapters[chapterId].progress)
  }
  return 0
}

const loadCourseData = () => {
  const id = courseId.value
  course.value = getCourseById(id)
  
  if (course.value) {
    teacher.value = getTeacherById(course.value.teacherId)
    courseComments.value = getCommentsByCourseId(id)
    
    const savedProgress = userStore.getLearningProgress(id)
    if (savedProgress?.lastChapterId) {
      currentChapter.value = course.value.chapters.find(c => c.id === savedProgress.lastChapterId)
    }
    if (!currentChapter.value && course.value.chapters && course.value.chapters.length > 0) {
      currentChapter.value = course.value.chapters[0]
    }
  }
}

const selectChapter = (chapter) => {
  if (!canPlayChapter(chapter)) {
    if (!userStore.isLoggedIn) {
      showToast('请先登录')
      router.push('/login')
      return
    }
    showBuyPopup.value = true
    return
  }
  
  currentChapter.value = chapter
  currentTime.value = 0
  
  nextTick(() => {
    if (videoRef.value) {
      const savedProgress = userStore.getLearningProgress(courseId.value)
      if (savedProgress?.chapters?.[chapter.id]) {
        videoRef.value.currentTime = savedProgress.chapters[chapter.id].currentTime || 0
      }
      videoRef.value.play().catch(() => {})
    }
  })
  
  userStore.addHistory(courseId.value, chapter.id)
}

const handleVideoClick = () => {
  if (!canPlay.value) {
    if (!userStore.isLoggedIn) {
      showToast('请先登录')
      router.push('/login')
      return
    }
    showBuyPopup.value = true
    return
  }
  
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    
    const progress = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
    if (currentChapter.value && !isNaN(progress)) {
      userStore.updateLearningProgress(
        courseId.value, 
        currentChapter.value.id, 
        progress,
        currentTime.value
      )
    }
  }
}

const onVideoEnded = () => {
  isPlaying.value = false
  
  if (course.value && currentChapter.value && course.value.chapters) {
    const currentIndex = course.value.chapters.findIndex(c => c.id === currentChapter.value.id)
    if (currentIndex < course.value.chapters.length - 1) {
      const nextChapter = course.value.chapters[currentIndex + 1]
      if (canPlayChapter(nextChapter)) {
        showToast('自动播放下一节')
        selectChapter(nextChapter)
      }
    }
  }
}

const onVideoPlay = () => {
  isPlaying.value = true
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

const goBack = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    router.back()
  }
}

const exitFullscreen = () => {
  isFullscreen.value = false
  if (document.exitFullscreen) {
    document.exitFullscreen()
  }
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

const toggleFavorite = () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  userStore.toggleFavorite(courseId.value)
  showToast(isFavorite.value ? '已收藏' : '已取消收藏')
}

const toggleFollow = () => {
  if (teacher.value) {
    teacher.value.isFollowed = !teacher.value.isFollowed
    showToast(teacher.value.isFollowed ? '关注成功' : '已取消关注')
  }
}

const goToTeacher = () => {
  if (course.value) {
    router.push(`/teacher/${course.value.teacherId}`)
  }
}

const continueLearning = () => {
  if (currentChapter.value && videoRef.value) {
    videoRef.value.play()
  }
}

const viewAllComments = () => {
  router.push(`/comments/${courseId.value}`)
}

const handlePay = () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录')
    router.push('/login')
    return
  }

  showLoadingToast({
    message: '支付中...',
    forbidClick: true
  })

  setTimeout(() => {
    closeToast()
    
    if (course.value) {
      const order = userStore.createOrder(course.value, buyType.value)
      userStore.payOrder(order.id)
    }
    
    showBuyPopup.value = false
    showToast('支付成功')
  }, 1500)
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

onMounted(() => {
  loadCourseData()
})

watch(
  () => route.params.id,
  () => {
    course.value = null
    currentChapter.value = null
    loadCourseData()
  }
)
</script>

<style lang="less" scoped>
.course-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.video-section {
  position: relative;
  width: 100%;
  background: #000;
}

.course-video {
  width: 100%;
  height: 220px;
  object-fit: contain;
  background: #000;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.play-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
}

.lock-mask {
  position: absolute;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
}

.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.chapter-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.chapter-title {
  font-size: 14px;
  font-weight: 500;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-time {
  font-size: 12px;
  opacity: 0.8;
}

.course-content {
  background: #fff;
  padding-bottom: 80px;
}

.course-header {
  padding: 16px;
  border-bottom: 8px solid #f5f5f5;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 12px;
}

.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-left: 4px;
}

.student-count {
  font-size: 13px;
  color: var(--text-color-tertiary);
}

.tab-content {
  padding: 16px;
}

.teacher-card {
  display: flex;
  align-items: center;
  padding: 14px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
}

.teacher-avatar {
  width: 48px;
  height: 48px;
}

.teacher-info {
  flex: 1;
  margin-left: 12px;
}

.teacher-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.teacher-title {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.intro-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.intro-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.6;
}

.stats-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--radius-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.chapter-item {
  display: flex;
  flex-direction: column;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background: rgba(102, 126, 234, 0.05);
    margin: 0 -16px;
    padding: 14px 16px;
    border-bottom: none;
    margin-bottom: 1px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--primary-gradient);
    }
  }
  
  &.locked {
    opacity: 0.7;
  }
}

.chapter-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.chapter-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.number-text {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.chapter-right {
  margin-left: 12px;
}

.progress-bar {
  margin-top: 8px;
  width: 100%;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
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
  .count {
    display: block;
    font-size: 13px;
    color: var(--text-color-tertiary);
    margin-top: 4px;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
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
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.like-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-color-tertiary);
}

.view-all-comments {
  text-align: center;
  padding: 16px;
  color: var(--primary-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.bar-left {
  .free-text {
    font-size: 18px;
    font-weight: 600;
    color: #52c41a;
  }
  
  .price {
    color: #ff6b6b;
    font-weight: 600;
    
    .price-symbol {
      font-size: 14px;
    }
    
    .price-value {
      font-size: 22px;
    }
  }
  
  .original-price {
    font-size: 13px;
    color: var(--text-color-tertiary);
    text-decoration: line-through;
    margin-left: 6px;
  }
}

.purchased-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #52c41a;
  font-size: 14px;
}

.bar-right {
  .buy-btn, .continue-btn {
    width: 140px;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    background: var(--primary-gradient);
    border: none;
  }
}

.buy-popup {
  padding: 0;
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
  width: 100px;
  height: 70px;
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
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-teacher {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.buy-options {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.buy-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid #eee;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &.active {
    border-color: var(--primary-color);
    background: rgba(102, 126, 234, 0.05);
  }
}

.option-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  display: block;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.option-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  
  .price-symbol {
    font-size: 12px;
    color: #ff6b6b;
  }
  
  .price-value {
    font-size: 20px;
    font-weight: 600;
    color: #ff6b6b;
  }
}

.original-tag {
  font-size: 11px;
  color: #fff;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.pay-methods {
  padding: 16px;
}

.pay-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.pay-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pay-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid #eee;
  
  &.active {
    border-color: var(--primary-color);
    background: rgba(102, 126, 234, 0.05);
  }
}

.pay-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pay-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.wechat {
    background: rgba(7, 193, 96, 0.1);
    color: #07c160;
  }
  
  &.alipay {
    background: rgba(23, 115, 255, 0.1);
    color: #1773ff;
  }
}

.pay-name {
  font-size: 14px;
  color: var(--text-color);
}

.buy-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #f5f5f5;
}

.total-price {
  .total-label {
    font-size: 14px;
    color: var(--text-color-secondary);
  }
  
  .total-value {
    .price-symbol {
      font-size: 14px;
      color: #ff6b6b;
    }
    
    .price-amount {
      font-size: 24px;
      font-weight: 600;
      color: #ff6b6b;
    }
  }
}

.confirm-btn {
  width: 140px;
  border-radius: 20px;
  background: var(--primary-gradient);
  border: none;
}
</style>
