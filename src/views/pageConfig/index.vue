<template>
    <div class="page-config-list">
        <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="页面名称" />
        <el-table-column prop="description" label="描述">
          <template #default="scope">
            <span>{{ scope.row.description || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="290">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <PageConfigDialog :dataset="dialogDatas" @close="closeHandler" />
</template>

<script setup>
import { ref } from 'vue';
import { getArticleList } from '@/api/article'
import PageConfigDialog from './components/pageConfigDialog.vue';

// about us，contact us，Returnd & Refunds，Terms & Conditions，Shipping & Delivery，Privacy Policy
const tableData = ref([
    {
      id: 1,
      pageName: 'about us',   
      description: 'about us 页面'
    },
    {
      id: 2,
      pageName: 'contact us',   
      description: 'contact us 页面'
    },
    {
      id: 3,
      pageName: 'Returnd & Refunds',   
      description: 'Returnd & Refunds 页面'
    },
    {
      id: 4,
      pageName: 'Terms & Conditions',   
      description: 'Terms & Conditions 页面'
    },
    {
      id: 5,
      pageName: 'Shipping & Delivery',   
      description: 'Shipping & Delivery 页面'
    },
    {
      id: 6,
      pageName: 'Privacy Policy',   
      description: 'Privacy Policy 页面'
    },
])
const tableLoading = ref(false)
const initDatas = () => {
  tableLoading.value = true
  getArticleList().then(res => {
    tableData.value = res.data
  }).finally(() => {
    tableLoading.value = false
  })
}
initDatas()

const dialogDatas = ref({
  show: false,
  title: '',
  datas: {}
})
const editHandler = (row) => {
  dialogDatas.value.datas = row
  dialogDatas.value.title = `页面编辑 - ${row.title}`
  dialogDatas.value.show = true
}

const closeHandler = () => {
  dialogDatas.value.datas = {}
  dialogDatas.value.show = false
}
</script>

<style lang="less" scoped>
.page-config-list {
  :deep(.el-button.is-text) {
      padding: 0 !important;
      margin-right: 15px;
    }
}
</style>