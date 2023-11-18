<script setup lang="ts">
import { useRouter } from 'vue-router'

// 定义标题可选项
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
// 定义触发事件
const emit = defineEmits<{ (e: 'click-right'): void }>()
const onClickRight = () => {
  emit('click-right')
}
const router = useRouter()
// 点击左侧箭头回退功能 根据history.state中的back是否有值来决定回退到哪里
const onClickLeft = () => {
  if (props.back) return props.back() //有执行函数属性则使用执行函数
  if (history.state?.back) {
    // 跳转回到原页面
    router.back()
  } else {
    // 回到默认页
    router.push('/')
  }
}
</script>
<template>
  <van-nav-bar
    fixed
    :title="title"
    left-arrow
    @click-left="onClickLeft"
    :right-text="rightText"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>
<style lang="scss" scoped>
// 深度覆盖
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
