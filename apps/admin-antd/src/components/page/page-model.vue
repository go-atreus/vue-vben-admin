<script lang="ts" setup>
import { useVbenForm, type VbenFormProps } from '#/adapter/form';
import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { $t } from '@vben/locales';
import { h, ref } from 'vue';
import { type ActionItem, TableAction } from '#/components/table/table-action';
import { Button, message, Modal, Space } from 'ant-design-vue';
import { isPlainObject } from 'remeda';
import { Page, useVbenModal } from '@vben/common-ui';

const props = withDefaults(
  defineProps<{
    // 标题
    title: number | string;
    formOptions: VbenFormProps;
    gridOptions: VxeGridProps<T>;
    dataFormSchemas: VbenFormProps<T>;
    service: {
      List: (params: any) => Promise<any>;
      Delete: (id: any) => Promise<any>;
      Update: (params: any) => Promise<any>;
      Create: (id: any) => Promise<any>;
    };
  }>(),
  {
    title: '',
  },
);

const showDeleteButton = ref<boolean>(false);

const gridEvents: VxeGridListeners<any> = {
  checkboxChange(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
  checkboxAll(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
};

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [...(props.formOptions.schema as any)],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

// ------------- table --------------------

const { columns, ...newGuidOptions } = props.gridOptions;

const gridOptions: VxeGridProps<T> = {
  checkboxConfig: {
    highlight: true,
  },
  toolbarConfig: {
    slots: {
      buttons: 'toolbar-buttons',
    },
  },
  columns: [
    ...(columns as any),
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
  pagerConfig: {},
  proxyConfig: {
    response: {
      result: 'departmentList',
    },
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await props.service.List({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return res;
      },
    },
  },
  ...newGuidOptions,
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

const record = ref();
const isUpdate = ref(false);
// const gridApi = ref();

async function onSubmit(values: Record<string, any>) {
  const result = isUpdate.value
    ? await props.service.Update(values as any)
    : await props.service.Create(values as any);
  if (result) {
    message.success('操作成功');
    gridApi.reload();
  }
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [...(props.dataFormSchemas.schema as any)],
  showDefaultActions: false,
  layout: 'vertical',
});

const [InnerModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    isUpdate.value = modalApi.getData()?.isUpdate;
    record.value = isOpen ? modalApi.getData()?.record || {} : {};
    // gridApi = isOpen ? modalApi.getData()?.gridApi : null;
    if (isOpen) {
      formApi.setValues(record.value);
    }
    modalApi.setState({
      title: isUpdate.value
        ? $t('sys.configuration.editConfiguration')
        : $t('sys.configuration.addConfiguration'),
    });
  },
});

function openFormModal(record: any) {
  if (isPlainObject(record)) {
    modalApi.setData({
      record,
      isUpdate: true,
      gridApi,
    });
  } else {
    modalApi.setData({
      record: null,
      isUpdate: false,
      gridApi,
    });
  }
  modalApi.open();
}

async function batchDelete(ids: string[]) {
  const result = await props.service.Delete({
    id: ids,
  });
  if (result) {
    await gridApi.reload();
    showDeleteButton.value = false;
  }
}

function handleBatchDelete() {
  Modal.confirm({
    title: $t('common.deleteConfirm'),
    async onOk() {
      const ids = gridApi.grid.getCheckboxRecords().map((item: any) => item.id);

      batchDelete(ids);
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <InnerModal>
      <Form />
    </InnerModal>
    <Grid>
      <template #toolbar-buttons>
        <Button
          v-show="showDeleteButton"
          danger
          type="primary"
          @click="handleBatchDelete"
        >
          {{ $t('common.delete') }}
        </Button>
      </template>

      <template #toolbar-tools>
        <Space>
          <Button type="primary" @click="openFormModal(null)">
            {{ '添加' + title }}
          </Button>
          <slot name="toolbar-tools" />
        </Space>
      </template>
    </Grid>
  </Page>
</template>
