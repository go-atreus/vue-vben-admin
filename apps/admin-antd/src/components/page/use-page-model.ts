import { useVbenForm } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { Page, useVbenModal } from '@vben/common-ui';
import { defineComponent, h, onBeforeUnmount } from 'vue';

import InnerForm from './form.vue';

export function usePageModel2(dataFormSchemas) {
  const [Form, formApi] = useVbenForm({
    // handleSubmit: onSubmit,
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
    onOpenChange(isOpen: boolean) {},
  });

  const FormCom = defineComponent(
    (props: VxeGridProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        // api.unmount();
      });
      // api.setState({ ...props, ...attrs });
      return () => h(Modal, { ...props, ...attrs }, h(Form, {...props, ...attrs}, slots));
    },
    {
      inheritAttrs: false,
      name: 'InnerForm',
    },
  );
  const [FormModal, formModalApi] = useVbenModal({
    connectedComponent: InnerForm,
  });

  return { FormModal, formModalApi };
}
