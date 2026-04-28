<template>
  <div class="feedback-page page-wrapper">
    <van-nav-bar title="意见反馈" left-arrow @click-left="goBack" fixed placeholder />

    <div class="feedback-content">
      <div class="type-section">
        <h3 class="section-title">反馈类型</h3>
        <div class="type-options">
          <span 
            v-for="type in feedbackTypes" 
            :key="type.value"
            class="type-option"
            :class="{ active: feedbackData.type === type.value }"
            @click="feedbackData.type = type.value"
          >
            {{ type.label }}
          </span>
        </div>
      </div>

      <div class="content-section">
        <h3 class="section-title">问题描述</h3>
        <van-field
          v-model="feedbackData.content"
          type="textarea"
          placeholder="请详细描述您遇到的问题或建议..."
          :rows="5"
          :maxlength="500"
          show-word-limit
        />
      </div>

      <div class="contact-section">
        <h3 class="section-title">联系方式（选填）</h3>
        <van-field
          v-model="feedbackData.phone"
          type="tel"
          placeholder="请留下手机号，方便我们联系您"
          clearable
        />
        <van-field
          v-model="feedbackData.email"
          type="email"
          placeholder="请留下邮箱（选填）"
          clearable
        />
      </div>

      <div class="image-section">
        <h3 class="section-title">上传截图（选填）</h3>
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="3"
          :max-size="5 * 1024 * 1024"
          upload-text="上传图片"
          @oversize="onOversize"
        />
        <p class="upload-tip">最多可上传3张图片，单张不超过5MB</p>
      </div>

      <div class="submit-section">
        <van-button 
          type="primary" 
          size="large" 
          block
          :loading="isSubmitting"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          提交反馈
        </van-button>
        <p class="submit-tip">我们会在1-3个工作日内处理您的反馈</p>
      </div>
    </div>

    <van-popup v-model:show="showSuccess" round position="center" :style="{ padding: '24px' }">
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" size="48" color="#52c41a" />
        </div>
        <h3 class="success-title">提交成功</h3>
        <p class="success-desc">感谢您的反馈，我们会尽快处理</p>
        <van-button type="primary" @click="onSuccessConfirm">知道了</van-button>
      </div>
    </van-popup>

    <div class="bottom-space"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const isSubmitting = ref(false)
const showSuccess = ref(false)
const fileList = ref([])

const feedbackData = ref({
  type: 'bug',
  content: '',
  phone: '',
  email: ''
})

const feedbackTypes = [
  { label: '功能问题', value: 'bug' },
  { label: '产品建议', value: 'suggestion' },
  { label: '体验优化', value: 'experience' },
  { label: '其他问题', value: 'other' }
]

const canSubmit = computed(() => {
  return feedbackData.value.content.trim().length > 0
})

const goBack = () => {
  router.back()
}

const onOversize = () => {
  showToast('文件大小不能超过5MB')
}

const handleSubmit = () => {
  if (!feedbackData.value.content.trim()) {
    showToast('请输入问题描述')
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
  }, 1500)
}

const onSuccessConfirm = () => {
  showSuccess.value = false
  router.back()
}
</script>

<style lang="less" scoped>
.feedback-page {
  background: #f5f7fa;
}

.feedback-content {
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.type-section {
  margin-bottom: 20px;
}

.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.type-option {
  font-size: 13px;
  color: var(--text-color-secondary);
  padding: 8px 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #eee;
  transition: all 0.2s;

  &.active {
    color: var(--primary-color);
    background: rgba(102, 126, 234, 0.1);
    border-color: var(--primary-color);
  }
}

.content-section {
  margin-bottom: 20px;

  :deep(.van-field__control) {
    min-height: 100px;
  }
}

.contact-section {
  margin-bottom: 20px;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.image-section {
  margin-bottom: 20px;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-color-tertiary);
  margin-top: 8px;
}

.submit-section {
  margin-top: 32px;
}

.submit-tip {
  font-size: 12px;
  color: var(--text-color-tertiary);
  text-align: center;
  margin-top: 12px;
}

.success-popup {
  text-align: center;
  min-width: 240px;
}

.success-icon {
  margin-bottom: 16px;
}

.success-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-bottom: 20px;
}

.bottom-space {
  height: 30px;
}
</style>
