<template>
  <div class="app-container" :style="safeAreaStyle">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const safeAreaStyle = computed(() => ({
  paddingTop: 'var(--safe-area-top)',
  paddingBottom: 'var(--safe-area-bottom)'
}))
</script>

<style lang="less">
.app-container {
  min-height: 100vh;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.page-container {
  min-height: 100vh;
  padding-bottom: 60px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e8ec 100%);
}

.page-content {
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .more {
    font-size: 14px;
    color: var(--text-color-tertiary);
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-sm);
  }
}

.van-nav-bar {
  background: var(--primary-gradient);
  
  .van-nav-bar__title,
  .van-nav-bar__text,
  .van-icon {
    color: #fff;
  }
}

.van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  padding-bottom: var(--safe-area-bottom);
  
  .van-tabbar-item--active {
    color: var(--primary-color);
  }
}

.van-tag--primary {
  background: var(--primary-gradient);
  border: none;
}

.van-button--primary {
  background: var(--primary-gradient);
  border: none;
  box-shadow: var(--shadow-md);
}

.van-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: none;
  
  .van-card__thumb {
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }
}

.van-swipe__indicator--active {
  background: var(--primary-gradient);
}
</style>
