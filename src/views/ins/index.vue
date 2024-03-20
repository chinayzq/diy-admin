<template>
  <div class="tk-list">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">网红地址: </span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.address"
            placeholder="请输入网红地址"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <el-button type="primary">查询</el-button>
        <el-button type="primary" @click="newTaskDialog.show = true"
          >新增爬取</el-button
        >
      </div>
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
        <el-table-column prop="address" label="网红地址" />
        <el-table-column prop="createdDate" label="创建时间">
          <template #default="scope">
            <span>
              {{ dateFormat(scope.row.createdDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="抓取状态">
          <template #default="scope">
            <span>
              {{ statusMaps[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="detailOpenDialog(scope.row)">
              详情
            </el-button>
            <!-- <el-button type="danger" text @click="deleteHandler(scope.row)">
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :default-current-page="1"
        :current-page="pageVO.current"
        :page-size="search.pageSize"
        layout="prev, pager, next"
        :total="pageVO.total"
      >
      </el-pagination>
    </div>
    <!-- 新增爬取弹框 -->
    <el-dialog
      v-model="newTaskDialog.show"
      :title="newTaskDialog.title"
      width="800"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="120px"
        ref="newTaskIns"
        :rules="newTaskRules"
        :model="newTaskForm"
      >
        <el-form-item label="地址" prop="address">
          <el-input placeholder="请输入地址" v-model="newTaskForm.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            @click="newTaskSubmit"
            v-loading="submitLoading"
          >
            开始执行
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- TK 详情弹框 -->
    <INSDetailDialog :dataset="detailDialogDatas" @close="detailCloseHandler" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { dateFormat } from "@/utils";
import INSDetailDialog from "./components/INSDetailDialog.vue";

const detailDialogDatas = ref({
  show: false,
  title: "详情",
  id: null,
});
const detailOpenDialog = ({ id }) => {
  detailDialogDatas.value.id = id;
  detailDialogDatas.value.show = true;
};
const detailCloseHandler = () => {
  detailDialogDatas.value.show = false;
};

const newTaskDialog = ref({
  show: false,
  title: "新增爬取任务",
});
const newTaskForm = ref({
  address: null,
});
const handleClose = () => {
  newTaskForm.value.address = null;
  newTaskDialog.value.show = false;
};
const newTaskRules = ref({
  address: [
    {
      required: true,
      message: "请输入网红抓取地址!",
      trigger: "blur",
    },
  ],
});
const newTaskSubmit = () => {
  console.log("提交任务");
};

const statusMaps = ref({
  0: "待邀请",
  1: "已邀请",
  2: "合作中",
  3: "被拒绝",
});

const search = ref({
  address: null,
  offset: 1,
  pageSize: 10,
});
const pageVO = ref({
  current: 1,
  total: 0,
});
const pageLoading = ref(false);
const tableData = ref([
  {
    address: "test11111",
    createdDate: 1710902538979,
    status: 1,
  },
]);
const initListData = () => {
  // pageLoading.value = true;
  // getPartnerList(search.value)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       tableData.value = res.data.list;
  //       pageVO.value.total = res.data.totalCount;
  //     }
  //   })
  //   .finally(() => {
  //     pageLoading.value = false;
  //   });
};
initListData();
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  search.value.offset = page;
  // search.value.offset = (page - 1) * search.value.pageSize;
  initListData();
};
</script>

<style lang="less" scoped>
.tk-list {
  .search-line {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .item-label {
      font-size: 14px;
      color: #333;
    }
    .single-item {
      display: flex;
      align-items: center;
    }
    .single-item + .single-item {
      margin-left: 20px;
    }
  }
}
</style>