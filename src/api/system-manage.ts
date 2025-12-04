import { ApiStatus } from '@/utils/http/status'
import { AppRouteRecord } from '@/types/router'
import { HttpError } from '@/utils/http/error'
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
  const normalized: Record<string, any> = { ...omitEmpty(params) }
  if (normalized.name && !normalized.userName) {
    const v = String(normalized.name).trim()
    if (v) normalized.userName = v
    delete normalized.name
  }
  return request
    .get<Api.SystemManage.UserList>({
      url: '/system/user/v2/list',
      params: normalized,
      showErrorMessage: false
    })
    .catch((error) => {
      if (error instanceof HttpError && error.code === ApiStatus.error) {
        return buildMockUserList(normalized)
      }
      throw error
    })
}

function buildMockUserList(params: Record<string, any>): Api.SystemManage.UserList {
  const current = Number(params.current) || 1
  const size = Number(params.size) || 20
  const total = 42
  const start = (current - 1) * size
  const count = Math.min(size, Math.max(0, total - start))
  const roles = ['R_USER']
  const records = Array.from({ length: count }).map((_, i) => {
    const id = start + i + 1
    return {
      id,
      avatar: '',
      status: ['1', '2', '3', '4'][id % 4],
      userName: `User${id}`,
      userGender: id % 2 === 0 ? '男' : '女',
      nickName: `昵称${id}`,
      userPhone: `1380000${String(1000 + id).slice(-4)}`,
      userEmail: `user${id}@example.com`,
      userRoles: roles,
      createBy: 'system',
      createTime: new Date().toISOString(),
      updateBy: 'system',
      updateTime: new Date().toISOString()
    }
  })
  return {
    records,
    current,
    size,
    total
  }
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  const normalized = omitEmpty(params)
  return request
    .get<Api.SystemManage.RoleList>({
      url: '/v2/role/list',
      params: normalized,
      showErrorMessage: false
    })
    .catch((error) => {
      if (error instanceof HttpError && error.code === ApiStatus.error) {
        return buildMockRoleList(normalized)
      }
      throw error
    })
}

function buildMockRoleList(params: Record<string, any>): Api.SystemManage.RoleList {
  const current = Number(params.current) || 1
  const size = Number(params.size) || 10
  const total = 8
  const start = (current - 1) * size
  const count = Math.min(size, Math.max(0, total - start))
  const base = [
    { roleId: 1, roleName: '超级管理员', roleCode: 'R_SUPER', description: '系统最高权限', enabled: true },
    { roleId: 2, roleName: '管理员', roleCode: 'R_ADMIN', description: '系统管理权限', enabled: true },
    { roleId: 3, roleName: '运营', roleCode: 'R_OPS', description: '运营权限', enabled: true },
    { roleId: 4, roleName: '市场', roleCode: 'R_MKT', description: '市场权限', enabled: true },
    { roleId: 5, roleName: '产品', roleCode: 'R_PM', description: '产品权限', enabled: true },
    { roleId: 6, roleName: '研发', roleCode: 'R_DEV', description: '研发权限', enabled: true },
    { roleId: 7, roleName: '测试', roleCode: 'R_QA', description: '测试权限', enabled: true },
    { roleId: 8, roleName: '普通用户', roleCode: 'R_USER', description: '基础权限', enabled: true }
  ]
  const slice = base.slice(start, start + count)
  const records = slice.map((item) => ({
    ...item,
    createTime: new Date().toISOString()
  }))
  return {
    records,
    current,
    size,
    total
  }
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus'
  })
}
