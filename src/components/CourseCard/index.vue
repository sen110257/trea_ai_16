<template>
  <div class="course-card card-hover" @click="handleClick">
    <div class="course-image-wrapper">
      <van-image :src="course.cover" class="course-image" fit="cover" />
      <div class="course-badges">
        <van-tag v-if="course.isFree" class="badge-free" size="mini">免费</van-tag>
        <van-tag v-else-if="course.hasTrial" class="badge-trial" size="mini">试看</van-tag>
        <van-tag v-for="tag in course.tags" :key="tag" class="badge-tag" size="mini" :type="tag === '热门' ? 'danger' : 'primary'">
          {{ tag }}
        </van-tag>
      </div>
      <div class="course-duration">
        <van-icon name="play-circle-o" />
        {{ formatDuration(course.duration) }}
      </div>
    </div>
    <div class="course-info">
      <h3 class="course-title text-ellipsis-2">{{ course.title }}</h3>
      <div class="course-meta">
        <div class="meta-left">
          <van-image :src="course.teacherAvatar" class="teacher-avatar" round />
          <span class="teacher-name">{{ course.teacherName }}</span>
        </div>
        <div class="meta-right">
          <van-rate v-model="ratingValue" readonly :size="12" />
          <span class="rating-text">{{ course.rating }}</span>
        </div>
      </div>
      <div class="course-footer">
        <div class="course-price">
          <span v-if="course.isFree" class="free-text">免费</span>
          <span v-else class="price">
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ course.price }}</span>
          </span>
          <span v-if="course.originalPrice > course.price" class="original-price">
            ¥{{ course.originalPrice }}
          </span>
        </div>
        <div class="course-stats">
          <span class="stat-item">{{ formatNumber(course.studentCount) }}人学习</span>
          <span class="stat-item">{{ course.chapterCount }}节课</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDuration, formatNumber } from '@/data/mockData'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const ratingValue = computed(() => Math.round(props.course.rating))

const handleClick = () => {
  router.push(`/course/${props.course.id}`)
}
</script>

<style lang="less" scoped>
.course-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  cursor: pointer;
}

.course-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
}

.course-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  .van-tag {
    border: none;
    font-size: 10px;
    padding: 2px 6px;
  }

  .badge-free {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  }

  .badge-trial {
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  }

  .badge-tag {
    background: var(--primary-gradient);
  }
}

.course-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.course-info {
  padding: 12px;
}

.course-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 10px;
}

.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .meta-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .teacher-avatar {
      width: 24px;
      height: 24px;
    }

    .teacher-name {
      font-size: 13px;
      color: var(--text-color-secondary);
    }
  }

  .meta-right {
    display: flex;
    align-items: center;
    gap: 4px;

    .rating-text {
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.course-price {
  .free-text {
    color: #52c41a;
    font-weight: 600;
    font-size: 16px;
  }

  .price {
    color: #ff6b6b;
    font-weight: 600;

    .price-symbol {
      font-size: 12px;
    }

    .price-value {
      font-size: 18px;
    }
  }

  .original-price {
    font-size: 12px;
    color: var(--text-color-tertiary);
    text-decoration: line-through;
    margin-left: 6px;
  }
}

.course-stats {
  display: flex;
  gap: 12px;

  .stat-item {
    font-size: 12px;
    color: var(--text-color-tertiary);
  }
}
</style>
