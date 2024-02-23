<template>
  <div class="coupon-list-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">网红名称：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.name"
            placeholder="请输入网红名称"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <span class="item-label">网红链接：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.faceUrl"
            placeholder="请输入网红链接"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <span class="item-label">优惠券码：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.couponCode"
            placeholder="请输入优惠券码"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <el-button type="primary" @click="initListData">查询</el-button>
        <el-button type="primary" @click="newPartner">新增网红</el-button>
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
        <el-table-column prop="name" label="网红名称" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <span>
              {{ statusMaps[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="faceUrl" label="网红链接" />
        <el-table-column prop="fansCount" label="粉丝数" />
        <el-table-column prop="effect" label="视频效果" />
        <el-table-column prop="couponCode" label="优惠卷码" />
        <el-table-column prop="phone" label="联系方式" />
        <el-table-column prop="principal" label="负责人" />
        <el-table-column prop="fee" label="费用" />
        <el-table-column prop="operation" label="操作">
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
    <PartnerDialog :dataset="couponDialog" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { getPartnerList, deletePartner } from "@/api/partner";
import { onBeforeMount, ref } from "vue";
import { dateFormat } from "@/utils";
import { ElMessageBox, ElMessage } from "element-plus";
import PartnerDialog from "./components/partnerDialog.vue";

const statusMaps = ref({
  0: "待邀请",
  1: "已邀请",
  2: "合作中",
  3: "被拒绝",
});

onBeforeMount(() => {
  initListData();
});

const search = ref({
  name: null,
  couponCode: null,
  offset: 1,
  pageSize: 10,
});
const pageVO = ref({
  current: 1,
  total: 0,
});

const pageLoading = ref(false);
const tableData = ref([]);
const initListData = () => {
  pageLoading.value = true;
  getPartnerList(search.value)
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data.list;
        pageVO.value.total = res.data.totalCount;
      }
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  search.value.offset = page;
  // search.value.offset = (page - 1) * search.value.pageSize;
  initListData();
};

const couponDialog = ref({
  show: false,
  title: "新增网红",
  datas: {},
});
const newPartner = () => {
  couponDialog.value.show = true;
  couponDialog.value.title = "新增网红";
  couponDialog.value.datas = {};
};
const dialogCloseHandler = (flag) => {
  couponDialog.value.datas = {};
  couponDialog.value.show = false;
  if (flag) {
    initListData();
  }
};

const editHandler = (item) => {
  couponDialog.value.show = true;
  couponDialog.value.title = "编辑网红";
  couponDialog.value.datas = item;
};

const deleteHandler = (item) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePartner(item.id).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功！",
            type: "success",
          });
          initListData();
        }
      });
    })
    .catch(() => {
      console.log("取消删除！");
    });
};
</script>

<style lang="less" scoped>
.coupon-list-component {
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
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>
