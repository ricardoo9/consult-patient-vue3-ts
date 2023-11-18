import type {
  ConsultOrderPreData,
  ConsultOrderPreParams,
  DoctorPage,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  PartialConsult,
  TopDep
} from '@/types/consult'
import { request } from '@/utils/request'

// 问诊请求api
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('patient/home/knowledge', 'GET', params)
}
// 医生展示api
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'GET', params)
// 关注医生api
export const followOrUnfollow = (id: string, type: FollowType = 'doc') =>
  request('/like', 'POST', { id, type })

// 一级科室请求api
export const getAllDep = () => {
  return request<TopDep[]>('/dep/all')
}
// 定义图片上传函数
export const uploadImg = (file: File) => {
  // file对象添加到formData中上传
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

// 预支付信息的api
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)
// 生成订单，获取订单id
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)
// 获取问诊订单的url api
export const getConsultOrderPayUrl = (params: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)
