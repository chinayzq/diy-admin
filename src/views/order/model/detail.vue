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
          <div>
            <span class="label">Tracking number：</span>
            <span class="value">{{ orderDetail.trackingNumber || "-" }}</span>
          </div>
          <div class="tracking-update">
            更新物流：
            <el-input
              v-model="trackingNumber"
              size="mini"
              style="width: 200px"
            ></el-input>
            <el-button
              @click="updateTrackingInfo"
              type="primary"
              size="mini"
              class="save-button"
              >保存</el-button
            >
          </div>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">支付方式：</span>
          <span class="value">{{
            paymentMethodsOptions[orderDetail.paymentMethod] || "-"
          }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">customer IP：</span>
          <span class="value">{{ orderDetail.clientIp || "-" }}</span>
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">状态：</span>
          <span
            class="value"
            :style="{
              color: orderDetail.status === 3 ? '#ff0000' : '',
            }"
            >{{ statusMap[orderDetail.status] || "-" }}</span
          >
        </el-col>
        <el-col :span="12" class="single-item">
          <el-button
            type="primary"
            v-if="orderDetail.status !== 3"
            @click="refundHandler"
            >Refund</el-button
          >
        </el-col>
        <el-col :span="12" class="single-item">
          <span class="label">地址：</span>
          <span>{{
            `${billingArray.country} ${billingArray.state} ${billingArray.city} ${billingArray.streetAddress} ${billingArray.apartment}`
          }}</span>
        </el-col>
      </el-row>
      <el-collapse style="margin-top: 15px">
        <el-collapse-item title="Billing Address">
          <el-row>
            <el-col
              :span="8"
              class="single-item"
              v-for="(item, index) in Object.keys(billingArray)"
              :key="index"
            >
              <span class="label">{{ item }}：</span>
              <span class="value">{{
                orderDetail.userDTO.billingJson[item] || "-"
              }}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!-- <el-row>
        <el-collapse-item title="Ship Address"> xxx1 </el-collapse-item>
      </el-row> -->
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
            :src="buildImageUrlNew(item.templateUrl)"
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
                      :src="buildImageUrlNew(item.templateUrl)"
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
                      :src="buildImageUrlNew(item.extendJson.printUrl)"
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
                      :src="buildImageUrlNew(image)"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row class="pay-info-line">
        <el-col :span="6" :offset="18">
          <span class="label"> 商品小计： </span>
          <span class="value">
            {{ `$${orderDetail.paidPrice - orderDetail.shippingFree}` }}
          </span>
        </el-col>
      </el-row>
      <el-row class="pay-info-line">
        <el-col :span="6" :offset="18">
          <span class="label"> 运 费： </span>
          <span class="value">
            {{ `$${orderDetail.shippingFree}` }}
          </span>
        </el-col>
      </el-row>
      <el-row class="pay-info-line">
        <el-col :span="6" :offset="18">
          <span class="label"> 优惠金额： </span>
          <span class="value">
            {{ `$${orderDetail.discountPrice}` }}
          </span>
        </el-col>
      </el-row>
      <el-row class="pay-info-line">
        <el-col :span="6" :offset="18">
          <span class="label"> 实付金额： </span>
          <span class="value">
            {{ `$${orderDetail.paidPrice}` }}
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- 该canvas节点用来导出模板图片渲染用 -->
    <canvas id="myCanvasMax" style="display: none; opacity: 0"></canvas>
    <div
      class="print-graph"
      v-if="printRenderLoading"
      v-loading.fullscreen="printRenderLoading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      element-loading-text="效果图拼命渲染中..."
    >
      <div class="graph-container">
        <img
          :src="selectModelImage"
          class="single-graph-image"
          style="z-index: 1"
          alt=""
        />
        <img
          :src="selectCaseImage"
          class="single-graph-image"
          style="z-index: 2"
          alt=""
        />
        <div
          :style="{
            maskImage: `url(${selectMaskImage})`,
            zIndex: 3,
          }"
          id="mask-container"
          class="mask-container"
        >
          <img
            class="container-image"
            style="position: relative; z-index: -1; opacity: 0"
            :src="selectModelImage"
            alt=""
          />
          <div
            v-for="(item, index) in stickerList"
            :key="index"
            :style="{
              height: item.height === 'auto' ? 'auto' : `${item.height}px`,
              width: item.width === 'auto' ? 'auto' : `${item.width}px`,
              top: `${item.top}px`,
              left: `${item.left}px`,
              transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
              zIndex: `${item.zIndex}`,
            }"
            class="drag-item"
          >
            <div
              class="drag-text"
              v-if="item.type === 'text'"
              :style="{
                color: item.color,
                fontFamily: item.fontFamily,
                fontWeight: item.fontWeight,
                fontStyle: item.fontStyle,
                textAlign: item.textAlign,
                textDecoration: item.textDecoration,
                fontSize: `${item.fontSize}px`,
                transform: rotateRender(item),
              }"
            >
              {{ item.content }}
            </div>
            <img
              v-else
              class="sticker-image"
              draggable="false"
              :style="{
                transform: rotateRender(item),
              }"
              :src="item.url"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getOrderDetail,
  refundRequest,
  updateTrackingNumber,
  updatePrintImage,
} from "@/api/order";
import { dateFormat, buildImageUrlNew, exportPrintImage } from "@/utils";
import { ElMessageBox, ElMessage } from "element-plus";

const statusMap = ref({
  0: "on hold",
  1: "processing",
  2: "completed",
  3: "refunded",
});
const paymentMethodsOptions = ref({
  0: "paypal",
  1: "信用卡",
});

