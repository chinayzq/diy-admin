<template>
  <div class="user-detail-component" v-loading="dialogLoading">
    <div class="card-container">
      <div class="title-line">账号信息</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">账号：</span>
          <span class="value">{{
            userDetail.userName ||
            `${userDetail.firstName}.${userDetail.lastName}`
          }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userDetail.email }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">客户账单地址（Customer billing address）</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">姓(First name)：</span>
          <span class="value">{{ billingJson.firstName }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">名(Last name)：</span>
          <span class="value">{{ billingJson.lastName }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱(email)：</span>
          <span class="value">{{ billingJson.email }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">电话(phone)：</span>
          <span class="value">{{ billingJson.phone }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">国家(country)：</span>
          <span class="value">{{ billingJson.country }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">省/州(state)：</span>
          <span class="value">{{
            billingJson.state || billingJson.stateCountry
          }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">城市(city)：</span>
          <span class="value">{{ billingJson.city }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">街道(streetAddress)：</span>
          <span class="value">{{ billingJson.streetAddress }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">房间号(apartment)：</span>
          <span class="value">{{ billingJson.apartment }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">客户发货地址（Customer shipping address）</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">姓(First name)：</span>
          <span class="value">{{ shipAddressJson.firstName || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">名(Last name)：</span>
          <span class="value">{{ shipAddressJson.lastName || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱(email)：</span>
          <span class="value">{{ shipAddressJson.email || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">电话(phone)：</span>
          <span class="value">{{ shipAddressJson.phone || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">国家(country)：</span>
          <span class="value">{{ shipAddressJson.country || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">省/州(state)：</span>
          <span class="value">{{
            shipAddressJson.state || shipAddressJson.stateCountry || "-"
          }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">城市(city)：</span>
          <span class="value">{{ shipAddressJson.city || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">街道(streetAddress)：</span>
          <span class="value">{{ shipAddressJson.streetAddress || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">房间号(apartment)：</span>
          <span class="value">{{ shipAddressJson.apartment || "-" }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserDetail } from "@/api/user";

const route = useRoute();
const dialogLoading = ref(false);
const userDetail = ref({});
const initDatas = () => {
  const { userId } = route.query;
  if (userId) {
    dialogLoading.value = true;
    getUserDetail(userId)
      .then((res) => {
        userDetail.value = res.data;
      })
      .finally(() => {
        dialogLoading.value = false;
      });
  }
};
const billingJson = computed(() => userDetail.value?.billingJson);
const shipAddressJson = computed(() => userDetail.value?.shipAddressJson);
initDatas();
</script>

<style lang="less" scoped>
.user-detail-component {
  .card-container {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 15px;
    .title-line {
      font-size: 16px;
      font-weight: bold;
    }
    .single-item {
      margin-top: 15px;
      .label {
        font-size: 14px;
        color: #666;
      }
      .value {
        font-size: 14px;
        color: #000;
      }
    }
  }
  .card-container + .card-container {
    margin-top: 20px;
  }
}
</style>