<template>
  <div class="sticker-page-component">
    <div class="filter-line">
      <el-button type="primary" @click="addNewSticker">New Sticker</el-button>
      <el-button type="primary" @click="getTableDatas">Search</el-button>
    </div>
    <div class="table-container">
      <el-table
        height="530"
        :data="tableData"
        v-loading="pageLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="stickerName" label="Sticker Name" />
        <el-table-column prop="stickerUrl" label="Cover Photo">
          <template #default="scope">
            <img
              v-lazy="scope.row.stickerUrl"
              class="table-sticker-image"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="operation" label="Operation">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              Edit Sticker
            </el-button>
            <el-button type="danger" text @click="deleteHandler(scope.row)">
              Delete Sticker
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <StickerDialog :dataset="stickerDialogDatas" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { getStickerList, deletePhoneSticker } from "@/api/sticker";
import { onBeforeMount, ref } from "vue";
import StickerDialog from "./components/stickerDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";
const pageLoading = ref(false);
const tableData = ref([]);
const stickerDialogDatas = ref({
  show: false,
  title: "New Sticker",
  datas: {},
});
onBeforeMount(() => {
  getTableDatas();
});
const getTableDatas = () => {
  pageLoading.value = true;
  getStickerList()
    .then((res) => {
      tableData.value = res.data;
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const dialogCloseHandler = (freshFlag) => {
  if (freshFlag === true) getTableDatas();
  stickerDialogDatas.value.show = false;
  stickerDialogDatas.value.datas = {};
};
const addNewSticker = () => {
  stickerDialogDatas.value.title = "New Sticker";
  stickerDialogDatas.value.show = true;
};
const editHandler = (row) => {
  stickerDialogDatas.value.title = "Edit Sticker";
  stickerDialogDatas.value.datas = row;
  stickerDialogDatas.value.show = true;
};
const deleteHandler = ({ id }) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePhoneSticker({ id }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功！",
            type: "success",
          });
          getTableDatas();
        }
      });
    })
    .catch(() => {
      console.log("取消删除！");
    });
};
</script>

<style lang="less" scoped>
.sticker-page-component {
  .filter-line {
    margin-bottom: 20px;
  }
  .table-sticker-image {
    height: 50px;
    width: 50px;
  }
}
</style>