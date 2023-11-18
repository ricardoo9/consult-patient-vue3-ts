<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { uploadImg } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { ConsultIllness, Image } from '@/types/consult'
import { showConfirmDialog, showToast } from 'vant'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 选项数据
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 }
]
// 收集病情表单数据，绑定
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
// 图片信息
const fileList = ref<Image[]>([])
// 图片上传事件处理
const onAfterRead: UploaderAfterRead = (item) => {
  // 对item进行判断
  if (Array.isArray(item)) return
  //判断是否为undefined
  if (!item.file) return
  // 上传图片api，设置上传的状态显示
  item.status = 'uploading'
  item.message = '上传中'
  uploadImg(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = '上传成功'
      // item中存入url
      item.url = res.data.url
      // 图片添加到form中
      form.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
// 图片删除事件处理
const onDelete = (item: UploaderFileListItem) => {
  // 根据url过滤表单
  form.value.pictures?.filter((pic) => pic.url !== item.url)
}

// 下一步按钮禁用,计算属性
const disabled = computed(
  () =>
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
)
// 提示点击下一步校验，看那个值没输入
const store = useConsultStore()
const router = useRouter()
const next = () => {
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined)
    return showToast('请选择症状持续时间')
  if (form.value.consultFlag === undefined)
    return showToast('请选择是否已经就诊')
  //存储数据
  store.setIllness(form.value)
  // 跳转路由
  router.push('/user/patient?isChange=1')
}
// 返回的时候数据回填
onMounted(() => {
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      closeOnPopstate: false
    }).then(() => {
      // 确认回填数据,解构
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      // 图片回显
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <!-- 收集信息 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn
          v-model="form.illnessTime"
          :options="timeOptions"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn
          v-model="form.consultFlag"
          :options="flagOptions"
        ></cp-radio-btn>
        <!-- 上传图片组件 -->
        <div class="illness-img">
          <van-uploader
            v-model="fileList"
            upload-icon="photo-o"
            upload-text="上传图片"
            max-count="9"
            :max-size="5 * 1024 * 1024"
            :after-read="onAfterRead"
            @delete="onDelete"
          ></van-uploader>
          <p class="tip" v-if="!fileList.length">
            上传内容仅医生可见,最多9张图,最大5MB
          </p>
        </div>
      </div>
      <van-button @click="next" :class="{ disabled }" type="primary" block round
        >下一步</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}

.consult-illness-page {
  padding-top: 46px;
  .van-button {
    font-size: 16px;
    margin-bottom: 30px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
</style>
