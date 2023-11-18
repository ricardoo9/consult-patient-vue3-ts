// .ts文件
// 1.既包含类型信息又可执行代码。
// 2.可以被编译成js文件，然后执行代码。
// 3.编写程序代码的地方
// .d.ts文件
// 1.只包含类型信息的类型声明文件。
// 2.不会生成js文件，仅用于提供类型信息。
// 3.为js提供类型信息
// 总结：.ts（代码实现文件） .d.ts(类型声明文件)
//定义用户数据类型
export type User = {
  /** token令牌 */
  token: string
  /** 用户ID */
  id: string
  /** 用户名称 */
  account: string
  /** 手机号 */
  mobile: string
  /** 头像 */
  avatar: string
}
// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// 用户信息类型声明
type omitUser = Omit<User, 'token'>
// 使用交叉类型进行合并类型数据
export type userInfo = omitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}

// 家庭档案-患者信息
export type Patient = {
  /** 患者ID */
  id?: string
  /** 患者名称 */
  name: string
  /** 身份证号 */
  idCard: string
  /** 0不默认  1默认 */
  defaultFlag: 0 | 1
  /** 0 女  1 男 */
  gender: 0 | 1
  /** 性别文字 */
  genderValue?: string
  /** 年龄 */
  age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
