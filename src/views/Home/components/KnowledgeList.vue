<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
const loading = ref(false)
const finished = ref(false)
// 定义类型
const props = defineProps<{
  type: KnowledgeType
}>()
const list = ref<KnowledgeList>([]) //结果列表
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  // 请求数据
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows) //存入数据
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
