import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
    meta: { title: '首页', showTabbar: true }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/Category/index.vue'),
    meta: { title: '课程分类', showTabbar: true }
  },
  {
    path: '/my-learning',
    name: 'MyLearning',
    component: () => import('@/views/MyLearning/index.vue'),
    meta: { title: '我的学习', showTabbar: true, requireAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile/index.vue'),
    meta: { title: '个人中心', showTabbar: true }
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: () => import('@/views/CourseDetail/index.vue'),
    meta: { title: '课程详情', showTabbar: false }
  },
  {
    path: '/teacher/:id',
    name: 'Teacher',
    component: () => import('@/views/Teacher/index.vue'),
    meta: { title: '讲师主页', showTabbar: false }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders/index.vue'),
    meta: { title: '我的订单', showTabbar: false, requireAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetail/index.vue'),
    meta: { title: '订单详情', showTabbar: false, requireAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录', showTabbar: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/index.vue'),
    meta: { title: '注册', showTabbar: false }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites/index.vue'),
    meta: { title: '我的收藏', showTabbar: false, requireAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History/index.vue'),
    meta: { title: '观看历史', showTabbar: false, requireAuth: true }
  },
  {
    path: '/comments/:courseId',
    name: 'Comments',
    component: () => import('@/views/Comments/index.vue'),
    meta: { title: '学员评价', showTabbar: false }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue'),
    meta: { title: '设置', showTabbar: false }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help/index.vue'),
    meta: { title: '帮助中心', showTabbar: false }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/Feedback/index.vue'),
    meta: { title: '意见反馈', showTabbar: false }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About/index.vue'),
    meta: { title: '关于我们', showTabbar: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search/index.vue'),
    meta: { title: '搜索', showTabbar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '精品课程'
  
  const userInfo = localStorage.getItem('userInfo')
  
  if (to.meta.requireAuth && !userInfo) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
