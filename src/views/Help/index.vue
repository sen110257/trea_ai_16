<template>
  <div class="help-page page-wrapper">
    <van-nav-bar title="帮助中心" left-arrow @click-left="goBack" fixed placeholder />

    <div class="search-section">
      <van-search
        v-model="searchText"
        placeholder="搜索问题..."
        :disabled="true"
        @click="onSearch"
      />
    </div>

    <div class="category-section">
      <h3 class="section-title">常见问题分类</h3>
      <div class="category-grid">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-item"
          @click="onCategoryClick(category)"
        >
          <div class="category-icon">
            <van-icon :name="category.icon" size="28" :color="category.color" />
          </div>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h3 class="section-title">热门问题</h3>
      <van-cell-group inset>
        <van-cell
          v-for="faq in faqList"
          :key="faq.id"
          is-link
          @click="onFaqClick(faq)"
        >
          <template #title>
            <div class="faq-item">
              <span class="faq-question">{{ faq.question }}</span>
              <span class="faq-tag" v-if="faq.isHot">热门</span>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="contact-section">
      <h3 class="section-title">联系客服</h3>
      <van-cell-group inset>
        <van-cell title="在线客服" is-link @click="onContact">
          <template #right-icon>
            <span class="status-text">在线</span>
          </template>
        </van-cell>
        <van-cell title="客服热线" is-link @click="onCall">
          <template #right-icon>
            <span class="phone-text">400-888-8888</span>
          </template>
        </van-cell>
        <van-cell title="工作时间">
          <template #right-icon>
            <span class="time-text">周一至周五 9:00-18:00</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-popup v-model:show="showFaqDetail" position="bottom" round :style="{ height: '60%' }">
      <div class="faq-detail">
        <div class="detail-header">
          <h3 class="detail-title">{{ selectedFaq?.question }}</h3>
          <van-icon name="cross" size="20" @click="showFaqDetail = false" />
        </div>
        <div class="detail-content">
          <p class="answer-text">{{ selectedFaq?.answer }}</p>
        </div>
      </div>
    </van-popup>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const searchText = ref('')
const showFaqDetail = ref(false)
const selectedFaq = ref(null)

const categories = [
  { id: 1, name: '账户问题', icon: 'user-o', color: '#667eea' },
  { id: 2, name: '课程购买', icon: 'shopping-cart-o', color: '#f5576c' },
  { id: 3, name: '视频播放', icon: 'play-circle-o', color: '#52c41a' },
  { id: 4, name: '学习进度', icon: 'clock-o', color: '#faad14' },
  { id: 5, name: '订单退款', icon: 'balance-o', color: '#764ba2' },
  { id: 6, name: '其他问题', icon: 'info-o', color: '#1890ff' }
]

const faqList = [
  {
    id: 1,
    question: '如何购买课程？',
    answer: '您可以通过以下方式购买课程：1. 进入课程详情页，点击底部的"立即购买"按钮；2. 选择支付方式（微信支付或支付宝）；3. 完成支付后即可观看全部课程内容。购买后课程会自动添加到"我的学习"中。',
    isHot: true
  },
  {
    id: 2,
    question: '购买的课程可以退款吗？',
    answer: '根据平台规则，课程购买后7天内如未观看超过30%内容，可以申请全额退款。退款申请请联系客服处理，客服会在1-3个工作日内审核您的申请。退款金额将原路返回到您的支付账户。',
    isHot: true
  },
  {
    id: 3,
    question: '视频无法播放怎么办？',
    answer: '如果视频无法播放，请尝试以下解决方案：1. 检查网络连接是否正常；2. 尝试切换WiFi或移动数据；3. 清除浏览器缓存或重启App；4. 更新到最新版本。如问题仍存在，请联系客服。',
    isHot: true
  },
  {
    id: 4,
    question: '学习进度会自动保存吗？',
    answer: '是的，学习进度会自动保存到本地存储。每次打开App时，系统会自动恢复您上次的学习位置。您可以在"我的学习"页面查看所有课程的学习进度。建议登录账号后使用，以便跨设备同步学习进度。',
    isHot: false
  },
  {
    id: 5,
    question: '如何修改个人资料？',
    answer: '修改个人资料的步骤：1. 进入"个人中心"页面；2. 点击头像或昵称进入设置页面；3. 点击需要修改的信息（昵称、头像、性别等）；4. 保存修改即可。部分信息修改后需要重新登录才能生效。',
    isHot: false
  },
  {
    id: 6,
    question: '课程会更新吗？',
    answer: '我们会定期更新课程内容，确保学员学到最新的知识。已购买课程的学员可以免费观看更新后的内容。课程更新时会通过通知消息提醒您。您也可以在课程详情页查看更新日志。',
    isHot: false
  }
]

const goBack = () => {
  router.back()
}

const onSearch = () => {
  showToast('搜索功能开发中')
}

const onCategoryClick = (category) => {
  showToast(`查看${category.name}相关问题`)
}

const onFaqClick = (faq) => {
  selectedFaq.value = faq
  showFaqDetail.value = true
}

const onContact = () => {
  showToast('正在连接客服...')
}

const onCall = () => {
  showToast('正在拨打客服热线...')
}
</script>

<style lang="less" scoped>
.help-page {
  background: #f5f7fa;
}

.search-section {
  padding: 12px 16px;
  background: #fff;
}

.category-section {
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.category-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.category-name {
  font-size: 13px;
  color: var(--text-color);
}

.faq-section {
  padding: 0 16px 16px;
}

.faq-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.faq-question {
  font-size: 14px;
  color: var(--text-color);
}

.faq-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: #fff;
  border-radius: 4px;
}

.contact-section {
  padding: 0 16px 16px;
}

.status-text {
  font-size: 13px;
  color: #52c41a;
  margin-right: 8px;
}

.phone-text {
  font-size: 13px;
  color: var(--primary-color);
  margin-right: 8px;
}

.time-text {
  font-size: 13px;
  color: var(--text-color-tertiary);
  margin-right: 8px;
}

.faq-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  flex: 1;
  margin-right: 16px;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.answer-text {
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.8;
}

.bottom-space {
  height: 30px;
}
</style>
