import type { OrganizationService } from "../api/admin/v1/i_organization.pb";
import type { CreateDepartmentRequest, Department, GetDepartmentRequest, UpdateDepartmentRequest, DeleteDepartmentRequest, ListDepartmentRequest, ListDepartmentResponse } from "../api/entpb/entpb.pb";
import type { Empty } from "../api/google/protobuf/empty.pb";
import { baseRequestClient, requestClient } from '#/rpc/request';

export class DepartmentServiceImpl implements OrganizationService {
  async Create(request: CreateDepartmentRequest): Promise<Department> {
    return await requestClient.post<Department>('/departments', {"department": request});
  }

  async Get(request: GetDepartmentRequest): Promise<Department> {
    return await requestClient.get<Department>(`/department/${request.id}`);
  }

  async Update(request: UpdateDepartmentRequest): Promise<Department> {
    const id = request.id;
    return await requestClient.put<Department>(`/department/${id}`, {"department": request});
  }

  async Delete(request: DeleteDepartmentRequest): Promise<Empty> {
    return await requestClient.delete<Empty>(`/department/${request.id}`);
  }

  async List(request: ListDepartmentRequest): Promise<ListDepartmentResponse> {
    return await requestClient.post<ListDepartmentResponse>('/department/list', request);
  }
}

export const defDepartmentService = new DepartmentServiceImpl();
