<template>
  <div class="model-dialog-component">
    <el-dialog
      v-model="dataset.show"
      :title="dataset.title"
      width="800"
      :before-close="handleClose"
    >
      <el-upload
        :on-success="uploadSuccess"
        :file-list="fileList"
        :action="'/diyadmin/upload'"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-button type="primary" @click="saveHandler">保存</el-button>
    </el-dialog>
    <el-dialog v-model="previewDialog.show">
      <img w-full :src="previewDialog.url" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits();
defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
const previewDialog = ref({
  show: false,
  url: "",
});
const fileList = ref([]);
const handleClose = (flag) => {
  emit("close", flag);
};
const handleRemove = (uploadFile) => {
  // fileList.value = fileList.value.filter((item) => {
  //   item.url !== uploadFile.response.data;
  // });
};
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  console.log("uploadFiles", uploadFiles);
  fileList.value.push({
    name: uploadFile.name,
    url: response.data,
  });
};
const handlePictureCardPreview = (uploadFile) => {
  previewDialog.value.url = uploadFile;
  previewDialog.value.show = true;
};
const saveHandler = () => {
  console.log("fileList", fileList.value);
};
</script>

<style>
.model-dialog-component {
}
</style>