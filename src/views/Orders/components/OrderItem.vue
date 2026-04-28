<template>
  <div class="order-item" @click="$emit('click')">
    <div class="order-header">
      <span class="order-number">订单号：{{ order.id }}</span>
      <span class="order-status" :class="order.status">
        {{ statusText }}
      </span>
    </div>
    
    <div class="order-content">
      <van-image :src="order.courseCover" class="course-cover" />
      <div class="course-info">
        <h3 class="course-title">{{ order.courseTitle }}</h3>
        <p class="course-type">{{ order.type === 'column' ? '专栏购买' : '单课购买' }}</p>
      </div>
      <div class="price-info">
        <span class="price-symbol">¥</span>
        <span class="price-value">{{ order.price }}</span>
      </div>
    </div>

    <div class="order-footer">
      <div class="order-time">
        <span>下单时间：{{ formatTime(order.createdAt) }}</span>
      </div>
      <div class="order-actions">
        <template v-if="order.status === 'pending'">
          <van-button size="small" type="default" plain @click.stop="handleCancel">
            取消订单
          </van-button>
          <van-button size="small" type="primary" @click.stop="handlePay">
            立即支付
          </van-button>
        </template>
        <template v-else-if="order.status === 'paid'">
          <van-button size="small" type="default" plain @click.stop="handleContinue">
            继续学习
          </van-button>
          <van-button size="small" type="primary" plain @click.stop="handleComment">
            去评价
          </van-button>
        </template>
        <template v-else-if="order.status === 'refunded'">
          <van-button size="small" type="default" plain disabled>
            已退款
          </van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { showToast, showConfirmDialog } from 'vant'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const router = useRouter()
const userStore = useUserStore()

const statusText = computed(() => {
  const statusMap = {
    pending: '待支付',
    paid: '已购买',
    refunded: '已退款'
  }
  return statusMap[props.order.status] || props.order.status
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const handleCancel = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要取消该订单吗？'
  }).then(() => {
    showToast('订单已取消')
  }).catch(() => {})
}

const handlePay = () => {
  userStore.payOrder(props.order.id)
  showToast('支付成功')
}

const handleContinue = () => {
  router.push(`/course/${props.order.courseId}`)
}

const handleComment = () => {
  router.push(`/comments/${props.order.courseId}`)
}
</script>

<style lang="less" scoped>
.order-item {
  background: #fff;
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
  padding: 14px;
  box-shadow: var(--shadow-sm);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.order-number {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.order-status {
  font-size: 13px;
  font-weight: 500;
  
  &.pending {
    color: #faad14;
  }
  
  &.paid {
    color: #52c41a;
  }
  
  &.refunded {
    color: var(--text-color-tertiary);
  }
}

.order-content {
  display: flex;
  margin-bottom: 12px;
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

.price-info {
  text-align: right;
  flex-shrink: 0;
  
  .price-symbol {
    font-size: 12px;
    color: #ff6b6b;
  }
  
  .price-value {
    font-size: 18px;
    font-weight: 600;
    color: #ff6b6b;
  }
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.order-time {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.order-actions {
  display: flex;
  gap: 10px;
}
</style>
