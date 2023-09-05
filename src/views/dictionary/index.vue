<template>
  <div class="dictionary-page">
    <div class="button-line">
      <el-button type="primary" @click="addHandler">添加分类</el-button>
      <el-button>刷新</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="itemCode" label="类别编码" />
        <el-table-column prop="itemName" label="类别名称" />
        <el-table-column prop="itemDescription" label="描述" />
        <el-table-column prop="operation" label="操作" width="190">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" text @click="deleteHandler(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.length"
        />
      </div>
    </div>
    <DictionaryModel
      :dialogVisible="dialogVisible"
      @close="dialogVisible = false"
      :dataset="dialogData"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import DictionaryModel from "./components/dictionaryModel.vue";
const tableData = ref([
  {
    itemCode: "BRAND",
    itemName: "品牌",
    itemDescription: "品牌描述",
  },
  {
    itemCode: "MODEL",
    itemName: "机型",
    itemDescription: "机型描述",
  },
  {
    itemCode: "COLOR",
    itemName: "颜色",
    itemDescription: "颜色描述",
  },
]);
const dialogVisible = ref(false);
const dialogData = ref({
  title: "新增分类",
});
const addHandler = () => {
  dialogData.value.title = "新增分类";
  dialogVisible.value = true;
};
const editHandler = (row) => {
  console.log(row);
  dialogData.value.title = "编辑分类";
  dialogVisible.value = true;
};
const deleteHandler = (row) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // do delete...
    })
    .catch(() => {
      console.log("取消删除！");
    });
};
</script>

<style lang="less" scoped>
.dictionary-page {
  .button-line {
    margin: 10px 0;
  }
  .table-container {
    margin-top: 30px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>