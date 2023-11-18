// 1导入组件
import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
// 2. 声明 vue 类型模块
declare module 'vue' {
  // 3. 给 vue  添加全局组件类型，interface 和之前的合并
  interface GlobalComponents {
    // 4. 定义具体组件类型，typeof 获取到组件实例类型
    // typeof 作用是得到对应的TS类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}
