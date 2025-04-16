<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Button } from 'ant-design-vue';
import { isPlainObject } from 'remeda';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { defMenuService } from '#/rpc';

import MenuForm from './form.vue';
import { tableColumns } from './schemas';

defineOptions({
  name: 'MenuManagement',
});

// ---------------- form -----------------

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: MenuForm,
});

// ------------- table --------------------

const gridOptions: VxeGridProps = {
  columns: [
    ...(tableColumns.columns as any),
    {
      title: $t('common.action'),
      fixed: 'right',
      field: 'action'
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
      total: 'total',
      list: 'menuList',
    },
    ajax: {
      query: async (_formValues) => {
        const res = await defMenuService
          .ListMenu({});
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
  <Page auto-content-height>
    <FormModal />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="openFormModal">
          {{ $t('sys.menu.addMenu') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
