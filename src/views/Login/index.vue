<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { loginByMobile, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
// 手机号和密码对象
const mobile = ref('')
const password = ref('')
// 勾选协议按钮
const agree = ref(false)
const store = useUserStore()
const route = useRoute() //路由信息对象
const router = useRouter() //路由实例
const show = ref(false) //密码图标显示以及关闭
const code = ref('')
// 表单校验勾选协议
const onsubmit = async () => {
  // 对协议进行判断
  if (!agree.value) return showToast('请勾选协议按钮')
  // 短信登录与密码登录合并（根据ispass的值判断是否为true）
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  // 存储数据
  store.setUser(res.data)
  showSuccessToast('登录成功')
  // 根据地址栏信息跳转
  router.replace((route.query.returnUrl as string) || '/user')
}
// 密码和短信登录切换
const isPass = ref(true)
// 发送验证码校验
const time = ref(0)
let timer: number
const form = ref<FormInstance>()
const onSend = async () => {
  if (time.value > 0) return
  // 对手机号单独校验
  await form.value?.validate('mobile')
  // 调用接口发送验证码
  await sendMobileCode(mobile.value, 'login')
  showToast('验证码已发送')
  // 倒计时60
  time.value = 60
  // 开启计时器
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (time.value <= 0) clearInterval(timer)
    time.value--
  }, 1000)
  // 卸载时清空计时器
  onUnmounted(() => {
    clearInterval(timer)
  })
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{
          isPass ? '短信验证码登录' : '密码登录'
        }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onsubmit" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-else
        :rules="codeRules"
        placeholder="短信验证码"
        v-model="code"
      >
        <template #button>
          <span
            @click="onSend"
            class="btn-send"
            :class="{ active: time > 0 }"
            >{{ time > 0 ? `${time}秒后再次发送验证码` : '发送验证码' }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
