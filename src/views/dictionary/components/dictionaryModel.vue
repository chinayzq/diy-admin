<template>
  <div class="dictionary-model-component">
    <el-dialog
      v-model="props.dialogVisible"
      :title="props?.dataset?.title"
      width="800"
      :before-close="handleClose"
    >
      <el-form label-position="top" label-width="120px" :model="formData">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="类别编码" prop="itemCode">
              <el-input v-model="formData.itemCode" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别名称" prop="itemName">
              <el-input v-model="formData.itemName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="itemDescription">
              <el-input
                :rows="2"
                type="textarea"
                v-model="formData.itemDescription"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="项列表"> </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="emit('close')">取消</el-button>
          <el-button type="primary" @click="submitHandler"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits();
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default() {
      return false;
    },
  },
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
const formData = ref({
  itemCode: "",
  itemName: "",
  itemDescription: "",
});
const submitHandler = () => {
  console.log(1);
};
</script>

<style lang="less" scoped>
.dictionary-model-component {
}
</style>