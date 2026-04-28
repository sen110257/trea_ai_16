export const bannerList = [
  {
    id: 1,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20online%20education%20banner%20with%20laptop%20and%20books%20knowledge%20learning%20professional&image_size=landscape_16_9',
    title: '新课上线',
    description: 'Python全栈开发，限时优惠'
  },
  {
    id: 2,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20course%20promotion%20banner%20with%20teacher%20teaching%20on%20screen%20knowledge%20platform&image_size=landscape_16_9',
    title: '名师精品课',
    description: '跟着大咖学技能'
  },
  {
    id: 3,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=e-learning%20education%20platform%20banner%20with%20mobile%20phone%20video%20course%20modern%20design&image_size=landscape_16_9',
    title: '限时免费',
    description: '精选课程免费学'
  }
]

export const categories = [
  { id: 1, name: '全部', icon: 'apps-o' },
  { id: 2, name: '编程开发', icon: 'code-o' },
  { id: 3, name: '人工智能', icon: 'cpu' },
  { id: 4, name: '设计创意', icon: 'photo-o' },
  { id: 5, name: '产品运营', icon: 'shopping-cart-o' },
  { id: 6, name: '职场技能', icon: 'manager-o' },
  { id: 7, name: '语言学习', icon: 'chat-o' },
  { id: 8, name: '商业财经', icon: 'balance-o' }
]

export const columns = [
  {
    id: 1,
    title: 'Python全栈开发实战专栏',
    description: '从入门到精通，系统学习Python开发技能',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20course%20cover%20with%20snake%20logo%20code%20screens%20modern%20education%20design&image_size=landscape_4_3',
    teacherId: 1,
    teacherName: '张教授',
    courseCount: 24,
    studentCount: 12856,
    rating: 4.9,
    price: 299,
    originalPrice: 599,
    tags: ['热门', '推荐']
  },
  {
    id: 2,
    title: 'UI/UX设计大师班',
    description: '成为顶级设计师的必修课程',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=UI%20UX%20design%20course%20cover%20with%20design%20tools%20color%20palette%20creative%20professional&image_size=landscape_4_3',
    teacherId: 2,
    teacherName: '李设计师',
    courseCount: 18,
    studentCount: 8764,
    rating: 4.8,
    price: 199,
    originalPrice: 399,
    tags: ['新课']
  }
]

