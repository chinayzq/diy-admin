<template>
  <div class="tk-detail-dialog">
    <el-dialog
        v-model="props.dataset.show"
        width="1400"
        :before-close="handleClose"
    >
      <template #title>
        <div class="el-dialog__title" style="margin: 6px 0">
          {{ props.dataset.tag === 'fans' ? '粉丝数据' : '关注数据' }} - {{ props.dataset.url }}
        </div>
      </template>
      <el-divider style="margin-top: 0"/>
      <div class="filter-line">
        <el-input
            style="width: 200px"
            v-model="min"
            placeholder="最小粉丝数"
            type="number"
        ></el-input>
        <el-input
            style="width: 200px; margin: 0 10px"
            v-model="max"
            placeholder="最大粉丝数"
            type="number"
        ></el-input>
        <el-button type="primary" @click="fetchPage">查询</el-button>
        <el-button type="primary" @click="exportHandler">导出</el-button>
      </div>
      <div class="table-container">
        <el-table
            height="530"
            :data="list"
            v-loading="loading"
            border
            stripe
            style="width: 100%"
        >
          <el-table-column prop="id" width="50" label="id"/>
          <el-table-column prop="url" width="400" label="主页地址"/>
          <el-table-column prop="uniqueId" width="200" label="账号"/>
          <el-table-column prop="nickname" label="网名"/>
          <el-table-column prop="count" width="100" label="粉丝数"/>
          <el-table-column prop="followingCount" width="100" label="关注数"/>
          <el-table-column prop="diggCount" width="100" label="点赞数"/>
          <el-table-column prop="videoCount" width="100" label="视频数"/>
          <el-table-column prop="email" width="200" label="邮箱地址"/>
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
import {watch, ref} from "vue";
import {ElMessage} from "element-plus";
import {
  getFellowList,
  getFansList,
  focusListExport,
  fansListExport,
} from "@/api/dataFetch.js";
import qs from "qs";

const list = ref([]);
const loading = ref(false);
const min = ref(null)
const max = ref(null)
const pageVO = ref({
  current: 1,
  offset: 1,
  pageSize: 10,
  source: "tk",
  total: 0,
});
const handleCurrentChange = (page) => {
  pageVO.value.current = page;
  pageVO.value.offset = page;
  fetchPage()
};

async function fetchPage() {
  loading.value = true;
  const body = {
    countBegin: min.value,
    countEnd: max.value,
    ...pageVO.value, fetchId: props.dataset.fetchId
  }
  const {code, data} = props.dataset.tag === 'fans' ?
      await getFansList(body) :
      await getFellowList(body)
  console.log(data)
  if (code !== 200) {
    ElMessage.warning("数据获取失败，请稍后重试")
    return
  }
  list.value = data.list;
  pageVO.value.total=data.totalPages
  loading.value = false;
}

function exportHandler() {
  const body = {
    fetchId: props.dataset.fetchId,
    countBegin: min.value,
    countEnd: max.value,
  }
  if (props.dataset.tag === 'fans') fansListExport(body).then(down)
  else focusListExport(body).then(down)
}

function down(data) {
  const blob = new Blob([data], {type: "application/octet-stream;charset=utf-8"});
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = `tiktok_${new Date().getTime()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

const props = defineProps({
  dataset: {
    type: Object,
    default: () => ({})
  },
});

watch(() => props.dataset.show, (show) => !!show && fetchPage())

const emit = defineEmits();
const handleClose = () => {
  emit("close");
  pageVO.value.current = 1
  pageVO.value.offset = 1
  pageVO.value.pageSize = 10
  pageVO.value.source = "tk"
  pageVO.value.total = 0
  list.value.length = 0
};
</script>

<style lang="less" scoped>
.tk-detail-dialog {
  .filter-line {
    margin-bottom: 16px;
    display: flex;
    justify-content: right;
    align-items: center;
  }
}
</style>