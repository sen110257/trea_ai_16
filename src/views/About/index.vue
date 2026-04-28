<template>
  <div class="about-page page-wrapper">
    <van-nav-bar title="关于我们" left-arrow @click-left="goBack" fixed placeholder />

    <div class="about-content">
      <div class="brand-section">
        <div class="brand-logo">
          <div class="logo-icon">
            <van-icon name="bookmark-o" size="36" color="#fff" />
          </div>
          <h2 class="brand-name">精品课程</h2>
          <p class="brand-slogan">让学习更高效、更有趣</p>
        </div>
        <p class="version-info">当前版本 v1.0.0</p>
      </div>

      <div class="intro-section">
        <h3 class="section-title">平台简介</h3>
        <div class="intro-card">
          <p class="intro-text">
            精品课程是一款专注于知识付费的在线学习平台，致力于为用户提供高质量的课程内容和优质的学习体验。
          </p>
          <p class="intro-text">
            我们汇聚了各行各业的专业讲师，涵盖编程开发、人工智能、设计创意、产品运营、职场技能等多个领域，帮助用户随时随地学习新知识、提升职业技能。
          </p>
        </div>
      </div>

      <div class="feature-section">
        <h3 class="section-title">核心优势</h3>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="award-o" size="24" color="#667eea" />
            </div>
            <div class="feature-info">
              <h4 class="feature-title">优质内容</h4>
              <p class="feature-desc">严选行业名师，打造精品课程</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="video-o" size="24" color="#764ba2" />
            </div>
            <div class="feature-info">
              <h4 class="feature-title">高清视频</h4>
              <p class="feature-desc">1080P高清画质，流畅播放体验</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="clock-o" size="24" color="#f5576c" />
            </div>
            <div class="feature-info">
              <h4 class="feature-title">随时随地</h4>
              <p class="feature-desc">支持离线下载，学习不受限制</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <van-icon name="chart-trending-o" size="24" color="#52c41a" />
            </div>
            <div class="feature-info">
              <h4 class="feature-title">进度跟踪</h4>
              <p class="feature-desc">学习进度自动保存，随时继续</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-section">
        <h3 class="section-title">联系我们</h3>
        <van-cell-group inset>
          <van-cell title="官方网站" is-link @click="onWebsite">
            <template #right-icon>
              <span class="link-text">www.jingpinkecheng.com</span>
            </template>
          </van-cell>
          <van-cell title="客服热线" is-link @click="onCall">
            <template #right-icon>
              <span class="link-text">400-888-8888</span>
            </template>
          </van-cell>
          <van-cell title="商务合作" is-link @click="onEmail">
            <template #right-icon>
              <span class="link-text">business@example.com</span>
            </template>
          </van-cell>
          <van-cell title="工作时间">
            <template #right-icon>
              <span class="time-text">周一至周五 9:00-18:00</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <div class="copyright-section">
        <p class="copyright-text">Copyright © 2024 精品课程</p>
        <p class="copyright-text">All Rights Reserved</p>
      </div>
    </div>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const goBack = () => {
  router.back()
}

const onWebsite = () => {
  showToast('正在打开官方网站...')
}

const onCall = () => {
  showToast('正在拨打客服热线...')
}

const onEmail = () => {
  showToast('正在打开邮件应用...')
}
</script>

<style lang="less" scoped>
.about-page {
  background: #f5f7fa;
}

.about-content {
  padding: 16px;
}

.brand-section {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
}

.brand-logo {
  margin-bottom: 16px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.brand-name {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.brand-slogan {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.version-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.intro-section {
  margin-bottom: 20px;
}

.intro-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.intro-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.8;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.feature-section {
  margin-bottom: 20px;
}

.feature-list {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 8px 0;
  box-shadow: var(--shadow-sm);
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 2px;
}

.feature-desc {
  font-size: 12px;
  color: var(--text-color-tertiary);
}

.contact-section {
  margin-bottom: 20px;
}

.link-text {
  font-size: 13px;
  color: var(--primary-color);
  margin-right: 8px;
}

.time-text {
  font-size: 13px;
  color: var(--text-color-tertiary);
  margin-right: 8px;
}

.copyright-section {
  text-align: center;
  padding: 20px 0;
}

.copyright-text {
  font-size: 12px;
  color: var(--text-color-tertiary);
  line-height: 1.6;
}

.bottom-space {
  height: 30px;
}
</style>
