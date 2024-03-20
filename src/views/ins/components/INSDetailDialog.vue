<template>
  <div class="ins-detail-dialog">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="1200"
      :before-close="handleClose"
    >
      <div class="filter-line">
        <el-button type="primary" @click="initFocusDatas">查询</el-button>
        <el-button type="primary" @click="focusExportHandler">导出</el-button>
      </div>
      <div class="table-container">
        <el-table
          height="530"
          :data="focusDatas"
          v-loading="focusLoading"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="address" label="关注者地址" />
          <el-table-column prop="address" label="粉丝数" />
          <el-table-column prop="address" label="邮箱地址" />
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :default-current-page="1"
          :current-page="pageVO.current"
          :page-size="pageVO.pageSize"
          layout="prev, pager, next"
          :total="pageVO.total"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";

const focusDatas = ref([]);
const focusLoading = ref(false);
const pageVO = ref({
  current: 1,
  offset: 1,
  pageSize: 10,
  total: 0,
});
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  pageVO.value.offset = page;
  // search.value.offset = (page - 1) * search.value.pageSize;
  initFocusDatas();
};

const initFocusDatas = () => {
  // 获取关注列表
};
const focusExportHandler = () => {};

const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
watch(
  () => props.dataset,
  (datas) => {
    if (datas?.datas?.id) {
      initDatas(datas.datas.id);
    }
  },
  {
    deep: true,
  }
);

const initDatas = (id) => {
  console.log("通过Id获取网红的关注列表和粉丝列表");
};

const emit = defineEmits();
const handleClose = () => {
  emit("close");
};
</script>

<style lang="less" scoped>
.ins-detail-dialog {
  .filter-line {
    margin-bottom: 10px;
  }
}
</style>