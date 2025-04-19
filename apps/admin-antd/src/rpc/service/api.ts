import type { SysApiService } from '../api/admin/v1/i_api.pb';
import type {
  CreateSysApiRequest,
  SysApi,
  GetSysApiRequest,
  UpdateSysApiRequest,
  DeleteSysApiRequest,
  ListSysApiRequest,
  ListSysApiResponse,
} from '../api/entpb/entpb.pb';
import type { Empty } from '../api/google/protobuf/empty.pb';
import { baseRequestClient, requestClient } from '#/rpc/request';

export class ApiServiceImpl implements SysApiService {
  CountDeviceNum() {
    return new Promise((resolve) =>
      resolve({
        success: true,
        data: {
          alarmNum: 100,
          offlineNum: 100,
          onlineNum: 100,
          totalNum: 100,
        },
      }),
    );
  }
  Create(request: CreateSysApiRequest): Promise<SysApi> {
    throw new Error('Method not implemented.');
  }
  Get(request: GetSysApiRequest): Promise<SysApi> {
    throw new Error('Method not implemented.');
  }
  Update(request: UpdateSysApiRequest): Promise<SysApi> {
    throw new Error('Method not implemented.');
  }
  Delete(request: DeleteSysApiRequest): Promise<Empty> {
    throw new Error('Method not implemented.');
  }
  async List(request: ListSysApiRequest): Promise<ListSysApiResponse> {
    return await requestClient.post<ListSysApiResponse>('/apis', request);
  }
}

export const defApiService = new ApiServiceImpl();
