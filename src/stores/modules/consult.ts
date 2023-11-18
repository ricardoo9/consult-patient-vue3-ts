import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 存放问诊信息的仓库
export const useConsultStore = defineStore(
  'cp-sonsult',
  () => {
    // 存储问诊信息
    const consult = ref<PartialConsult>({})
    // 设置问诊类型
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 问诊级别函数
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 二级科室选择函数
    const setDep = (depId: string) => (consult.value.depId = depId)
    // 记录病情函数
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 记录患者id
    const setPatient = (id: string) => {
      consult.value.patientId = id
    }
    // 获取优惠券id
    const setCoupon = (id: string) => {
      consult.value.couponId = id
    }
    // 定义清除数据方法
    const clear = () => {
      consult.value = {}
    }
    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  //   开启数据持久化
  { persist: true }
)
