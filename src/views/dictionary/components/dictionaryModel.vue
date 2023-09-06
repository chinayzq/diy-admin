<template>
  <div class="dictionary-model-component">
    <el-dialog
      v-model="props.dialogVisible"
      :title="props?.dataset?.title"
      width="800"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="120px"
        :rules="formRules"
        :model="formData"
      >
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
          <el-form-item label="项列表">
            <el-button
              style="margin-bottom: 10px"
              type="primary"
              @click="addNewItem"
              >新增一项</el-button
            >
            <el-table :data="formData.itemList" style="width: 100%">
              <el-table-column prop="itemCode" label="项编码">
                <template #default="scope">
                  <el-input v-model="scope.row.itemCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="itemName" label="项名称">
                <template #default="scope">
                  <el-input v-model="scope.row.itemName"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="extend1" label="扩展1">
                <template #default="scope">
                  <el-input v-model="scope.row.extend1"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="extend2" label="扩展2">
                <template #default="scope">
                  <el-input v-model="scope.row.extend2"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作">
                <template #default="scope">
                  <el-button
                    type="danger"
                    text
                    @click="rowClickHandler('delete', scope.row, scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
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
import { Delete, Check, Close, Edit } from "@element-plus/icons-vue";
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
  itemList: [],
});
const formRules = ref({
  itemCode: [{ required: true, message: "请输入类别编码", trigger: "blur" }],
  itemName: [{ required: true, message: "请输入类别名称", trigger: "blur" }],
});
const submitHandler = () => {
  console.log(1);
};
const addNewItem = () => {
  formData.value.itemList.push({
    itemCode: "",
    itemName: "",
    extend1: "",
    extend2: "",
  });
};
const rowClickHandler = (type, row, index) => {
  switch (type) {
    case "delete":
      formData.value.itemList.splice(index, 1);
      break;
  }
};
</script>

<style lang="less" scoped>
.dictionary-model-component {
}
</style>