export const courses = [
  {
    id: 1,
    title: 'Python从入门到精通',
    description: '系统学习Python编程语言，从基础语法到高级应用，适合初学者和有一定编程基础的学员。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20course%20cover%20code%20screen%20modern%20tech%20education&image_size=landscape_4_3',
    teacherId: 1,
    teacherName: '张教授',
    teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20teacher%20portrait%20friendly%20smile%20tech%20industry%20headshot&image_size=square',
    categoryId: 2,
    categoryName: '编程开发',
    price: 99,
    originalPrice: 199,
    isFree: false,
    hasTrial: true,
    trialChapters: [1, 2],
    studentCount: 56842,
    rating: 4.9,
    ratingCount: 3256,
    duration: 36000,
    chapterCount: 48,
    columnId: 1,
    tags: ['热门', '推荐'],
    difficulty: 'intermediate',
    createdAt: '2024-01-15',
    intro: '本课程由浅入深地讲解Python编程语言，涵盖基础语法、面向对象编程、常用库使用、Web开发、数据分析等内容。通过大量实战案例，帮助学员快速掌握Python开发技能。',
    chapters: [
      {
        id: 1,
        title: '课程简介与环境搭建',
        duration: 1800,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: true,
        isFree: false
      },
      {
        id: 2,
        title: 'Python基础语法',
        duration: 3600,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: true,
        isFree: false
      },
      {
        id: 3,
        title: '变量与数据类型',
        duration: 2700,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: false
      },
      {
        id: 4,
        title: '运算符与表达式',
        duration: 2400,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: false
      },
      {
        id: 5,
        title: '流程控制语句',
        duration: 3200,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: false
      }
    ]
  },
  {
    id: 2,
    title: 'UI设计入门到精通',
    description: '从零开始学习UI设计，掌握设计工具和设计思维，打造专业级设计作品。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=UI%20design%20course%20cover%20creative%20colors%20design%20tools%20modern%20creative&image_size=landscape_4_3',
    teacherId: 2,
    teacherName: '李设计师',
    teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=female%20designer%20portrait%20creative%20professional%20artistic%20headshot&image_size=square',
    categoryId: 4,
    categoryName: '设计创意',
    price: 129,
    originalPrice: 259,
    isFree: false,
    hasTrial: true,
    trialChapters: [1],
    studentCount: 32541,
    rating: 4.8,
    ratingCount: 2145,
    duration: 28800,
    chapterCount: 36,
    columnId: 2,
    tags: ['新课'],
    difficulty: 'beginner',
    createdAt: '2024-03-01',
    intro: '本课程适合零基础学员，从设计基础理论到实战项目，全面掌握UI设计技能。课程涵盖设计工具使用、色彩搭配、排版设计、图标设计、交互设计等核心内容。',
    chapters: [
      {
        id: 1,
        title: 'UI设计概述',
        duration: 1500,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: true,
        isFree: false
      },
      {
        id: 2,
        title: '设计工具入门',
        duration: 2800,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: false
      }
    ]
  },
  {
    id: 3,
    title: 'JavaScript入门教程',
    description: '免费学习JavaScript基础，掌握前端开发必备技能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%20programming%20course%20cover%20code%20yellow%20logo%20tech%20education&image_size=landscape_4_3',
    teacherId: 3,
    teacherName: '王老师',
    teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20male%20teacher%20portrait%20friendly%20tech%20developer%20headshot&image_size=square',
    categoryId: 2,
    categoryName: '编程开发',
    price: 0,
    originalPrice: 0,
    isFree: true,
    hasTrial: false,
    trialChapters: [],
    studentCount: 89652,
    rating: 4.7,
    ratingCount: 5623,
    duration: 18000,
    chapterCount: 24,
    tags: ['免费'],
    difficulty: 'beginner',
    createdAt: '2024-02-10',
    intro: '这是一门完全免费的JavaScript入门课程，适合想要学习前端开发的零基础学员。课程内容通俗易懂，配合大量示例代码，帮助你快速上手。',
    chapters: [
      {
        id: 1,
        title: 'JavaScript简介',
        duration: 1200,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: true
      },
      {
        id: 2,
        title: '变量与数据类型',
        duration: 1800,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: false,
        isFree: true
      }
    ]
  },
  {
    id: 4,
    title: '机器学习实战',
    description: '从理论到实践，系统学习机器学习算法与应用。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20AI%20course%20cover%20neural%20network%20data%20visualization%20technology&image_size=landscape_4_3',
    teacherId: 1,
    teacherName: '张教授',
    teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20teacher%20portrait%20friendly%20smile%20tech%20industry%20headshot&image_size=square',
    categoryId: 3,
    categoryName: '人工智能',
    price: 199,
    originalPrice: 399,
    isFree: false,
    hasTrial: true,
    trialChapters: [1, 2],
    studentCount: 15874,
    rating: 4.9,
    ratingCount: 1856,
    duration: 43200,
    chapterCount: 56,
    columnId: 1,
    tags: ['热门', '推荐'],
    difficulty: 'advanced',
    createdAt: '2024-01-20',
    intro: '本课程深入讲解机器学习的核心算法，包括线性回归、逻辑回归、决策树、随机森林、SVM、神经网络等。通过丰富的实战项目，帮助学员掌握机器学习应用开发。',
    chapters: [
      {
        id: 1,
        title: '机器学习概述',
        duration: 2000,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: true,
        isFree: false
      }
    ]
  },
  {
    id: 5,
    title: '产品经理入门',
    description: '零基础学产品，掌握产品思维与实战技能。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20manager%20course%20cover%20product%20design%20wireframe%20business%20professional&image_size=landscape_4_3',
    teacherId: 4,
    teacherName: '陈产品',
    teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20product%20manager%20portrait%20business%20thinking%20headshot&image_size=square',
    categoryId: 5,
    categoryName: '产品运营',
    price: 89,
    originalPrice: 179,
    isFree: false,
    hasTrial: true,
    trialChapters: [1],
    studentCount: 28564,
    rating: 4.6,
    ratingCount: 1562,
    duration: 21600,
    chapterCount: 32,
    tags: ['推荐'],
    difficulty: 'beginner',
    createdAt: '2024-02-28',
    intro: '本课程专为想转行或入门产品经理的学员设计，从产品思维到需求分析，从原型设计到产品上线，全面掌握产品经理必备技能。',
    chapters: [
      {
        id: 1,
        title: '产品经理角色认知',
        duration: 1600,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isTrial: true,
        isFree: false
      }
    ]
  }
]

