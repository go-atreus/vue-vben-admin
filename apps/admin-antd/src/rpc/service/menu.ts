import type { MenuService } from '#/rpc/api/admin/v1/i_menu.pb';
import type { Empty } from '#/rpc/api/google/protobuf/empty.pb';
import type { PagingRequest } from '#/rpc/api/pagination/v1/pagination.pb';
import type {
  CreateMenuRequest,
  DeleteMenuRequest,
  GetMenuRequest,
  ListMenuResponse,
  Menu,
  UpdateMenuRequest,
} from '#/rpc/api/entpb/entpb.pb';

import { requestClient } from '#/rpc/request';

/** 后台菜单管理服务 */
class MenuServiceImpl implements MenuService {
  async Create(request: CreateMenuRequest): Promise<Menu> {
    return await requestClient.post<Empty>('/menus', request);
  }

  async Delete(request: DeleteMenuRequest): Promise<Empty> {
    return await requestClient.delete<Empty>(`/menus/${request.id}`);
  }

  async Get(request: GetMenuRequest): Promise<Menu> {
    return await requestClient.get<Menu>(`/menus/${request.id}`);
  }

  async List(request: PagingRequest): Promise<ListMenuResponse> {
    return await requestClient.get<ListMenuResponse>('/menus', {
      params: request,
    });
  }

  async Update(request: UpdateMenuRequest): Promise<Menu> {
    const id = request.id;
    return await requestClient.put<Empty>(`/menus/${id}`, {menu: request});
  }
}

export const defMenuService = new MenuServiceImpl();


