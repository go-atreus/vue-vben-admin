<script lang="ts" setup>
import { dataFormSchemas, searchFormSchemas, tableColumns } from './schemas';
import { defDepartmentService } from '#/rpc';
import PageModel from '#/components/page/page-model.vue';

defineOptions({
  name: 'DepartmentManagement',
});
</script>

<template>
  <PageModel
    title="部门"
    :formOptions="searchFormSchemas"
    :gridOptions="tableColumns"
    :dataFormSchemas="dataFormSchemas"
    :service="defDepartmentService"
  >
  </PageModel>
</template>
