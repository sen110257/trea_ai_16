<template>
  <div class="order-detail-page page-wrapper">
    <van-nav-bar title="订单详情" left-arrow @click-left="goBack" fixed placeholder />

    <div class="order-status-section" :class="orderStatusClass">
      <div class="status-icon">
        <van-icon :name="statusIcon" size="32" />
      </div>
      <div class="status-info">
        <h3 class="status-title">{{ statusText }}</h3>
        <p class="status-desc" v-if="statusDesc">{{ statusDesc }}</p>
      </div>
    </div>

    <van-cell-group inset>
      <van-cell title="订单编号" :value="order?.id" />
      <van-cell title="创建时间" :value="formatTime(order?.createdAt)" />
      <van-cell title="支付时间" :value="order?.paidAt ? formatTime(order.paidAt) : '-'">
        <template #default>
          <span v-if="order?.paidAt">{{ formatTime(order.paidAt) }}</span>
          <span v-else style="color: var(--text-color-tertiary);">待支付</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset title="课程信息">
      <div class="course-card" @click="goToCourse">
        <van-image :src="order?.courseCover" class="course-cover" lazy-load />
        <div class="course-info">
          <h3 class="course-title">{{ order?.courseTitle }}</h3>
          <p class="course-type">{{ order?.type === 'column' ? '专栏购买' : '单课购买' }}</p>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group inset title="价格明细">
      <van-cell title="课程价格">
        <template #right-icon>
          <span class="price-text">¥{{ order?.price }}</span>
        </template>
      </van-cell>
      <van-cell title="优惠">
        <template #right-icon>
          <span class="price-text">-¥0.00</span>
        </template>
      </van-cell>
      <van-cell title="实付金额">
        <template #right-icon>
          <span class="total-price">¥{{ order?.price }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="action-buttons" v-if="order?.status === 'pending'">
      <van-button type="default" size="large" @click="handleCancel">取消订单</van-button>
      <van-button type="primary" size="large" @click="handlePay">立即支付</van-button>
    </div>

    <div class="action-buttons" v-if="order?.status === 'paid'">
      <van-button type="primary" size="large" @click="goToCourse">继续学习</van-button>
    </div>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const orderId = computed(() => route.params.id)
const order = ref(null)

const orderStatusClass = computed(() => {
  const classes = {
    pending: 'pending',
    paid: 'paid',
    refunded: 'refunded'
  }
  return classes[order.value?.status] || ''
})

const statusIcon = computed(() => {
  const icons = {
    pending: 'clock-o',
    paid: 'checked',
    refunded: 'close'
  }
  return icons[order.value?.status] || 'info-o'
})

const statusText = computed(() => {
  const texts = {
    pending: '待支付',
    paid: '支付成功',
    refunded: '已退款'
  }
  return texts[order.value?.status] || '未知状态'
})

const statusDesc = computed(() => {
  if (order.value?.status === 'pending') {
    return '请在30分钟内完成支付，超时订单将自动取消'
  }
  if (order.value?.status === 'paid') {
    return '您已成功购买该课程，快去学习吧！'
  }
  return ''
})

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const loadOrder = () => {
  order.value = userStore.orders.find(o => o.id === orderId.value)
}

const goBack = () => {
  router.back()
}

const goToCourse = () => {
  if (order.value) {
    router.push(`/course/${order.value.courseId}`)
  }
}

const handleCancel = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要取消该订单吗？'
  }).then(() => {
    userStore.orders = userStore.orders.filter(o => o.id !== orderId.value)
    localStorage.setItem('orders', JSON.stringify(userStore.orders))
    showToast('订单已取消')
    router.back()
  }).catch(() => {})
}

const handlePay = () => {
  userStore.payOrder(orderId.value)
  order.value.status = 'paid'
  order.value.paidAt = Date.now()
  showToast('支付成功')
}

onMounted(() => {
  loadOrder()
})
</script>

<style lang="less" scoped>
.order-detail-page {
  background: #f5f7fa;
}

.order-status-section {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  margin: 10px;
  border-radius: var(--radius-lg);
  
  &.pending {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    
    .status-icon {
      background: rgba(250, 173, 20, 0.2);
      color: #faad14;
    }
    
    .status-title {
      color: #faad14;
    }
  }
  
  &.paid {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    
    .status-icon {
      background: rgba(82, 196, 26, 0.2);
      color: #52c41a;
    }
    
    .status-title {
      color: #52c41a;
    }
  }
  
  &.refunded {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    
    .status-icon {
      background: rgba(255, 77, 79, 0.2);
      color: #ff4d4f;
    }
    
    .status-title {
      color: #ff4d4f;
    }
  }
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.status-desc {
  font-size: 13px;
  color: var(--text-color-secondary);
  line-height: 1.5;
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
  color: var(--text-color-secondary);
}

:deep(.van-cell__value) {
  font-size: 14px;
  color: var(--text-color);
}

.course-card {
  display: flex;
  padding: 12px 16px;
}

.course-cover {
  width: 100px;
  height: 70px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
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
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-type {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.price-text {
  font-size: 14px;
  color: var(--text-color);
}

.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
  
  .van-button {
    flex: 1;
    border-radius: 20px;
  }
  
  .van-button--primary {
    background: var(--primary-gradient);
    border: none;
  }
}

.bottom-space {
  height: 80px;
}
</style>
