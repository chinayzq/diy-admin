<template>
  <div class="user-detail-component">
    <div class="card-container">
      <div class="title-line">账号信息</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">账号：</span>
          <span class="value">lebron.james</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">用户名称：</span>
          <span class="value">lebron james</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebron james</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">客户账单地址（Customer billing address）</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">First name：</span>
          <span class="value">lebron</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">Last name：</span>
          <span class="value">james</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">客户发货地址（Customer shipping address）</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">First name：</span>
          <span class="value">lebron</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">Last name：</span>
          <span class="value">james</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronjames@163.com</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const { typeCode } = route.query;
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