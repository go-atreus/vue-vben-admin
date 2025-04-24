import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Icon } from '@iconify/vue';
import { Tag } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { defMenuService } from '#/rpc';
import { ParentIdEnum } from '#/enums/common';

export const tableColumns: VxeGridProps = {
  columns: [
    {
      title: $t('sys.menu.menuName'),
      field: 'title',
      treeNode: true,
    },
    {
      title: $t('sys.menu.icon'),
      field: 'icon',
      slots: {
        default: (data) => {
          return h(Icon, {
            icon: data.row.icon,
            width: 20,
          });
        },
      },
      width: 50,
    },
    {
      title: $t('sys.apis.serviceName'),
      field: 'serviceName',
      width: 120,
    },
    {
      title: $t('sys.menu.routePath'),
      field: 'path',
    },
    {
      title: $t('sys.menu.order'),
      field: 'sort',
      width: 90,
    },
    {
      title: $t('common.status'),
      field: 'disabled',
      slots: {
        default: (record) => {
          let resultText = '';
          resultText = record.row.disabled ? $t('common.off') : $t('common.on');
          return h(
            Tag,
            {
              color: record.row.disabled ? 'red' : 'green',
            },
            () => resultText,
          );
        },
      },
      width: 80,
    },
    {
      title: $t('sys.menu.isHidden'),
      field: 'hideMenu',
      slots: {
        default: (record) => {
          let resultText = '';
          resultText = record.row.hideMenu ? $t('common.yes') : $t('common.no');
          return h(
            Tag,
            {
              color: record.row.disabled ? 'red' : 'green',
            },
            () => resultText,
          );
        },
      },
      width: 80,
    },
    {
      title: $t('common.createTime'),
      field: 'createdAt',
      formatter: 'formatDateTime',
    },
  ],
  proxyConfig: {
    response: {
      result: 'menuList',
      list: 'menuList',
    },
    ajax: {
      query: async (_formValues) => {
        const res = await defMenuService.List({});
        return res;
      },
    },
  },
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    transform: true,
    parentField: 'parentId',
    rowField: 'id',
  },
};

export const searchFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'name',
      label: $t('sys.department.name'),
      component: 'Input',
      rules: z.string().max(50).optional(),
    },
    {
      fieldName: 'leader',
      label: $t('sys.department.leader'),
      component: 'Input',
      rules: z.string().max(20).optional(),
    },
  ],
};

export const dataFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'menuType',
      label: $t('sys.menu.type'),
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: $t('sys.menu.directory'), value: 0 },
          { label: $t('sys.menu.menu'), value: 1 },
          { label: $t('sys.menu.element'), value: 2 },
        ],
      },
      formItemClass: 'col-span-2 items-baseline',
    },
    {
      fieldName: 'name',
      label: $t('sys.menu.menuName'),
      component: 'Input',
      rules: z.string().max(50),
      formItemClass: 'col-span-1',
      help: $t('sys.menu.menuNameHelp'),
    },
    {
      fieldName: 'title',
      label: $t('sys.menu.menuTitle'),
      component: 'Input',
      rules: z.string().max(50),
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'parentId',
      label: $t('sys.menu.menuParent'),
      component: 'ApiTreeSelect',
      componentProps: {
        api: defMenuService.ListMenu,
        resultField: 'menuList',
        labelField: 'title',
        valueField: 'id',
        defaultValue: {
          id: ParentIdEnum.DEFAULT,
          parentId: -1,
          label: $t('sys.menu.rootMenu'),
          value: ParentIdEnum.DEFAULT,
        },
      },
      defaultValue: ParentIdEnum.DEFAULT,
    },
    {
      fieldName: 'icon',
      label: $t('sys.menu.icon'),
      component: 'IconPicker', // todo: icon picker
    },
    {
      fieldName: 'serviceName',
      label: $t('sys.apis.serviceName'),
      component: 'Input',
      formItemClass: 'col-span-2 items-baseline',
      rules: z.string().max(50),
    },
    {
      fieldName: 'path',
      label: $t('sys.menu.routePath'),
      component: 'Input',
      help: $t('sys.menu.pathHelp'),
      formItemClass: 'col-span-2 items-baseline',
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      rules: z.string().regex(/^(\/?(:)?[\w-]+)*$/gm, $t('common.wrongFormat')),
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType !== 2;
        },
      },
    },
    {
      fieldName: 'component',
      label: $t('sys.menu.component'),
      component: 'Input',
      help: $t('sys.menu.componentHelp'),
      formItemClass: 'col-span-2 items-baseline',
      rules: z
        .string()
        .regex(/^(\/[\w-]+)*(LAYOUT|IFrame)?$/gm, $t('common.wrongFormat')),
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'redirect',
      label: $t('sys.menu.redirectPath'),
      component: 'Input',
      formItemClass: 'col-span-2 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'frameSrc',
      label: $t('sys.menu.frameSrc'),
      component: 'Input',
      formItemClass: 'col-span-2 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'realPath',
      label: $t('sys.menu.realPath'),
      component: 'Input',
      formItemClass: 'col-span-2 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'sort',
      label: $t('sys.menu.order'),
      component: 'InputNumber',
      rules: z.number().max(10_000),
      defaultValue: 1,
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'dynamicLevel',
      label: $t('sys.menu.dynamicLevel'),
      component: 'InputNumber',
      rules: z.number().max(30),
      defaultValue: 20,
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType !== 2;
        },
      },
    },
    {
      fieldName: 'permission',
      label: $t('sys.menu.permission'),
      component: 'Input',
      help: $t('sys.menu.permissionHelp'),
      formItemClass: 'col-span-2',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 2;
        },
      },
    },
    {
      fieldName: 'disabled',
      label: $t('common.status'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.on'), value: false },
          { label: $t('common.off'), value: true },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
    },
    {
      fieldName: 'ignoreKeepAlive',
      label: $t('sys.menu.isKeepAlive'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: false },
          { label: $t('common.no'), value: true },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'hideMenu',
      label: $t('sys.menu.isHidden'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType !== 2;
        },
      },
    },
    {
      fieldName: 'hideBreadcrumb',
      label: $t('sys.menu.isBreadcrumbShown'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: false },
          { label: $t('common.no'), value: true },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'hideTab',
      label: $t('sys.menu.hideTab'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'carryParam',
      label: $t('sys.menu.carryParam'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
    {
      fieldName: 'hideChildrenInMenu',
      label: $t('sys.menu.hideChildrenInMenu'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType !== 2;
        },
      },
    },
    {
      fieldName: 'affix',
      label: $t('sys.menu.affix'),
      component: 'RadioGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
      },
      formItemClass: 'col-span-1 items-baseline',
      dependencies: {
        triggerFields: ['menuType'],
        show(_values, formApi) {
          return formApi.values.menuType === 1;
        },
      },
    },
  ],
};
