<template>
  <div class="model-page-component">
    <div class="search-line">
      <div class="single-item">
        <span class="item-label">Phone Model：</span>
        <span>
          <el-select
            @change="dataFilterHandler"
            v-model="search.model"
            clearable
            placeholder="Choose a phone model"
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
        <el-button type="primary">Search</el-button>
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
        <el-table-column prop="brandName" label="Brand" />
        <el-table-column prop="phoneName" label="Model" />
        <el-table-column prop="operation" label="Operation">
          <template #default="scope">
            <el-button
              type="primary"
              text
              @click="editHandler(scope.row, 'phoneModel')"
            >
              Model color
            </el-button>
            <el-button
              type="primary"
              text
              @click="editHandler(scope.row, 'phoneCase')"
            >
              Case Color
            </el-button>
            <el-button
              type="primary"
              text
              @click="editHandler(scope.row, 'MaskImage')"
            >
              Mask Image
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ModelDialog :dataset="modelDialogDatas" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getModelList } from "@/api/model.js";
import ModelDialog from "./components/modelDialog.vue";
const tableData = ref([]);
const pageLoading = ref(false);
const modelOptions = ref([]);
const resourceList = ref([]);
const modelDialogDatas = ref({
  show: false,
  title: "Model color",
  phoneCode: "",
  type: "",
});
const search = ref({
  model: "",
});
onMounted(() => {
  initListData();
});
const initListData = () => {
  pageLoading.value = true;
  getModelList()
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
const editHandler = ({ phoneCode }, type) => {
  const titleMap = {
    phoneModel: "Model color",
    phoneCase: "Case Color",
    MaskImage: "Mask Image",
  };
  //   phoneModel: "机型颜色" - 1,
  //   phoneCase: "手机壳颜色" - 2,
  const typeMap = {
    phoneModel: 1,
    phoneCase: 2,
    MaskImage: 3,
  };
  modelDialogDatas.value.title = titleMap[type];
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