<template>
  <div class="settings-page page-wrapper">
    <van-nav-bar title="设置" left-arrow @click-left="goBack" fixed placeholder />

    <div class="avatar-section" @click="changeAvatar">
      <div class="section-header">
        <span class="section-label">头像</span>
        <div class="section-value">
          <van-image 
            v-if="userInfo?.avatar" 
            :src="userInfo.avatar" 
            class="user-avatar" 
            round 
          />
          <div v-else class="user-avatar default-avatar">
            <van-icon name="user-o" size="24" color="#667eea" />
          </div>
          <van-icon name="arrow" size="14" color="#999" />
        </div>
      </div>
    </div>

    <van-cell-group inset>
      <van-cell title="昵称" is-link>
        <template #right-icon>
          <span class="value-text">{{ userInfo?.nickname || '未设置' }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
      <van-cell title="手机号" is-link>
        <template #right-icon>
          <span class="value-text">{{ formatPhone(userInfo?.phone) }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
      <van-cell title="性别" is-link>
        <template #right-icon>
          <span class="value-text">{{ genderText }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
      <van-cell title="个人简介" is-link>
        <template #right-icon>
          <span class="value-text">{{ userInfo?.signature || '未设置' }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset title="通知设置">
      <van-cell title="课程更新通知">
        <template #right-icon>
          <van-switch v-model="notificationSettings.courseUpdate" size="20" />
        </template>
      </van-cell>
      <van-cell title="活动促销通知">
        <template #right-icon>
          <van-switch v-model="notificationSettings.promotion" size="20" />
        </template>
      </van-cell>
      <van-cell title="评论回复通知">
        <template #right-icon>
          <van-switch v-model="notificationSettings.reply" size="20" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset title="播放设置">
      <van-cell title="自动播放下一集">
        <template #right-icon>
          <van-switch v-model="playSettings.autoNext" size="20" />
        </template>
      </van-cell>
      <van-cell title="默认播放清晰度">
        <template #right-icon>
          <span class="value-text">{{ playSettings.quality }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
      <van-cell title="后台播放">
        <template #right-icon>
          <van-switch v-model="playSettings.backgroundPlay" size="20" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="清除缓存" is-link @click="showClearCache = true">
        <template #right-icon>
          <span class="value-text">{{ cacheSize }}</span>
          <van-icon name="arrow" size="14" color="#999" />
        </template>
      </van-cell>
      <van-cell title="关于我们" is-link @click="goToAbout" />
      <van-cell title="意见反馈" is-link @click="goToFeedback" />
    </van-cell-group>

    <van-cell-group inset v-if="userStore.isLoggedIn">
      <van-cell 
        title="退出登录" 
        center
        @click="showLogoutConfirm"
      >
        <template #title>
          <span style="color: #ff4d4f; width: 100%; display: block; text-align: center;">
            退出登录
          </span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-popup 
      v-model:show="showClearCache"
      position="bottom"
      round
    >
      <div class="action-popup">
        <div class="popup-title">清除缓存</div>
        <div class="popup-content">
          <p>确定要清除所有缓存吗？</p>
          <p class="sub-text">缓存大小：{{ cacheSize }}</p>
        </div>
        <div class="popup-actions">
          <van-button type="default" size="large" @click="showClearCache = false">取消</van-button>
          <van-button type="primary" size="large" @click="clearCache">确定</van-button>
        </div>
      </div>
    </van-popup>

    <van-dialog
      v-model:show="showLogoutDialog"
      title="提示"
      message="确定要退出登录吗？"
      show-cancel-button
      @confirm="handleLogout"
    />

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const showLogoutDialog = ref(false)
const showClearCache = ref(false)
const cacheSize = ref('12.5 MB')

const userInfo = computed(() => userStore.userInfo)

const genderText = computed(() => {
  const genders = {
    0: '保密',
    1: '男',
    2: '女'
  }
  return genders[userInfo.value?.gender] || '保密'
})

const notificationSettings = ref({
  courseUpdate: true,
  promotion: false,
  reply: true
})

const playSettings = ref({
  autoNext: true,
  quality: '高清',
  backgroundPlay: false
})

const formatPhone = (phone) => {
  if (!phone) return '未设置'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const goBack = () => {
  router.back()
}

const changeAvatar = () => {
  showToast('头像更换功能即将开放')
}

const goToAbout = () => {
  router.push('/about')
}

const goToFeedback = () => {
  router.push('/feedback')
}

const showLogoutConfirm = () => {
  showLogoutDialog.value = true
}

const handleLogout = () => {
  userStore.logout()
  showToast('已退出登录')
  router.push('/login')
}

const clearCache = () => {
  showLoadingToast({
    message: '清除中...',
    forbidClick: true
  })

  setTimeout(() => {
    closeToast()
    cacheSize.value = '0 KB'
    showClearCache.value = false
    showToast('清除成功')
  }, 1000)
}
</script>

<style lang="less" scoped>
.settings-page {
  background: #f5f7fa;
}

.avatar-section {
  margin: 10px;
  padding: 16px;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-size: 14px;
  color: var(--text-color);
}

.section-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 56px;
  height: 56px;
}

.default-avatar {
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.van-cell-group) {
  margin-bottom: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

:deep(.van-cell) {
  padding: 14px 16px;
}

:deep(.van-cell__title) {
  font-size: 14px;
  color: var(--text-color);
}

.value-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-right: 4px;
}

.action-popup {
  padding: 20px;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 16px;
}

.popup-content {
  text-align: center;
  margin-bottom: 20px;
  
  p {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-bottom: 8px;
  }
  
  .sub-text {
    font-size: 12px;
    color: var(--text-color-tertiary);
  }
}

.popup-actions {
  display: flex;
  gap: 12px;
  
  .van-button {
    flex: 1;
  }
}

.bottom-space {
  height: 30px;
}
</style>
