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
  async CreateMenu(request: CreateMenuRequest): Promise<Menu> {
    return await requestClient.post<Empty>('/menus', request);
  }

  async DeleteMenu(request: DeleteMenuRequest): Promise<Empty> {
    return await requestClient.delete<Empty>(`/menus/${request.id}`);
  }

  async GetMenu(request: GetMenuRequest): Promise<Menu> {
    return await requestClient.get<Menu>(`/menus/${request.id}`);
  }

  async ListMenu(request: PagingRequest): Promise<ListMenuResponse> {
    return await requestClient.get<ListMenuResponse>('/menus', {
      params: request,
    });
  }

  async UpdateMenu(request: UpdateMenuRequest): Promise<Menu> {
    const id = request.menu?.id;
    if (request.menu !== null) request.menu.id = undefined;
    return await requestClient.put<Empty>(`/menus/${id}`, request);
  }
}

export const defMenuService = new MenuServiceImpl();


