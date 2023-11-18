<script setup lang="ts">
import {
  createConsultOrder,
  getConsultOrderPayUrl,
  getConsultOrderPre
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import type { Patient } from '@/types/user'
import {
  showConfirmDialog,
  showDialog,
  showLoadingToast,
  showToast
} from 'vant'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'

// 获取预支付信息，
const payInfo = ref<ConsultOrderPreData>()
const store = useConsultStore()
const loadData = async () => {
  // 获取支付信息
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  //   获取优惠券id
  store.setCoupon(payInfo.value.couponId)
}
// 获取患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  // 类型守卫
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}
type Key = keyof PartialConsult
// 钩子函数中调用
onMounted(() => {
  // 刷新页面数据丢失提示
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  // 判断是否包含所有必要字段
  const valid = validKeys.every((key) => store.consult[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  loadData()
  loadPatient()
})
// 同意按钮
const agree = ref(false)
const show = ref(false)
// 提交勾选协议按钮
const loading = ref(false)
const orderID = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请勾选协议')
  //   开启加载进度条
  loading.value = true
  //   获取订单信息
  const res = await createConsultOrder(store.consult)
  //   关闭加载进度条
  loading.value = false
  orderID.value = res.data.id
  //   清除数据
  store.clear()
  show.value = true
}
// 支付方式
const payMethod = ref<0 | 1>()
const router = useRouter()
// 阻止返回上一页
onBeforeRouteLeave(() => {
  if (orderID.value) return false
})
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      // 跳转路由
      orderID.value = ''
      router.push('/user/consult')
      return true
    })
}
// 支付跳转页面
const pay = async () => {
  // 确认选择支付方式
  if (payMethod.value === undefined) return showToast('请选择一种支付方式')
  // 等待显示加载跳转
  showLoadingToast({ message: '跳转支付', duration: 0 })
  const res = await getConsultOrderPayUrl({
    orderId: orderID.value,
    paymentMethod: payMethod.value,
    payCallback: 'http://localhost:5173/room'
  })
  // 跳转
  window.location.href = res.data.payUrl
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" label="头痛，头晕，恶心"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="onClose"
    >
      <div class="pay-type">
        <p class="amount">￥20.00</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="payMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="payMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="payMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="payMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" @click="pay" round block
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
  <!-- 骨架屏效果 -->
  <div class="consult-pay-page" v-else>
    <cp-na-bar title="支付"></cp-na-bar>
    <!-- 骨架屏 -->
    <van-skeleton title :row="15" style="margin-top: 18px"></van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
