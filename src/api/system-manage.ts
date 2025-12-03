import { AppRouteRecord } from '@/types/router'
import request from '@/utils/http'

// 获取用户列表
function omitEmpty<T extends Record<string, any>>(obj: T | undefined): Partial<T> {
  const res: Record<string, any> = {}
  if (!obj) return res as Partial<T>
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    res[k] = v
  }
  return res as Partial<T>
}

export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  const normalized = omitEmpty(params)
  return request.get<Api.SystemManage.UserList>({
    url: '/system/user/v2/list',
    params: normalized
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role/list',
    params
  })
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus'
  })
}
