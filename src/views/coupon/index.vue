<template>
  <div class="coupon-list-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">优惠卷编码：</span>
        <span>
          <el-input
            clearable
            v-model="search.couponCode"
            placeholder="请输入优惠卷编码"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <el-button type="primary" @click="initListData">查询</el-button>
        <el-button type="primary" @click="newCoupon">新增优惠券</el-button>
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
        <el-table-column prop="couponCode" label="优惠券编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="couponPercent" label="折扣比例" width="100" />
        <el-table-column prop="couponCount" label="优惠次数" width="100" />
        <el-table-column prop="mixAmount" label="优惠卷最小金额" width="150" />
        <el-table-column prop="maxAmount" label="优惠卷最大金额" width="150" />
        <el-table-column prop="expiredDate" label="失效日期">
          <template #default="scope">
            <span>
              {{ dateFormat(scope.row.expiredDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="创建时间">
          <template #default="scope">
            <span>
              {{ dateFormat(scope.row.createdDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              编辑
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
    <CouponDialog :dataset="couponDialog" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { getCouponList } from "@/api/coupon";
import { onBeforeMount, ref } from "vue";
import { dateFormat } from "@/utils";
import CouponDialog from "./components/couponDialog.vue";

onBeforeMount(() => {
  initListData();
});

const search = ref({
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
  getCouponList(search.value)
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data;
        pageVO.total = res.total || 10;
      }
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  search.value.offset = page * search.value.pageSize + 1;
  initListData();
};

const couponDialog = ref({
  show: false,
  title: "新增优惠券",
  datas: {},
});
const newCoupon = () => {
  couponDialog.value.show = true;
  couponDialog.value.title = "新增优惠券";
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
  couponDialog.value.title = "编辑优惠券";
  couponDialog.value.datas = item;
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