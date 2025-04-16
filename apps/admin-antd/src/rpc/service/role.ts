import type { RoleApiList, RoleMenuList, RoleService, UpdateApiAuthorityReq, UpdateMenuAuthorityReq } from '#/rpc/api/admin/v1/i_role.pb';
import type { Empty } from '#/rpc/api/google/protobuf/empty.pb';
import type { PagingRequest } from '#/rpc/api/pagination/v1/pagination.pb';
import type {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetRoleRequest,
  ListRoleRequest,
  ListRoleResponse,
  Role,
  UpdateRoleRequest,
} from '#/rpc/api/entpb/entpb.pb';

import { requestClient } from '#/rpc/request';
import type { IDReq } from '../api/core/core.pb';

/** 角色管理服务 */
class RoleServiceImpl implements RoleService {
  async List(request: ListRoleRequest): Promise<ListRoleResponse> {
    return await requestClient.get<ListRoleResponse>('/roles', {
      params: request,
    });
  }
  async Update(request: UpdateRoleRequest): Promise<Role> {
    throw new Error('Method not implemented.');
  }
  async GetApiAuthority(request: IDReq): Promise<RoleApiList> {
    return await requestClient.post<RoleApiList>('/authority/api/role', request);
  }
  async GetMenuAuthority(request: IDReq): Promise<RoleMenuList> {
    return await requestClient.post<RoleMenuList>('/authority/menu/role', request);
  }
  async UpdateMenuAuthority(request: UpdateMenuAuthorityReq): Promise<Empty> {
    return await requestClient.post<Empty>('/authority/menu/create_or_update', request);
  }
  async UpdateApiAuthority(request: UpdateApiAuthorityReq): Promise<Empty> {
    return await requestClient.post<Empty>('/authority/api/create_or_update', request);
  }
  async Create(request: CreateRoleRequest): Promise<Role> {
    return await requestClient.post<Role>('/roles', request);
  }

  async Delete(request: DeleteRoleRequest): Promise<Empty> {
    return await requestClient.delete<Empty>(`/roles/${request.id}`);
  }

  async GetRole(request: GetRoleRequest): Promise<Role> {
    return await requestClient.get<Role>(`/roles/${request.id}`);
  }

  async ListRole(request: PagingRequest): Promise<ListRoleResponse> {
    return await requestClient.get<ListRoleResponse>('/roles', {
      params: request,
    });
  }

  async UpdateRole(request: UpdateRoleRequest): Promise<Empty> {
    const id = request.role?.id;
    if (request.role !== null) request.role.id = undefined;
    return await requestClient.put<Empty>(`/roles/${id}`, request);
  }
}

export const defRoleService = new RoleServiceImpl();
