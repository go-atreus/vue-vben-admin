<script lang="ts" setup>
import type { MenuInfoPlain } from '#/api/sys/model/menuModel';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { defMenuService } from '#/rpc';

import { dataFormSchemas } from './schemas';

defineOptions({
  name: 'MenuForm',
});

const record = ref();
const isUpdate = ref(false);
const gridApi = ref();

async function onSubmit(values: Record<string, any>) {
  values.id = isUpdate.value ? values.id : 0;
  if (values.menuType === 2) {
    values.hideMenu = true;
  }

  const result = isUpdate.value
    ? await defMenuService.UpdateMenu({menu: values as MenuInfoPlain})
    : await defMenuService.CreateMenu({menu: values as MenuInfoPlain});
  if (result) {
    message.success('操作成功');
    gridApi.value.reload();
  }
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [...(dataFormSchemas.schema as any)],
  showDefaultActions: false,
  layout: 'vertical',
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-2',
});

const [Drawer, modalApi] = useVbenDrawer({
  // fullscreenButton: false,
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
    gridApi.value = isOpen ? modalApi.getData()?.gridApi : null;
    if (isOpen) {
      formApi.setValues(record.value);
    }
    modalApi.setState({
      title: isUpdate.value ? $t('sys.menu.editMenu') : $t('sys.menu.addMenu'),
    });
  },
});

defineExpose(modalApi);
</script>
<template>
  <Drawer class="w-1/2">
    <Form />
  </Drawer>
</template>
