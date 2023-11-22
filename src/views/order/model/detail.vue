<template>
  <div class="order-detail-component" v-loading="pageLoading">
    <div class="card-container">
      <div class="title-line">订单详情</div>
      <el-row :gutter="20">
        <el-col :span="12" class="single-item">
          <span class="label">订单ID：</span>
          <span class="value">{{ orderDetail.orderId }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">创建日期：</span>
          <span class="value">{{ dateFormat(orderDetail.createdDate) }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userDTO?.email }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">Tracking number：</span>
          <span class="value">{{ orderDetail.trackingNumber || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ orderDetail.payMethod || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">customer IP：</span>
          <span class="value">{{ orderDetail.customerIP || "-" }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="card-container">
      <div class="title-line">商品列表</div>
      <el-row class="goods-title">
        <el-col :span="18"> item </el-col>
        <el-col :span="2"> Cost </el-col>
        <el-col :span="2"> Qty </el-col>
        <el-col :span="2"> Total </el-col>
      </el-row>
      <el-row
        class="goods-item"
        v-for="(item, index) in productJson"
        :key="index"
      >
        <el-col :span="1">
          <img
            style="width: 100%"
            :src="buildImageUrl(item.templateUrl)"
            alt=""
          />
        </el-col>
        <el-col :span="17" class="product-detail-line">
          <div>
            <span class="label"> SKU： </span>
            <span class="value">
              {{ item.extendJson.extend3 }}
            </span>
          </div>
          <div>
            <span class="label"> description： </span>
            <span class="value">
              {{ item.description }}
            </span>
          </div>
          <div>
            <span class="label"> caseColor： </span>
            <span class="value">
              {{ item.extendJson.caseColor }}
            </span>
          </div>
        </el-col>
        <el-col :span="2"> ${{ item.extendJson.curPrice }} </el-col>
        <el-col :span="2"> x {{ item.productCount }} </el-col>
        <el-col :span="2">
          ${{ item.extendJson.curPrice * item.productCount }}
        </el-col>
        <el-col :span="24" class="customer-design">
          <el-collapse>
            <el-collapse-item title="Customer Design">
              <div class="single-design-container">
                <div class="single-one">
                  <div
                    class="link-span"
                    @click="downloadImage(item.templateUrl)"
                  >
                    效果图下载
                  </div>
                  <div>
                    <img
                      style="height: 100px"
                      :src="buildImageUrl(item.templateUrl)"
                      alt=""
                    />
                  </div>
                </div>
                <div class="single-one">
                  <div
                    class="link-span"
                    @click="downloadImage(item.extendJson.printUrl)"
                  >
                    打印图下载
                  </div>
                  <div>
                    <img
                      style="height: 100px"
                      :src="buildImageUrl(item.extendJson.printUrl)"
                      alt=""
                    />
                  </div>
                </div>
                <div class="list-one">
                  <div class="title">贴纸列表(点击图片可下载原图)</div>
                  <div class="sticker-list">
                    <img
                      @click="downloadImage(image)"
                      class="sticker-image"
                      v-for="(image, imageIndex) in item.productImageList"
                      :key="imageIndex"
                      style="height: 100px; width: 100px"
                      :src="buildImageUrl(image)"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrderDetail } from "@/api/order";
import { dateFormat, buildImageUrl } from "@/utils";

const route = useRoute();
const pageLoading = ref(false);
const orderDetail = ref({});
const initDatas = () => {
  const { orderId } = route.query;
  if (orderId) {
    pageLoading.value = true;
    getOrderDetail(orderId)
      .then((res) => {
        orderDetail.value = res.data;
      })
      .finally(() => {
        pageLoading.value = false;
      });
  }
};
const userDTO = computed(() => orderDetail.value?.userDTO);
const productJson = computed(() => orderDetail.value?.productJson);
initDatas();

const downloadImage = (imageUrl) => {
  const url = buildImageUrl(imageUrl);
  let image = new Image();
  image.src = url;
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL(`image/png`); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "pic"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
};
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
      margin-bottom: 15px;
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
    .goods-title {
      padding: 10px;
      background: #edebeb;
      font-size: 14px;
      font-weight: bold;
    }
    .goods-item {
      border-bottom: 1px solid #706f6f;
      margin-top: 20px;
      padding: 10px;
      .product-detail-line {
        padding-left: 20px;
        line-height: 30px;
        .label {
          font-weight: bold;
          color: #777;
        }
      }
      .customer-design {
        margin-top: 10px;
        :deep(.el-collapse-item__header) {
          font-weight: bold;
        }
        .single-design-container {
          .link-span {
            margin-bottom: 10px;
            color: #409eff;
            text-decoration: underline;
            cursor: pointer;
          }
          .single-one {
            margin-right: 20px;
            display: inline-block;
          }
          .list-one {
            margin-top: 15px;
            width: 100%;
            .sticker-list {
              margin-top: 10px;
              overflow: auto;
              padding-bottom: 10px;
              .sticker-image {
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .card-container + .card-container {
    margin-top: 20px;
  }
}
</style>