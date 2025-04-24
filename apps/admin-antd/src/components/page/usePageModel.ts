import type { Ref } from 'vue';
import { h, ref } from 'vue';
import type { VbenFormProps } from '@vben/common-ui';
import {
  useVbenVxeGrid,
  type VxeGridListeners,
  type VxeGridProps,
} from '#/adapter/vxe-table';
import { TableAction, type ActionItem } from '#/components/table/table-action';
import { useVbenModal } from '@vben/common-ui';
import { useForm } from './use-form';
import innerForm from './form.vue';
import { $t } from '@vben/locales';
import { useVbenForm } from '#/adapter/form';
import { isPlainObject } from 'remeda';
import PageModel from './page-model.vue';

interface UsePageModelOptions<T> {
  formOptions: VbenFormProps;
  dataOptions: VbenFormProps;
  gridOptions: VxeGridProps<T>;
  gridEvents?: VxeGridListeners<T>;
  service: {
    list: (params: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
    update: (params: any) => Promise<any>;
    create: (id: any) => Promise<any>;
  };
  innerFormSchema?: any[];
}

export function usePageModel<T>(options: UsePageModelOptions<T>) {
  const { formOptions, dataOptions, gridOptions, gridEvents, service } =
    options;

  const [Form, formApi] = useVbenForm({
    // handleSubmit: onSubmit,
    schema: [...(dataOptions.schema as any)],
    showDefaultActions: false,
    layout: 'vertical',
  });

  console.log(Form, innerForm);

  const [FormModal, formModalApi] = useVbenModal({
    connectedComponent: innerForm,
  });

  const showDeleteButton = ref<boolean>(false);

  const gridEventsWithDefaults: VxeGridListeners<T> = {
    checkboxChange(e) {
      showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
    },
    checkboxAll(e) {
      showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
    },
    ...gridEvents,
  };

  const formOptionsWithDefaults: VbenFormProps = {
    collapsed: false,
    schema: [...(formOptions.schema as any)],
    showCollapseButton: true,
    submitOnEnter: false,
  };

  const gridOptionsWithDefaults: VxeGridProps<T> = {
    checkboxConfig: {
      highlight: true,
    },
    toolbarConfig: {
      slots: {
        buttons: 'toolbar-buttons',
      },
    },
    columns: [
      ...(gridOptions.columns || []),
      {
        title: 'Action',
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
          const res = await service.list({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return res;
        },
      },
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: formOptionsWithDefaults,
    gridOptions: gridOptionsWithDefaults,
    gridEvents: gridEventsWithDefaults,
  });

  function openFormModal(record: T | null) {
    if (isPlainObject(record)) {
      formModalApi.setData({
        record,
        schema: dataOptions.schema,
        isUpdate: true,
        gridApi,
      });
    } else {
      formModalApi.setData({
        record: null,
        schema: dataOptions.schema,
        isUpdate: false,
        gridApi,
      });
    }
    formModalApi.open();
  }

  async function batchDelete(ids: string[]) {
    const result = await service.delete({
      id: ids,
    });
    if (result) {
      await gridApi.reload();
      showDeleteButton.value = false;
    }
  }

  return {
    FormModal,
    Grid,
    gridApi,
    showDeleteButton,
    openFormModal,
    batchDelete,
  };
}
