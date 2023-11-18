import { createApp } from 'vue'
// import {} from 'vant'
import pinia from './stores' //导入pinia统一管理
import 'vant/lib/index.css' //导入vant样式
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
