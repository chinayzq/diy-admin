<template>
  <div class="print-dialog-component">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="800"
      :before-close="handleClose"
    >
      <div v-loading="listLoading">
        <el-row :gutter="40">
          <el-col class="single-item" :span="12">
            <span class="label"> 宽(px)： </span>
            <el-input v-model="width"></el-input>
          </el-col>
          <el-col class="single-item" :span="12">
            <span class="label"> 高(px)： </span>
            <el-input v-model="height"></el-input>
          </el-col>
        </el-row>
        <div class="button-container">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="saveHandler">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { createPhoneColor, getPhoneColor } from "@/api/model";
import { ElMessage } from "element-plus";
import config from "~/config";
import { buildImageUrl } from "@/utils/index.js";
const beseUploadUrl = config[import.meta.env.MODE].uploadUrl;
const emit = defineEmits();
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});

watch(
  props.dataset,
  (datas) => {
    initAndDisplayDatas(datas.datas);
  },
  { deep: true }
);
const listLoading = ref(false);
const initAndDisplayDatas = (datas) => {
  listLoading.value = true;
  const { phoneCode } = datas;
  getPhoneColor({ type: 4, phoneCode })
    .then((res) => {
      if (res.code === 200) {
        const { extend1, extend2 } = res.data[0].colorUrlList[0];
        width.value = extend1;
        height.value = extend2;
      } else {
        width.value = null;
        height.value = null;
      }
    })
    .finally(() => {
      listLoading.value = false;
    });
};
const handleClose = (flag) => {
  width.value = null;
  height.value = null;
  emit("close", flag);
};
const width = ref(null);
const height = ref(null);
const saveHandler = () => {
  if ((width.value && !height.value) || (!width.value && height.value)) {
    ElMessage.warning("请同事设置宽和高，否则打印图有可能出错");
    return;
  }
  const params = {
    type: 4,
    phoneCode: props.dataset.datas.phoneCode,
    colorUrlList: [
      {
        extend1: width.value,
        extend2: height.value,
      },
    ],
  };
  createPhoneColor(params).then((res) => {
    if (res.code === 200) {
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
      handleClose(true);
    }
  });
};
</script>

<style lang="less" scoped>
.print-dialog-component {
  .button-container {
    margin-top: 30px;
    text-align: right;
  }
  .single-item {
    display: flex;
    align-items: center;
    .label {
      display: inline-block;
      width: 120px;
    }
  }
}
</style>