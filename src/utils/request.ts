import axios, { AxiosError, type Method } from 'axios'
import { showToast } from 'vant' //提示
import router from '@/router'
import { useUserStore } from '@/stores'
const instance = axios.create({
  //  1. 基础地址，超时时间
  baseURL: 'https://consult-api.itheima.net/',
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    //  2. 携带token,token在user数据中
    const store = useUserStore()
    //如果token存在，并且headers存在则给请求头添加token
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    //  3. 处理业务失败
    // 判断code是否是10000，不是的话返回promise对象，显示提示
    if (res.data?.code !== 10000) {
      showToast(res.data?.message || '业务失败')
      return Promise.reject(res.data)
    }
    //  4. 摘取核心响应数据
    return res.data
  },
  (err: AxiosError) => {
    //  5. 处理401错误
    if (err.response?.status === 401) {
      // 清除用户数据
      const store = useUserStore()
      store.delUser()
      //   跳转页面
      router.push({
        path: '/login',
        query: {
          // 当前路径的全路径
          returnUrl: router.currentRoute.value.fullPath
        }
      })
    }
    return Promise.reject(err)
  }
)
export default instance

// 添加响应数据泛型
type Data<T> = {
  code: number
  message: string
  data: T
}
// 导出请求方法，并对类型添加约束
export const request = <T>(
  url: string,
  method: Method = 'GET',
  submitData?: Object
) => {
  // 传参到instance 并返回
  return instance.request<any, Data<T>>({
    url,
    method,
    // 判断请求类型
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
