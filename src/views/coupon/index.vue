<template>
  <div class="coupon-list-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">优惠卷编码：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.couponCode"
            placeholder="请输入优惠卷编码"
          >
          </el-input>
        </span>
      </div>
      <div class="single-item">
        <span class="item-label">描述：</span>
        <span>
          <el-input
            style="width: 180px"
            clearable
            v-model="search.description"
            placeholder="请输入优惠描述"
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
    <CouponDialog :dataset="couponDialog" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { getCouponList, deleteCoupon } from "@/api/coupon";
import { onBeforeMount, ref } from "vue";
import { dateFormat } from "@/utils";
import { ElMessageBox, ElMessage } from "element-plus";
import CouponDialog from "./components/couponDialog.vue";

onBeforeMount(() => {
  initListData();
});

const search = ref({
  couponCode: null,
  description: null,
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
  getCouponList(search.value)
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
