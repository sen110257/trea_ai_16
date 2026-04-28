<template>
  <van-tabbar v-model="active" route active-color="#667eea">
    <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/category" icon="apps-o">分类</van-tabbar-item>
    <van-tabbar-item replace to="/my-learning" icon="play-circle-o">学习</van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

const tabRoutes = ['/home', '/category', '/my-learning', '/profile']

watch(
  () => route.path,
  (path) => {
    const index = tabRoutes.indexOf(path)
    if (index > -1) {
      active.value = index
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.van-tabbar {
  border-top: none;
  background: #fff;
}

.van-tabbar-item {
  font-size: 12px;
}
</style>
