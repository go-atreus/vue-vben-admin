import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { array2tree } from '@axolo/tree-array';
import { message } from 'ant-design-vue';

import { defRouterService } from '#/rpc';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';
import { ParentIdEnum } from '#/enums/common';
import { useAuthStore } from '#/store';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      const menuData = await defRouterService.ListRoute({});

      const authStore = useAuthStore();

      authStore.elementPermissionList = [];
      menuData.data.forEach((val, _idx, _arr) => {
        if (val.component === 'LAYOUT') {
          val.component = '';
        }

        if (val.name === 'Dashboard') {
          val.parentId = -1;
        }

        val.meta.hideInMenu = val.meta.hideMenu as any;
        val.meta.hideInTab = val.meta.hideTab as any;
        val.meta.hideInBreadcrumb = val.meta.hideBreadcrumb as any;
        val.meta.keepAlive = !val.meta.ignoreKeepAlive as boolean;
        val.meta.maxNumOfOpenTab = val.meta.dynamicLevel as any;
        val.meta.affixTab = val.meta.affix as boolean;

        if (val.permission && val.permission !== '') {
          authStore.elementPermissionList.push(val.permission);
        }
      });

      const treeData: RouteItem[] = array2tree(
        menuData.data.filter((val) => val.path !== ''),
      ) as RouteItem[];
      treeData.forEach((val, idx, arr) => {
        if (val.component === '' && arr[idx]) {
          arr[idx].component = 'BasicLayout';
        }
      });
      return treeData;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
