<template>
  <div class="login-page">
    <div class="login-header">
      <div class="header-bg"></div>
      <van-nav-bar 
        left-arrow 
        @click-left="goBack"
        :style="navBarStyle"
      />
      <div class="logo-section">
        <div class="logo-icon">
          <van-icon name="books-o" size="40" color="#fff" />
        </div>
        <h1 class="logo-title">精品课程</h1>
        <p class="logo-subtitle">知识改变命运，学习成就未来</p>
      </div>
    </div>

    <div class="login-content">
      <van-tabs v-model:active="activeTab" color="#667eea" line-width="40">
        <van-tab title="登录">
          <div class="form-section">
            <van-field
              v-model="loginForm.phone"
              type="tel"
              label="手机号"
              placeholder="请输入手机号"
              maxlength="11"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
            <van-field
              v-model="loginForm.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }]"
            />
            
            <div class="form-actions">
              <div class="remember-checkbox">
                <van-checkbox v-model="rememberMe" icon-size="18">
                  <span class="checkbox-label">记住密码</span>
                </van-checkbox>
              </div>
              <span class="forgot-link" @click="showToast('功能开发中')">忘记密码？</span>
            </div>

            <van-button 
              type="primary" 
              size="large"
              class="submit-btn"
              :loading="isLoading"
              @click="handleLogin"
            >
              登录
            </van-button>

            <div class="other-login">
              <p class="other-title">其他登录方式</p>
              <div class="login-methods">
                <div class="method-item" @click="handleQuickLogin">
                  <div class="method-icon wechat">
                    <van-icon name="wechat" size="24" color="#fff" />
                  </div>
                  <span class="method-label">微信</span>
                </div>
                <div class="method-item" @click="handleQuickLogin">
                  <div class="method-icon phone">
                    <van-icon name="phone-o" size="24" color="#fff" />
                  </div>
                  <span class="method-label">手机号</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="注册">
          <div class="form-section">
            <van-field
              v-model="registerForm.phone"
              type="tel"
              label="手机号"
              placeholder="请输入手机号"
              maxlength="11"
            />
            <van-field
              v-model="registerForm.code"
              type="tel"
              label="验证码"
              placeholder="请输入验证码"
              maxlength="6"
            >
              <template #button>
                <van-button 
                  size="small" 
                  type="primary" 
                  plain
                  :disabled="isSendingCode"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </van-button>
              </template>
            </van-field>
            <van-field
              v-model="registerForm.password"
              type="password"
              label="设置密码"
              placeholder="请设置6-16位密码"
            />
            <van-field
              v-model="registerForm.confirmPassword"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
            />
            <van-field
              v-model="registerForm.nickname"
              label="昵称"
              placeholder="请输入昵称（选填）"
            />

            <div class="agreement-section">
              <van-checkbox v-model="agreed" icon-size="18" shape="square">
                <span class="agreement-text">
                  我已阅读并同意
                  <span class="link" @click.stop>《用户协议》</span>
                  和
                  <span class="link" @click.stop>《隐私政策》</span>
                </span>
              </van-checkbox>
            </div>

            <van-button 
              type="primary" 
              size="large"
              class="submit-btn"
              :loading="isLoading"
              @click="handleRegister"
            >
              注册
            </van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeTab = ref(0)
const isLoading = ref(false)
const isSendingCode = ref(false)
const countdown = ref(0)
const rememberMe = ref(false)
const agreed = ref(false)

const loginForm = ref({
  phone: '',
  password: ''
})

const registerForm = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

const navBarStyle = computed(() => ({
  background: 'transparent',
  position: 'absolute',
  top: 'var(--safe-area-top)',
  zIndex: 100,
  
  ':deep(.van-icon)': {
    color: '#fff'
  }
}))

const goBack = () => {
  if (route.query.redirect) {
    router.push(route.query.redirect)
  } else {
    router.back()
  }
}

const handleLogin = () => {
  if (!loginForm.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!loginForm.value.password) {
    showToast('请输入密码')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    
    const userData = {
      id: 1,
      phone: loginForm.value.phone,
      nickname: registerForm.value.nickname || '学习者' + loginForm.value.phone.slice(-4),
      avatar: '',
      signature: '',
      gender: 0,
      balance: 0
    }
    
    const token = 'mock_token_' + Date.now()
    
    userStore.login(userData, token)
    showToast('登录成功')
    
    if (route.query.redirect) {
      router.push(route.query.redirect)
    } else {
      router.push('/profile')
    }
  }, 1000)
}

const handleQuickLogin = () => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    
    const userData = {
      id: 1,
      phone: '13800138000',
      nickname: '体验用户',
      avatar: '',
      signature: '热爱学习，天天向上',
      gender: 0,
      balance: 100
    }
    
    const token = 'mock_token_' + Date.now()
    
    userStore.login(userData, token)
    showToast('登录成功')
    
    if (route.query.redirect) {
      router.push(route.query.redirect)
    } else {
      router.push('/profile')
    }
  }, 800)
}

const sendCode = () => {
  if (!registerForm.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }

  isSendingCode.value = true
  countdown.value = 60
  showToast('验证码已发送')

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSendingCode.value = false
    }
  }, 1000)
}

const handleRegister = () => {
  if (!registerForm.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (!registerForm.value.code) {
    showToast('请输入验证码')
    return
  }
  if (!registerForm.value.password) {
    showToast('请设置密码')
    return
  }
  if (registerForm.value.password.length < 6) {
    showToast('密码至少6位')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }
  if (!agreed.value) {
    showToast('请同意用户协议')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    
    const userData = {
      id: Date.now(),
      phone: registerForm.value.phone,
      nickname: registerForm.value.nickname || '新用户' + registerForm.value.phone.slice(-4),
      avatar: '',
      signature: '',
      gender: 0,
      balance: 0
    }
    
    const token = 'mock_token_' + Date.now()
    
    userStore.login(userData, token)
    showToast('注册成功')
    
    if (route.query.redirect) {
      router.push(route.query.redirect)
    } else {
      router.push('/profile')
    }
  }, 1000)
}
</script>

<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.login-header {
  position: relative;
  padding-top: 46px;
  padding-bottom: 60px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 260px;
  background: var(--primary-gradient);
  border-radius: 0 0 40px 40px;
  z-index: 0;
}

.logo-section {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 30px 0;
}

.logo-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
}

.logo-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.login-content {
  position: relative;
  z-index: 2;
  margin: -40px 16px 0;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.form-section {
  padding: 20px 16px;
}

:deep(.van-cell) {
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

:deep(.van-field__label) {
  width: 80px;
  font-size: 14px;
  color: var(--text-color);
}

:deep(.van-field__control) {
  font-size: 14px;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.checkbox-label {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.forgot-link {
  font-size: 13px;
  color: var(--primary-color);
}

.submit-btn {
  margin-top: 16px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  background: var(--primary-gradient);
  border: none;
  height: 48px;
}

.other-login {
  margin-top: 30px;
  text-align: center;
}

.other-title {
  font-size: 13px;
  color: var(--text-color-tertiary);
  margin-bottom: 20px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60px;
    height: 1px;
    background: #eee;
  }
  
  &::before {
    left: 20px;
  }
  
  &::after {
    right: 20px;
  }
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.wechat {
    background: #07c160;
  }
  
  &.phone {
    background: var(--primary-gradient);
  }
}

.method-label {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.agreement-section {
  padding: 16px 0;
}

.agreement-text {
  font-size: 12px;
  color: var(--text-color-secondary);
  
  .link {
    color: var(--primary-color);
  }
}
</style>
