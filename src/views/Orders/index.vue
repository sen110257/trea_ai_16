<template>
  <div class="orders-page page-wrapper">
    <van-nav-bar title="我的订单" left-arrow @click-left="goBack" fixed placeholder />

    <van-tabs v-model:active="activeTab" color="#667eea" sticky offset-top="46">
      <van-tab title="全部">
        <div class="order-list">
          <OrderItem 
            v-for="order in orders" 
            :key="order.id" 
            :order="order"
            @click="goToOrderDetail(order)"
          />
          <van-empty v-if="orders.length === 0" description="暂无订单" />
        </div>
      </van-tab>

      <van-tab title="待支付">
        <div class="order-list">
          <OrderItem 
            v-for="order in pendingOrders" 
            :key="order.id" 
            :order="order"
            @click="goToOrderDetail(order)"
          />
          <van-empty v-if="pendingOrders.length === 0" description="暂无待支付订单" />
        </div>
      </van-tab>

      <van-tab title="已购买">
        <div class="order-list">
          <OrderItem 
            v-for="order in paidOrders" 
            :key="order.id" 
            :order="order"
            @click="goToOrderDetail(order)"
          />
          <van-empty v-if="paidOrders.length === 0" description="暂无已购买订单" />
        </div>
      </van-tab>

      <van-tab title="已退款">
        <div class="order-list">
          <OrderItem 
            v-for="order in refundedOrders" 
            :key="order.id" 
            :order="order"
            @click="goToOrderDetail(order)"
          />
          <van-empty v-if="refundedOrders.length === 0" description="暂无已退款订单" />
        </div>
      </van-tab>
    </van-tabs>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import OrderItem from './components/OrderItem.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeTab = ref(0)

const orderStatusMap = {
  all: 0,
  pending: 1,
  paid: 2,
  refunded: 3
}

watch(
  () => route.query.status,
  (status) => {
    if (status && orderStatusMap[status] !== undefined) {
      activeTab.value = orderStatusMap[status]
    }
  },
  { immediate: true }
)

const orders = computed(() => userStore.orders)

const pendingOrders = computed(() => 
  orders.value.filter(o => o.status === 'pending')
)

const paidOrders = computed(() => 
  orders.value.filter(o => o.status === 'paid')
)

const refundedOrders = computed(() => 
  orders.value.filter(o => o.status === 'refunded')
)

const goBack = () => {
  router.back()
}

const goToOrderDetail = (order) => {
  router.push(`/order/${order.id}`)
}
</script>

<style lang="less" scoped>
.orders-page {
  background: #f5f7fa;
}

.order-list {
  padding: 10px;
}

.bottom-space {
  height: 30px;
}
</style>