export const teachers = [
  {
    id: 1,
    name: '张教授',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20teacher%20portrait%20friendly%20smile%20tech%20industry%20headshot&image_size=square',
    title: '资深技术专家',
    introduction: '15年软件开发经验，前Google高级工程师，精通Python、Java等多种编程语言，热爱分享技术知识。',
    followerCount: 25896,
    courseCount: 12,
    totalStudentCount: 156842,
    rating: 4.9,
    tags: ['Python专家', 'AI领域'],
    isFollowed: false
  },
  {
    id: 2,
    name: '李设计师',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=female%20designer%20portrait%20creative%20professional%20artistic%20headshot&image_size=square',
    title: '高级UI设计师',
    introduction: '曾任职于腾讯、阿里等大厂，拥有丰富的移动端和Web端设计经验，擅长用户体验设计和视觉设计。',
    followerCount: 18654,
    courseCount: 8,
    totalStudentCount: 89652,
    rating: 4.8,
    tags: ['UI设计', '视觉设计'],
    isFollowed: false
  },
  {
    id: 3,
    name: '王老师',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20male%20teacher%20portrait%20friendly%20tech%20developer%20headshot&image_size=square',
    title: '前端开发专家',
    introduction: '10年前端开发经验，精通Vue、React、JavaScript等前端技术栈，授课风格幽默风趣，深受学员喜爱。',
    followerCount: 32564,
    courseCount: 15,
    totalStudentCount: 256894,
    rating: 4.7,
    tags: ['前端开发', 'Vue专家'],
    isFollowed: false
  },
  {
    id: 4,
    name: '陈产品',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20product%20manager%20portrait%20business%20thinking%20headshot&image_size=square',
    title: '产品总监',
    introduction: '前字节跳动产品总监，主导过多个百万级用户产品，拥有丰富的产品规划和团队管理经验。',
    followerCount: 19856,
    courseCount: 6,
    totalStudentCount: 78564,
    rating: 4.6,
    tags: ['产品经理', '产品规划'],
    isFollowed: false
  }
]

export const comments = [
  {
    id: 1,
    courseId: 1,
    userId: 1001,
    userName: '学习者小明',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20male%20student%20avatar%20friendly%20smile%20casual%20portrait&image_size=square',
    rating: 5,
    content: '课程非常详细，老师讲解通俗易懂，从基础到进阶层层递进，适合零基础学习。跟着老师的节奏走，进步很大！',
    likeCount: 128,
    isLiked: false,
    createdAt: '2024-04-15',
    images: []
  },
  {
    id: 2,
    courseId: 1,
    userId: 1002,
    userName: '码农小张',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=male%20programmer%20avatar%20glasses%20tech%20casual%20portrait&image_size=square',
    rating: 5,
    content: '老师讲得太好了！每个知识点都有实际案例，代码示例也很规范。已经学完了基础部分，准备继续学习进阶内容。强烈推荐！',
    likeCount: 86,
    isLiked: false,
    createdAt: '2024-04-10',
    images: []
  },
  {
    id: 3,
    courseId: 1,
    userId: 1003,
    userName: '新手小白',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=female%20student%20avatar%20friendly%20casual%20portrait&image_size=square',
    rating: 4,
    content: '作为一名纯新手，课程对我帮助很大。唯一的建议是希望能增加一些练习题和答疑环节。总体来说非常棒的课程！',
    likeCount: 45,
    isLiked: false,
    createdAt: '2024-04-05',
    images: []
  }
]

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

export const getTeacherById = (id) => {
  return teachers.find(t => t.id === id)
}

export const getCourseById = (id) => {
  return courses.find(c => c.id === id)
}

export const getCoursesByCategory = (categoryId) => {
  if (categoryId === 1) return courses
  return courses.filter(c => c.categoryId === categoryId)
}

export const getCommentsByCourseId = (courseId) => {
  return comments.filter(c => c.courseId === courseId)
}
