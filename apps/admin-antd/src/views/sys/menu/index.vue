<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { h } from 'vue';

import { Button } from 'ant-design-vue';
import { isPlainObject } from 'remeda';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { defMenuService } from '#/rpc';

import MenuForm from './form.vue';
import { type ActionItem, TableAction } from '#/components/table/table-action';
import { tableColumns, dataFormSchemas, searchFormSchemas } from './schemas';

import PageModal from '#/components/page/page-model.vue';

defineOptions({
  name: 'MenuManagement',
});

// ---------------- form -----------------

const [FormModal, formModalApi] = useVbenDrawer({
  connectedComponent: MenuForm,
});

// ------------- table --------------------

const gridOptions: VxeGridProps = {
  columns: [
    ...(tableColumns.columns as any),
    {
      title: $t('common.action'),
      fixed: 'right',
      field: 'action',
      slots: {
        default: ({ row }) =>
          h(TableAction, {
            actions: [
              {
                type: 'link',
                size: 'small',
                icon: 'clarity:note-edit-line',
                tooltip: $t('common.edit'),
                onClick: openFormModal.bind(null, row),
              },
              {
                icon: 'ant-design:delete-outlined',
                type: 'link',
                color: 'error',
                tooltip: $t('common.delete'),
                popConfirm: {
                  title: $t('common.deleteConfirm'),
                  placement: 'left',
                  confirm: batchDelete.bind(null, [row.id]),
                },
              },
            ] as ActionItem[],
          }),
      },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    response: {
      result: 'menuList',
      list: 'menuList',
    },
    ajax: {
      query: async (_formValues) => {
        const res = await defMenuService.ListMenu({});
        return res;
      },
    },
  },
  treeConfig: {
    transform: true,
    parentField: 'parentId',
    rowField: 'id',
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

function openFormModal(record: any) {
  if (isPlainObject(record)) {
    formModalApi.setData({
      record,
      isUpdate: true,
      gridApi,
    });
  } else {
    formModalApi.setData({
      record: null,
      isUpdate: false,
      gridApi,
    });
  }
  formModalApi.open();
}

async function batchDelete(ids: any) {
  const result = await defMenuService.deleteMenu({
    id: ids[0],
  });
  await gridApi.reload();
}
</script>

<template>
  <PageModal
    title="菜单"
    :formOptions="searchFormSchemas"
    :gridOptions="tableColumns"
    :dataFormSchemas="dataFormSchemas"
    :service="defMenuService"
  >
  </PageModal>
</template>
