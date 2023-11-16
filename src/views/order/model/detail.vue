<template>
  <div class="order-detail-component">
    <div class="card-container">
      <div class="title-line">订单详情</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">订单ID：</span>
          <span class="value">#12345</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">创建日期：</span>
          <span class="value">2023-11-15 08:00:00</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">lebronJames@gmail.com</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">店小秘</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">Carrier：</span>
          <span class="value">Yanwen</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">Tracking number：</span>
          <span class="value">UJ026046588YP</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">商品列表</div>
      <div class="goods-item">商品详情1</div>
      <div class="goods-item">商品详情1</div>
    </div>
    <div class="card-container">
      <div class="title-line">用户设计</div>
      <div class="image-list">原图</div>
      <div class="image-list">打印图</div>
      <div class="image-list">贴纸列表</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const { typeCode } = route.query;
</script>

<style lang="less" scoped>
.order-detail-component {
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
    .goods-item {
      border-bottom: 1px solid rgb(235, 235, 235);
      margin-top: 20px;
    }
    .image-list {
      border-bottom: 1px solid rgb(235, 235, 235);
      margin-top: 20px;
    }
  }
  .card-container + .card-container {
    margin-top: 20px;
  }
}
</style>