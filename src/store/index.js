import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || null)
  const token = ref(localStorage.getItem('token') || '')
  const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])
  const history = ref(JSON.parse(localStorage.getItem('history')) || [])
  const learningProgress = ref(JSON.parse(localStorage.getItem('learningProgress')) || {})
  const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])

  const isLoggedIn = computed(() => !!userInfo.value)

  function login(userData, userToken) {
    userInfo.value = userData
    token.value = userToken
    localStorage.setItem('userInfo', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  function updateUserInfo(data) {
    userInfo.value = { ...userInfo.value, ...data }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  function toggleFavorite(courseId) {
    const index = favorites.value.indexOf(courseId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.unshift(courseId)
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function isFavorite(courseId) {
    return favorites.value.includes(courseId)
  }

  function addHistory(courseId, chapterId = null, progress = 0) {
    const index = history.value.findIndex(item => item.courseId === courseId)
    const historyItem = {
      courseId,
      chapterId,
      progress,
      viewedAt: Date.now()
    }
    
    if (index > -1) {
      history.value[index] = historyItem
    } else {
      history.value.unshift(historyItem)
    }
    
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    
    localStorage.setItem('history', JSON.stringify(history.value))
  }

  function updateLearningProgress(courseId, chapterId, progress, currentTime = 0) {
    if (!learningProgress.value[courseId]) {
      learningProgress.value[courseId] = {
        chapters: {}
      }
    }
    
    learningProgress.value[courseId].chapters[chapterId] = {
      progress,
      currentTime,
      updatedAt: Date.now()
    }
    
    learningProgress.value[courseId].lastChapterId = chapterId
    
    const courseChapters = learningProgress.value[courseId].chapters
    let totalProgress = 0
    const chapterCount = Object.keys(courseChapters).length
    
    Object.values(courseChapters).forEach(chapter => {
      totalProgress += chapter.progress
    })
    
    learningProgress.value[courseId].totalProgress = chapterCount > 0 ? totalProgress / chapterCount : 0
    
    localStorage.setItem('learningProgress', JSON.stringify(learningProgress.value))
  }

  function getLearningProgress(courseId) {
    return learningProgress.value[courseId] || null
  }

  function createOrder(course, type = 'single') {
    const order = {
      id: Date.now().toString(),
      courseId: course.id,
      courseTitle: course.title,
      courseCover: course.cover,
      type: type,
      price: type === 'column' ? (course.columnPrice || course.price) : course.price,
      originalPrice: course.originalPrice,
      status: 'pending',
      createdAt: Date.now(),
      paidAt: null
    }
    
    orders.value.unshift(order)
    localStorage.setItem('orders', JSON.stringify(orders.value))
    
    return order
  }

  function payOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'paid'
      order.paidAt = Date.now()
      localStorage.setItem('orders', JSON.stringify(orders.value))
    }
  }

  function hasPurchased(courseId) {
    return orders.value.some(order => 
      order.courseId === courseId && order.status === 'paid'
    )
  }

  return {
    userInfo,
    token,
    favorites,
    history,
    learningProgress,
    orders,
    isLoggedIn,
    login,
    logout,
    updateUserInfo,
    toggleFavorite,
    isFavorite,
    addHistory,
    updateLearningProgress,
    getLearningProgress,
    createOrder,
    payOrder,
    hasPurchased
  }
})
