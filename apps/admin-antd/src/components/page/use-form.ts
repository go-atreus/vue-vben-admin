import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenForm, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { message } from 'ant-design-vue';
import { defineComponent, h, onBeforeUnmount, ref } from 'vue';

interface UsePageFormOptions<T> {
  dataFormSchemas: VbenFormProps;
  service: {
    update: (params: any) => Promise<any>;
    create: (id: string) => Promise<any>;
  };
}

export function useForm<T>(options: UsePageFormOptions<T>) {
  const { dataFormSchemas, service } = options;

  const record = ref();
  const isUpdate = ref(false);
  const gridApi = ref();

  async function onSubmit(values: Record<string, any>) {
    const result = isUpdate.value
      ? await service.update(values as any)
      : await service.create(values as any);
    if (result.code === 0) {
      message.success(result.msg);
      gridApi.value.reload();
    }
  }

  const [Form, formApi] = useVbenForm({
    handleSubmit: onSubmit,
    schema: [...(dataFormSchemas.schema as any)],
    showDefaultActions: false,
    layout: 'vertical',
  });

  const [Modal, modalApi] = useVbenModal({
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
      gridApi.value = isOpen ? modalApi.getData()?.gridApi : null;
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

  const FormCom = defineComponent(
      (props: VxeGridProps, { attrs, slots }) => {
        onBeforeUnmount(() => {
          // api.unmount();
        });
        // api.setState({ ...props, ...attrs });
        return () => h(Modal, { ...props, ...attrs }, slots);
      },
      {
        inheritAttrs: false,
        name: 'InnerForm',
      },
    );

  return FormCom;

  return { Form, formApi, Modal, modalApi } as const;
}
