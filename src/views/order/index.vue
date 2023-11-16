<template>
  <div class="order-list-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">订单ID：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.key"
            placeholder="订单ID/用户名"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <el-button type="primary" @click="initListData">查询</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        max-height="530"
        :data="tableData"
        v-loading="pageLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="orderId" label="订单Id" />
        <el-table-column prop="createdDate" label="日期">
          <template #default="scope">
            <span>
              {{ dateFormat(scope.row.createdDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="total" label="金额" />
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              详情
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
  </div>
</template>

<script setup>
import { getCouponList, deleteCoupon } from "@/api/coupon";
import { onBeforeMount, ref } from "vue";
import { dateFormat } from "@/utils";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const search = ref({
  key: null,
  offset: 0,
  pageSize: 10,
});
const pageVO = ref({
  current: 1,
  total: 0,
});

const pageLoading = ref(false);
const tableData = ref([
  {
    orderId: "#12345",
    createdDate: new Date().getTime(),
    status: "processing",
    total: "$18.88",
  },
]);
const initListData = () => {
  pageLoading.value = true;
  setTimeout(() => {
    pageLoading.value = false;
  }, 1000);
};
initListData();
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  search.value.offset = page * search.value.pageSize + 1;
  initListData();
};

const router = useRouter();
const editHandler = (item) => {
  router.push({
    path: "/order/detail",
    query: {
      orderId: item.orderId,
    },
  });
};

const deleteHandler = (item) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteCoupon({ couponId: item.couponCode }).then((res) => {
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
.order-list-component {
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