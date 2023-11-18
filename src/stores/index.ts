// pinia数据统一管理
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' //导入数据持久化插件
const pinia = createPinia()
pinia.use(persist)
export * from './modules/user' //导出user里数据到pinia统一维护
export * from './modules/consult' //导出consult里数据到pinia统一维护

export default pinia