const trackingNumber = ref(null);
const updateTrackingInfo = () => {
  if (!trackingNumber.value) {
    ElMessage.warning("请输入物流号！");
    return;
  }
  const { orderId } = route.query;
  updateTrackingNumber({
    orderId,
    trackingNumber: trackingNumber.value,
  }).then((res) => {
    if (res.code === 200) {
      ElMessage({
        message: "更新成功！",
        type: "success",
      });
      initDatas();
    } else {
      ElMessage({
        message: res.message,
        type: "warning",
      });
    }
  });
};

const refundHandler = () => {
  const { orderId } = route.query;
  ElMessageBox.confirm("确定修改状态为Refunded吗?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      refundRequest(orderId).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "修改成功！",
            type: "success",
          });
          initDatas();
        } else {
          ElMessage({
            message: res.message,
            type: "warning",
          });
        }
      });
    })
    .catch(() => {
      console.log("取消删除！");
    });
};

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
        updatePrintImageHandler(res.data);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  }
};
const userDTO = computed(() => orderDetail.value?.userDTO);
const billingArray = computed(() => {
  return orderDetail.value?.userDTO?.billingJson || [];
});
const productJson = computed(() => orderDetail.value?.productJson);
initDatas();

const downloadImage = (imageUrl) => {
  const url = buildImageUrlNew(imageUrl);
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

const selectModelImage = ref(null);
const selectCaseImage = ref(null);
const selectMaskImage = ref(null);
const printRenderLoading = ref(false);
const stickerList = ref([]);
const updatePrintImageHandler = async (datas) => {
  printRenderLoading.value = true;
  let nullCount = 0;
  for (let i = 0; i < datas.productJson.length; i++) {
    if (
      !datas.productJson[i].extendJson.printUrl &&
      datas.productJson[i].extendJson.printData
    ) {
      nullCount++;
      await dealPrintImageHandler(datas.productJson[i]);
    }
  }
  printRenderLoading.value = false;
  if (nullCount > 0) {
    initDatas();
  }
};
const sleepHandler = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
const dealPrintImageHandler = (itemData) => {
  return new Promise(async (resolve) => {
    selectModelImage.value = itemData.extendJson.printData.modelImage;
    selectCaseImage.value = itemData.extendJson.printData.caseImage;
    selectMaskImage.value = itemData.extendJson.printData.maskImage;
    stickerList.value = itemData.extendJson.printData.graphDatas;
    await sleepHandler(2000);
    // 获取打印设置，如果有就以打印设置为准
    // const { width, height } = getItem("printAdjust") || {};
    // const naturalWidth = Number(width) || imageDom.naturalWidth;
    // const naturalHeight = Number(height) || imageDom.naturalHeight;

    // 获取图片当前实际宽高
    const imageDom = document.getElementsByClassName("container-image")[0];
    const naturalWidth = imageDom.naturalWidth;
    const naturalHeight = imageDom.naturalHeight;
    // 需要设置透明色，否则打印如片会有手机壳底图
    imageDom.style.opacity = 0;
    // 获取容器计算属性
    const containerDom = document.getElementsByClassName("mask-container")[0];
    const containerWidth = getComputedStyle(containerDom, null)["width"];
    const containerHeight = getComputedStyle(containerDom, null)["height"];
    // 计算设置的scaleX和Y
    const scaleX =
      naturalWidth /
      Number(containerWidth.substr(0, containerWidth.length - 2));
    const scaleY =
      naturalHeight /
      Number(containerHeight.substr(0, containerHeight.length - 2));
    containerDom.style.transform = `scale(${scaleX}, ${scaleY})`;
    const printMaxImage = await exportPrintImage(
      "mask-container",
      selectMaskImage.value,
      naturalWidth,
      naturalHeight
    );
    await updateOrderPrintImg(printMaxImage, itemData.productId);
    resolve();
  });
};
const updateOrderPrintImg = (imageId, productId) => {
  return new Promise(async (resolve) => {
    const { orderId } = route.query;
    console.log("request:", `${orderId}-${productId}-${imageId}`);
    await updatePrintImage({
      orderId,
      productId,
      imageId,
    });
    resolve();
  });
};
const rotateRender = (item) => {
  const { rotateY, rotateZ } = item;
  let styleStr = ``;
  if (rotateY) {
    styleStr += `rotateY(180deg)`;
  }
  if (rotateZ) {
    styleStr += `rotateY(180deg) rotateZ(180deg)`;
  }
  return styleStr;
};
</script>

<style lang="less" scoped>
.order-detail-component {
  position: relative;
  :deep(.el-collapse-item__header) {
    font-weight: bold;
  }
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
    .pay-info-line {
      text-align: left;
      margin-top: 15px;
      font-size: 16px;
      .label {
        font-weight: bold;
        color: #777;
        margin-right: 20px;
        text-align: right;
        display: inline-block;
        width: 90px;
      }
      .value {
        color: #000;
        font-weight: bold;
      }
    }
  }
  .card-container + .card-container {
    margin-top: 20px;
  }
  .tracking-update {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .save-button {
      margin-left: 10px;
    }
  }
  .print-graph {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: start;
    justify-content: center;
    .single-graph-image {
      position: absolute;
      width: 300px;
    }
    .container-image {
      width: 100%;
      height: 100%;
    }
    #mask-container {
      width: 300px;
      line-height: 0;
      position: relative;
      -webkit-mask-size: cover;
      background: transparent;
      .drag-item {
        line-height: normal;
        user-select: none;
        position: absolute;
        cursor: pointer;
        // background-image: url("../../../assets/images/login_background2.jpg");
        // background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #00000000;
        .sticker-image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
