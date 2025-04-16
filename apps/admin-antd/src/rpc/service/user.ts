import type { UserService } from '#/rpc/api/admin/v1/i_user.pb';
import type { Empty } from '#/rpc/api/google/protobuf/empty.pb';
import type {
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  ListUserResponse,
  ListUserRequest,
  UpdateUserRequest,
  User,
} from '#/rpc/api/entpb/entpb.pb';

import { UserAuthority } from '#/rpc/api/user/v1/user.pb';
import { requestClient } from '#/rpc/request';

/** 用户管理服务 */
class UserServiceImpl implements UserService {
  async Create(request: CreateUserRequest): Promise<User> {
    return await requestClient.post<User>('/users', request);
  }

  async Delete(request: DeleteUserRequest): Promise<Empty> {
    return await requestClient.delete<Empty>(`/users/${request.id}`);
  }

  async Get(request: GetUserRequest): Promise<User> {
    return await requestClient.get<User>(`/users/${request.id}`);
  }

  async List(request: ListUserRequest): Promise<ListUserResponse> {
    return await requestClient.get<ListUserResponse>('/users', {
      params: request,
    });
  }

  async Update(request: UpdateUserRequest): Promise<User> {
    const id = request.user?.id;
    if (request.user !== null) request.user.id = undefined;
    return await requestClient.put<User>(`/users/${id}`, request);
  }
}

export const authorityList = [
  { value: UserAuthority.GUEST_USER, label: '游客' },
  { value: UserAuthority.CUSTOMER_USER, label: '普通用户' },
  { value: UserAuthority.SYS_MANAGER, label: '普通管理' },
  { value: UserAuthority.SYS_ADMIN, label: '超级管理' },
];

/**
 * 权限转名称
 * @param authority
 */
export function authorityToName(authority: any) {
  switch (authority) {
    case UserAuthority.CUSTOMER_USER: {
      return '普通用户';
    }
    case UserAuthority.GUEST_USER: {
      return '游客';
    }
    case UserAuthority.SYS_ADMIN: {
      return '超级管理';
    }
    case UserAuthority.SYS_MANAGER: {
      return '普通管理';
    }
    default: {
      return '';
    }
  }
}

/**
 * 权限转颜色值
 * @param authority
 */
export function authorityToColor(authority: any) {
  switch (authority) {
    case UserAuthority.CUSTOMER_USER: {
      return 'green';
    }
    case UserAuthority.GUEST_USER: {
      return 'green';
    }
    case UserAuthority.SYS_ADMIN: {
      return 'orange';
    }
    case UserAuthority.SYS_MANAGER: {
      return 'red';
    }
    default: {
      return 'black';
    }
  }
}

export const defUserService = new UserServiceImpl();
