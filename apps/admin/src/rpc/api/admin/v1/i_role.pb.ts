// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               unknown
// source: admin/v1/i_role.proto

/* eslint-disable */
import { type IDReq } from "../../core/core.pb";
import {
  type CreateRoleRequest,
  type DeleteRoleRequest,
  type ListRoleRequest,
  type ListRoleResponse,
  type Role,
  type UpdateRoleRequest,
} from "../../entpb/entpb.pb";
import { type Empty } from "../../google/protobuf/empty.pb";

export interface UpdateApiAuthorityReq {
  data: ApiAuthorityInfo[];
  roleId: number;
}

export interface UpdateMenuAuthorityReq {
  menuIds: number[];
  roleId: number;
}

export interface RoleMenuList {
  menuIds: number[];
}

export interface ApiAuthorityInfo {
  path: string;
  method: string;
}

export interface RoleApiList {
  data: ApiAuthorityInfo[];
}

/** 后台菜单服务 */
export interface RoleService {
  /** 查询菜单列表 */
  List(request: ListRoleRequest): Promise<ListRoleResponse>;
  Create(request: CreateRoleRequest): Promise<Role>;
  Update(request: UpdateRoleRequest): Promise<Role>;
  Delete(request: DeleteRoleRequest): Promise<Empty>;
  GetApiAuthority(request: IDReq): Promise<RoleApiList>;
  GetMenuAuthority(request: IDReq): Promise<RoleMenuList>;
  UpdateMenuAuthority(request: UpdateMenuAuthorityReq): Promise<Empty>;
  UpdateApiAuthority(request: UpdateApiAuthorityReq): Promise<Empty>;
}
