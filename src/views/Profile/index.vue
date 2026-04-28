<template>
  <div class="profile-page page-wrapper">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="user-info" @click="handleUserClick">
        <van-image 
          v-if="userInfo?.avatar" 
          :src="userInfo.avatar" 
          class="user-avatar" 
          round 
        />
        <div v-else class="user-avatar default-avatar">
          <van-icon name="user-o" size="32" color="#667eea" />
        </div>
        <div class="user-detail">
          <h2 class="user-name">{{ userInfo?.nickname || '登录/注册' }}</h2>
          <p class="user-desc" v-if="isLoggedIn">{{ userInfo?.signature || '设置个人签名，让大家认识你' }}</p>
          <p class="user-desc" v-else>登录后享受更多功能</p>
        </div>
        <van-icon name="arrow" size="16" color="#fff" />
      </div>

      <div class="stats-bar" v-if="isLoggedIn">
        <div class="stat-item" @click="goToLearning">
          <span class="stat-value">{{ learningCount }}</span>
          <span class="stat-label">在学课程</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="goToFavorites">
          <span class="stat-value">{{ favoriteCount }}</span>
          <span class="stat-label">我的收藏</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="goToHistory">
          <span class="stat-value">{{ historyCount }}</span>
          <span class="stat-label">观看历史</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="goToOrders">
          <span class="stat-value">{{ orderCount }}</span>
          <span class="stat-label">我的订单</span>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <van-cell-group inset>
        <van-cell 
          title="我的订单" 
          is-link 
          @click="goToOrders"
        >
          <template #icon>
            <van-icon name="orders-o" size="20" color="#667eea" />
          </template>
          <template #right-icon>
            <div class="order-tabs">
              <span class="tab-item" @click.stop="goToOrders('pending')">待支付</span>
              <span class="tab-item" @click.stop="goToOrders('paid')">已购买</span>
              <van-icon name="arrow" size="12" color="#999" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset>
        <van-cell 
          title="我的学习" 
          is-link 
          @click="goToLearning"
        >
          <template #icon>
            <van-icon name="play-circle-o" size="20" color="#667eea" />
          </template>
        </van-cell>
        <van-cell 
          title="我的收藏" 
          is-link 
          @click="goToFavorites"
        >
          <template #icon>
            <van-icon name="star-o" size="20" color="#ffc107" />
          </template>
        </van-cell>
        <van-cell 
          title="观看历史" 
          is-link 
          @click="goToHistory"
        >
          <template #icon>
            <van-icon name="clock-o" size="20" color="#667eea" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset>
        <van-cell 
          title="个人资料" 
          is-link 
          @click="goToSettings"
        >
          <template #icon>
            <van-icon name="user-o" size="20" color="#667eea" />
          </template>
        </van-cell>
        <van-cell 
          title="帮助中心" 
          is-link 
          @click="showToast('功能开发中')"
        >
          <template #icon>
            <van-icon name="question-o" size="20" color="#667eea" />
          </template>
        </van-cell>
        <van-cell 
          title="意见反馈" 
          is-link 
          @click="showToast('功能开发中')"
        >
          <template #icon>
            <van-icon name="edit" size="20" color="#667eea" />
          </template>
        </van-cell>
        <van-cell 
          title="关于我们" 
          is-link 
          @click="showToast('功能开发中')"
        >
          <template #icon>
            <van-icon name="info-o" size="20" color="#667eea" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset v-if="isLoggedIn">
        <van-cell 
          title="退出登录" 
          center
          :style="{ textAlign: 'center' }"
          @click="showLogoutConfirm"
        >
          <template #title>
            <span style="color: #ff4d4f;">退出登录</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="bottom-space"></div>
    <TabBar />

    <van-dialog
      v-model:show="showLogoutDialog"
      title="提示"
      message="确定要退出登录吗？"
      show-cancel-button
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import TabBar from '@/components/TabBar/index.vue'
import { showToast, showDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const showLogoutDialog = ref(false)

const learningCount = computed(() => {
  return Object.keys(userStore.learningProgress).length
})

const favoriteCount = computed(() => userStore.favorites.length)
const historyCount = computed(() => userStore.history.length)
const orderCount = computed(() => userStore.orders.length)

const handleUserClick = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
  } else {
    router.push('/settings')
  }
}

const goToLearning = () => {
  if (!isLoggedIn.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  router.push('/my-learning')
}

const goToFavorites = () => {
  if (!isLoggedIn.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  router.push('/favorites')
}

const goToHistory = () => {
  if (!isLoggedIn.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  router.push('/history')
}

const goToOrders = (status) => {
  if (!isLoggedIn.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  router.push({ path: '/orders', query: { status } })
}

const goToSettings = () => {
  if (!isLoggedIn.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  router.push('/settings')
}

const showLogoutConfirm = () => {
  showLogoutDialog.value = true
}

const handleLogout = () => {
  userStore.logout()
  showToast('已退出登录')
}
</script>

<style lang="less" scoped>
.profile-page {
  background: #f5f7fa;
}

.profile-header {
  position: relative;
  padding-top: 20px;
  padding-bottom: 80px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 220px;
  background: var(--primary-gradient);
  z-index: 0;
}

.user-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.user-avatar {
  width: 72px;
  height: 72px;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.default-avatar {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-detail {
  flex: 1;
  margin-left: 16px;
  color: #fff;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.user-desc {
  font-size: 13px;
  opacity: 0.8;
}

.stats-bar {
  position: absolute;
  bottom: -40px;
  left: 16px;
  right: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 16px 0;
  box-shadow: var(--shadow-md);
}

.stat-item {
  text-align: center;
  
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
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 0, 0, 0.08);
}

.menu-section {
  margin-top: 50px;
  
  :deep(.van-cell-group) {
    margin-bottom: 12px;
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  
  :deep(.van-cell) {
    padding: 14px 16px;
  }
  
  :deep(.van-cell__title) {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--text-color);
  }
}

.order-tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color-secondary);
  font-size: 13px;
  
  .tab-item {
    &:active {
      color: var(--primary-color);
    }
  }
}

.bottom-space {
  height: 30px;
}
</style>
