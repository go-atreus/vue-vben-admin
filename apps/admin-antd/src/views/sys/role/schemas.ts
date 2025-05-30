import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Switch } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { defRoleService } from '#/rpc';

export const tableColumns: VxeGridProps = {
  columns: [
    {
      type: 'checkbox',
      width: 60,
    },

    {
      title: $t('sys.role.roleName'),
      field: 'name',
    },
    {
      title: $t('sys.role.roleValue'),
      field: 'code',
    },
    {
      title: $t('common.status'),
      field: 'status',
      slots: {
        default: (e) =>
          h(Switch, {
            checked: e.row.status === 1,
            onClick: () => {
              const newStatus = e.row.status === 1 ? 2 : 1;
              e.row.status = newStatus
              defRoleService.UpdateRole(e.row).then(() => {
                e.row.status = newStatus;
              });
            },
          }),
      },
    },

    {
      title: $t('common.createTime'),
      field: 'createdAt',
      formatter: 'formatDateTime',
    },
  ],
};

export const searchFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'name',
      label: $t('sys.role.roleName'),
      component: 'Input',
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
      fieldName: 'name',
      label: $t('sys.role.roleName'),
      component: 'Input',
      rules: z.string().max(30),
    },
    {
      fieldName: 'code',
      label: $t('sys.role.roleValue'),
      component: 'Input',
      rules: z.string().max(20),
      help: $t('sys.role.roleValueHelpMessage'),
    },
    {
      fieldName: 'defaultRouter',
      label: $t('sys.role.defaultRouter'),
      component: 'Input',
      rules: z.string().max(80),
      help: $t('sys.role.defaultRouterHelpMessage'),
    },
    {
      fieldName: 'remark',
      label: $t('common.remark'),
      component: 'Input',
      rules: z.string().max(200),
    },
    {
      fieldName: 'sort',
      label: $t('sys.menu.order'),
      component: 'InputNumber',
      rules: z.number().max(10_000),
    },
    {
      fieldName: 'status',
      label: $t('common.status'),
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: $t('common.on'), value: 1 },
          { label: $t('common.off'), value: 2 },
        ],
      },
    },
  ],
};
