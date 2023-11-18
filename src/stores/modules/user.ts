// 定义user的仓库

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
// 用户信息维护
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1定义用户信息
    const user = ref<User>()
    // 2定义用户信息修改方法
    const setUser = (u: User) => {
      user.value = u
    }
    // 3用户信息删除方法
    const delUser = () => {
      user.value = undefined
    }
    return { user, setUser, delUser }
  },
  //开启本地数据持久化存储
  {
    persist: true
  }
)
