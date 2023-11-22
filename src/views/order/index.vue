<template>
  <div class="order-list-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">订单ID：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.orderId"
            placeholder="订单ID"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <span class="item-label">优惠券：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.couponCode"
            placeholder="优惠券"
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
        <el-table-column prop="orderId" label="订单Id">
          <template #default="scope">
            <span class="link-span" @click="editHandler(scope.row)">
              {{ scope.row.orderId }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="日期">
          <template #default="scope">
            <span>
              {{ dateFormat(scope.row.createdDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <span>
              {{ statusMap[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="paidPrice" label="金额" />
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
import { onBeforeMount, ref } from "vue";
import { dateFormat } from "@/utils";
import { useRouter } from "vue-router";
import { getOrderList } from "@/api/order";

const statusMap = ref({
  0: "on hold",
  1: "processing",
  2: "completed",
  3: "refunded",
});

const search = ref({
  orderId: null,
  couponCode: null,
  offset: 0,
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
  getOrderList(search.value)
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data;
        pageVO.total = res.data.totalCount;
      }
    })
    .finally(() => {
      pageLoading.value = false;
    });
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
  .link-span {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>