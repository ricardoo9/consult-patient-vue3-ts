import type {
  CodeType,
  Patient,
  PatientList,
  User,
  userInfo
} from '@/types/user'
import { request } from '@/utils/request'

// 封装与user有关的获取数据方法
export const loginByPassword = (mobile: string, password: string) => {
  // 使用User类型的请求参数
  return request<User>('login/password', 'POST', { mobile, password })
}
// 验证码请求函数
export const sendMobileCode = (mobile: string, type: CodeType) => {
  request('code', 'GET', { mobile, type })
}
// 短信登录的api函数
export const loginByMobile = (mobile: string, code: string) => {
  return request<User>('login', 'POST', { mobile, code })
}
// 获取用户信息的api函数
export const getUserInfo = () => request<userInfo>('patient/myUser')
// 患者列表api函数
export const getPatientList = () => request<PatientList>('patient/mylist')
// 添加患者的api
export const addPatient = (patient: Patient) => {
  request('patient/add', 'POST', patient)
}
// 编辑患者信息api
export const editPatient = (patient: Patient) =>
  request('/patient/update', 'PUT', patient)
// 删除患者api
export const delPatient = (id: string) => request(`patient/del/${id}`, 'DELETE')
// 获取患者详情api
export const getPatientDetail = (id: string) =>
  request<Patient>(`/patient/info/${id}`)
