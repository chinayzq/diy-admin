<template>
  <div class="page-config-list">
    <div class="filter-line">
      <el-button type="primary" @click="initDatas">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="页面名称" />
      <el-table-column prop="description" label="描述">
        <template #default="scope">
          <span>{{ scope.row.description || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="290">
        <template #default="scope">
          <el-button type="primary" text @click="editHandler(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <PageConfigDialog :dataset="dialogDatas" @close="closeHandler" />
</template>

<script setup>
import { ref } from "vue";
import { getArticleList } from "@/api/article";
import PageConfigDialog from "./components/pageConfigDialog.vue";

// about us，contact us，Returnd & Refunds，Terms & Conditions，Shipping & Delivery，Privacy Policy
const tableData = ref([]);
const tableLoading = ref(false);
const initDatas = () => {
  tableLoading.value = true;
  getArticleList()
    .then((res) => {
      tableData.value = res.data;
    })
    .finally(() => {
      tableLoading.value = false;
    });
};
initDatas();

const dialogDatas = ref({
  show: false,
  title: "",
  datas: {},
});
const editHandler = (row) => {
  dialogDatas.value.datas = row;
  dialogDatas.value.title = `页面编辑 - ${row.title}`;
  dialogDatas.value.show = true;
};

const closeHandler = () => {
  dialogDatas.value.datas = {};
  dialogDatas.value.show = false;
};
</script>

<style lang="less" scoped>
.page-config-list {
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
  .filter-line {
    margin-bottom: 15px;
  }
}
</style>