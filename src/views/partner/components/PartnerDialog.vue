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
            <el-form-item label="网红名称" prop="name">
              <el-input placeholder="请输入网红名称" v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                style="width: 100%"
                v-model="formData.status"
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠卷码" prop="couponCode">
              <el-input
                placeholder="请输入优惠卷码"
                v-model="formData.couponCode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频效果" prop="effect">
              <el-input
                placeholder="请输入视频效果"
                v-model="formData.effect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网红主页地址" prop="faceUrl">
              <el-input
                placeholder="请输入网红主页地址"
                v-model="formData.faceUrl"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粉丝数" prop="fansCount">
              <el-input
                placeholder="请输入粉丝数"
                v-model="formData.fansCount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用" prop="fee">
              <el-input placeholder="请输入费用" v-model="formData.fee" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input placeholder="请输入联系方式" v-model="formData.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="principal">
              <el-input
                placeholder="请输入负责人"
                v-model="formData.principal"
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
const statusOptions = ref([
  {
    label: "待邀请",
    value: 0,
  },
  {
    label: "已邀请",
    value: 1,
  },
  {
    label: "合作中",
    value: 2,
  },
  {
    label: "被拒绝",
    value: 3,
  },
]);
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
  name: null,
  couponCode: null,
  effect: null,
  faceUrl: null,
  fansCount: null,
  fee: null,
  phone: null,
  principal: null,
  status: 0,
});
const formRules = ref({
  name: [
    {
      required: true,
      message: "请输入网红名称!",
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