<template>
  <div class="coupon-dialog-component">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="800"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="120px"
        ref="couponFormIns"
        :rules="formRules"
        :model="formData"
      >
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="折扣比例（%）" prop="couponPercent">
              <el-input
                placeholder="请输入折扣比例"
                :disabled="props.dataset.datas.classId"
                v-model="formData.couponPercent"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠卷使用次数" prop="couponCount">
              <el-input
                placeholder="请输入优惠卷使用次数"
                v-model="formData.couponCount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠卷最小金额" prop="mixAmount">
              <el-input
                placeholder="请输入优惠卷最小金额"
                v-model="formData.mixAmount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠卷最大金额" prop="maxAmount">
              <el-input
                placeholder="请输入优惠卷最大金额"
                v-model="formData.maxAmount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="expiredDate">
              <el-date-picker
                style="width: 100%"
                v-model="formData.expiredDate"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择有效期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                placeholder="请输入描述"
                :rows="2"
                type="textarea"
                v-model="formData.description"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            @click="submitHandler"
            v-loading="submitLoading"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { updateCoupon } from "@/api/coupon";
import { ElMessage } from "element-plus";
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
    if (datas?.datas?.couponCode) {
      displayDatas(datas.datas);
    }
  },
  {
    deep: true,
  }
);
const displayDatas = (datas) => {
  console.log("datas", datas);
  formData.value.couponPercent = datas.couponPercent;
  formData.value.couponCount = datas.couponCount;
  formData.value.mixAmount = datas.mixAmount;
  formData.value.maxAmount = datas.maxAmount;
  formData.value.expiredDate = datas.expiredDate;
  formData.value.description = datas.description;
};

const formData = ref({
  couponPercent: null,
  couponCount: null,
  mixAmount: null,
  maxAmount: null,
  expiredDate: null,
  description: null,
});
const formRules = ref({
  couponPercent: [
    {
      required: true,
      message: "请输入折扣比例!",
      trigger: "blur",
    },
  ],
  couponCount: [
    {
      required: true,
      message: "请输入优惠券使用次数!",
      trigger: "blur",
    },
  ],
});
const couponFormIns = ref(null);
const submitHandler = () => {
  couponFormIns.value.validate((valid) => {
    if (valid) {
      editHandler();
    }
  });
};
const submitLoading = ref(false);
const emit = defineEmits();
const editHandler = () => {
  let params = formData.value;
  if (props?.dataset?.datas?.couponCode) {
    params.couponCode = props.dataset.datas.couponCode;
  }
  submitLoading.value = true;
  updateCoupon(params)
    .then((res) => {
      if (res.code === 200) {
        ElMessage({
          message: "保存成功!",
          type: "success",
        });
        emit("close", true);
      }
    })
    .finally(() => {
      submitLoading.value = false;
    });
};

const handleClose = () => {
  resetForm();
  emit("close");
};
const resetForm = () => {
  formData.value = {
    couponPercent: null,
    couponCount: null,
    mixAmount: null,
    maxAmount: null,
    expiredDate: null,
    description: null,
  };
};
</script>

<style lang="less" scoped>
.coupon-dialog-component {
}
</style>