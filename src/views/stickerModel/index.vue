<template>
  <div class="model-page-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">机型：</span>
        <span>
          <el-select
            @change="dataFilterHandler"
            v-model="search.model"
            filterable
            clearable
            placeholder="请选择机型"
          >
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <div class="single-item">
        <el-button type="primary" @click="initListData">查询</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        height="530"
        :data="tableData"
        v-loading="pageLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="brandName" label="品牌" />
        <el-table-column prop="phoneName" label="机型" />
        <el-table-column prop="status" label="显示/隐藏">
          <template #default="scope">
            <el-switch
              :before-change="beforeChangeColumn"
              @change="statusChangeHandler(scope.row)"
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="500">
          <template #default="scope">
            <el-button
              type="primary"
              text
              @click="editHandler(scope.row, 'modelImage')"
            >
              机型底图
            </el-button>
            <el-button
              type="primary"
              text
              @click="editHandler(scope.row, 'caseImage')"
            >
              手机壳底图
            </el-button>
            <el-button type="primary" text @click="caseEditHandler(scope.row)">
              贴纸素材
            </el-button>
            <el-button type="primary" text @click="printSetHandler(scope.row)">
              打印尺寸设置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ModelDialog :dataset="modelDialogDatas" @close="dialogCloseHandler" />
    <CaseDialog :dataset="caseDialogDatas" @close="caseDialogCloseHandler" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getModelList, modelStatusChange } from "@/api/model.js";
import ModelDialog from "./components/modelDialog.vue";
import CaseDialog from "./components/caseDialog.vue";
import { ElMessage } from "element-plus";

const switchState = ref(false);
const beforeChangeColumn = () => {
  switchState.value = true;
  return switchState.value;
};
// 1无效，0有效
const statusChangeHandler = ({ status, itemId }) => {
  if (!switchState.value) return;
  modelStatusChange({
    status,
    itemId,
  }).then((res) => {
    if (res.code === 200) {
      ElMessage.success("修改成功！");
      initListData();
    }
  });
};

const tableData = ref([]);
const pageLoading = ref(false);
const modelOptions = ref([]);
const resourceList = ref([]);
const search = ref({
  model: "",
});
onMounted(() => {
  initListData();
});
const initListData = () => {
  pageLoading.value = true;
  getModelList({
    source: 2,
  })
    .then((res) => {
      const result = res.data;
      modelOptions.value = [
        ...new Set(result.map((item) => item.phoneName)),
      ].map((item) => {
        return { value: item, label: item };
      });
      resourceList.value = res.data;
      dataFilterHandler();
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const dataFilterHandler = () => {
  tableData.value = resourceList.value.filter((item) => {
    if (search.value.model) {
      return item.phoneName === search.value.model;
    } else {
      return true;
    }
  });
};

const caseDialogDatas = ref({
  show: false,
  title: "贴纸素材",
  phoneCode: "",
  type: 2,
});
const caseEditHandler = ({ phoneCode, phoneName }) => {
  caseDialogDatas.value.title = `贴纸素材 - ${phoneName}`;
  caseDialogDatas.value.phoneCode = phoneCode;
  caseDialogDatas.value.show = true;
};
const caseDialogCloseHandler = () => {
  caseDialogDatas.value.phoneCode = "";
  caseDialogDatas.value.show = false;
};

const modelDialogDatas = ref({
  show: false,
  title: "机型底图",
  phoneCode: "",
  type: "",
});

//   modelImage: "机型底图" - 1
//   caseImage: "手机壳底图" - 3
const editHandler = ({ phoneCode, phoneName }, type) => {
  const titleMap = {
    modelImage: "机型底图",
    caseImage: "手机壳底图",
  };
  const typeMap = {
    modelImage: 1,
    caseImage: 3,
  };
  modelDialogDatas.value.title = `${titleMap[type]} - ${phoneName}`;
  modelDialogDatas.value.type = typeMap[type];
  modelDialogDatas.value.phoneCode = phoneCode;
  modelDialogDatas.value.show = true;
};

const dialogCloseHandler = () => {
  modelDialogDatas.value.type = "";
  modelDialogDatas.value.phoneCode = "";
  modelDialogDatas.value.show = false;
};
</script>

<style lang="less" scoped>
.model-page-component {
  .search-line {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .item-label {
      font-size: 14px;
      color: #333;
    }
    .single-item + .single-item {
      margin-left: 20px;
    }
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>