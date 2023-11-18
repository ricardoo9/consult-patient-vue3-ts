import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 导入进度条样式等
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 进度条配置
NProgress.configure({
  showSpinner: false
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/patientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '病情支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      // 支付失败路由跳转
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})
// 路由前置守卫进行token鉴权
router.beforeEach((to) => {
  // 获取用户存储token数据
  const store = useUserStore()
  const whiteList = ['/login'] //白名单
  // 没有token并且不在白名单，跳转到登录页面
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
  NProgress.start() //开启进度条
})
// 路由后置守卫设置标题信息
router.afterEach((to) => {
  // 动态设置标题信息
  document.title = `${to.meta.title}-优医问诊`
  NProgress.done() //关闭进度条
})

export default router
