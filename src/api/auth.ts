import { ApiStatus } from '@/utils/http/status'
import { HttpError } from '@/utils/http/error'
import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/v2/login',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

/**
 * 注册接口
 * @param params 注册参数
 * @returns 响应
 */
export function fetchRegister(params: any) {
  console.log(params)
  let obj = {
    userName: params.username,
    password: params.password
  }
  console.log(obj)
  return request.post({
    url: '/v2/register',
    params
    // headers: {
    //   isToken: false
    // },
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export async function fetchGetUserInfo(): Promise<Api.Auth.UserInfo> {
  try {
    return await request.get<Api.Auth.UserInfo>({
      url: '/system/user/v2/info',
      method: 'get',
      timeout: 20000
    })
  } catch (error) {
    if (error instanceof HttpError && error.code === ApiStatus.unauthorized) {
      throw error
    }
    // todo:注意这里包含系统管理和文章管理的时候，权限role
    // 必须是：R_ADMIN 或 R_SUPER
    const mock: Api.Auth.UserInfo = {
      buttons: ['B_VIEW', 'B_EDIT', 'add', 'edit', 'delete'],
      roles: ['R_ADMIN'],
      userId: 1,
      userName: 'MockUser',
      email: 'mock@example.com'
    }
    return mock
  }
}

// TODO:对接：所有的API，默认增加V2开头：
// https://gitee.com/node-project-summary/nest-admin-ruoyi-new.git
/**
 * 获取验证码是否开启
 * @returns 验证码
 */
// 获取验证码
export function getRegisterFlag() {
  return request.get<Api.Auth.UserInfo>({
    url: 'v2/registerUser',
    // 自定义请求头
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
    // headers: {
    //   'X-Custom-Header': 'your-custom-value'
    // }
  })
}

/**
 * 获取验证码
 * @returns 验证码
 */
// 获取验证码
export function getCodeImg() {
  return request.get<Api.Auth.UserInfo>({
    url: '/captchaImage',
    // 自定义请求头
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
    // headers: {
    //   'X-Custom-Header': 'your-custom-value'
    // }
  })
}
