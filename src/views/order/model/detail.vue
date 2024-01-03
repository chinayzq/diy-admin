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
    <canvas id="myCanvasMax" style="display: none"></canvas>
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
        updatePrintImage(res.data);
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

const testDatas = {
  createdDate: "2023-12-30 21:57:33.0",
  orderId: "J88158926",
  shippingFree: 0,
  discountPrice: 0,
  originalPrice: 45,
  paidPrice: 45,
  status: 1,
  paymentMethod: 1,
  clientIp: "47.89.247.141",
  productJson: [
    {
      productId: "1191010232787795968",
      productImageList: [
        "857b98f8653b4ed1a83f3bc2704fc098",
        "790f4560953c4046bb6f05d5e483d8d4",
        "ea6ee8e1d14948cc8c118e28e2e1bfea",
        "5ad72aca91f946bb9c4a12dd7905b1f6",
        "f6e0b97ce03541ef98cc89bcc038c09c",
        "c4a23c4179574a81bfa4e41589bfb96a",
        "1e55df2921c440b6abca11b2bbdc8566",
        "2a4e7f19c46e4f9b97c5729ddfbc7941",
        "341b09bf4f294104b6b6921a00ab8637",
        "76f83a4a3f264477a69764fd150bc822",
      ],
      extendJson: {
        caseColor: "",
        oriPrice: 39.9,
        extend3: "Frosted-13-6.1in",
        extend2: "",
        printUrl: "",
        extend1: "6.1inches",
        curPrice: 15,
        phoneName: "iPhone 13",
        printData: {
          graphDatas: [
            {
              rotate: 0,
              top: 246.85067114093957,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 4.874781746031746,
              active: false,
              id: "385d42b7-1083-4bbe-8c19-66a354cb5b56",
              url: "https://osscolgifts.com/63e42cdae6744f6ca786a07b84019c31",
              height: 143.62220866381938,
              zIndex: 996,
            },
            {
              rotate: 0,
              top: 253.64512003803236,
              left: 53.933948941686594,
              width: 131.89036544850498,
              scale: 2.382718253968254,
              active: false,
              id: "5c47ea71-4246-4e84-ae7d-1c6180b23f38",
              url: "https://osscolgifts.com/7afd9665b2a34fdd98c635a4b62948da",
              height: 138.62220866381938,
              zIndex: 1042,
            },
            {
              rotate: 0,
              top: 225.85067114093957,
              left: 109.26910299003323,
              width: 71.46179401993356,
              scale: 4.297683397683398,
              active: false,
              id: "ac53d135-ed38-43e2-82c8-cda8c16c9f3d",
              url: "https://osscolgifts.com/d70f85ce333d43ccbf8a7e283ee368d4",
              height: 149.62220866381938,
              zIndex: 998,
            },
            {
              rotate: 0,
              top: 220.85067114093957,
              left: 81.55481727574751,
              width: 132.89036544850498,
              scale: 1.620813492063492,
              active: false,
              id: "109a0109-80a6-4cf0-9e3e-a5e316cf0c11",
              url: "https://osscolgifts.com/b50d594a3c274b9ea1bf00b4931ebefd",
              height: 143.62220866381938,
              zIndex: 1043,
            },
            {
              rotate: 0,
              top: 501.519491301316,
              left: -25.195116806412447,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "a25c8cfb-ada1-4a0a-b703-83b02443436f",
              url: "https://osscolgifts.com/2ef8ea118b8944ba9046af076306e2ef",
              height: 129.25998779743745,
              zIndex: 1006,
            },
            {
              rotate: 0,
              top: 501.519491301316,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "706ff155-e9f3-475a-8e1f-385c559f09e0",
              url: "https://osscolgifts.com/b754de945b52471cb2d93f1ace3a10f2",
              height: 129.25998779743745,
              zIndex: 1017,
            },
            {
              rotate: 0,
              top: 501.519491301316,
              left: 191.25006591783998,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "84246060-e62c-40f8-90a4-843c90980547",
              url: "https://osscolgifts.com/a208cc4d855744eb833bd1f39dc0e28e",
              height: 129.25998779743745,
              zIndex: 1018,
            },
            {
              rotate: 0,
              top: 409.17938751852165,
              left: -24.140431366344973,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "ca9f15ee-133e-4e43-9932-f47d051916e4",
              url: "https://osscolgifts.com/233f8898ba6c4eab888fc6be8773418a",
              height: 129.25998779743745,
              zIndex: 1019,
            },
            {
              rotate: 0,
              top: 409.17938751852165,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "989d6f22-9900-41d1-9047-8d79fc3d046e",
              url: "https://osscolgifts.com/6e71c5f4dc9a4c9b91c39f57c9b54913",
              height: 129.25998779743745,
              zIndex: 1020,
            },
            {
              rotate: 0,
              top: 409.17938751852165,
              left: 191.25006591784003,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "7dcac521-ae3a-46c3-812e-6136695d0813",
              url: "https://osscolgifts.com/fdfafd746c974d868239a6b5cd0cabab",
              height: 129.25998779743745,
              zIndex: 1021,
            },
            {
              rotate: 0,
              top: 322.31958235858104,
              left: 191.25006591783998,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "114d4c30-166b-4e59-8a1c-336096bbdc94",
              url: "https://osscolgifts.com/86c7206ebbc646719660d40c89477f02",
              height: 129.25998779743745,
              zIndex: 1023,
            },
            {
              rotate: 0,
              top: 322.31958235858104,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "b9ea5329-b1a1-4704-a087-0ab0d5e22b46",
              url: "https://osscolgifts.com/64ae47f80711443ebd4636b096755c46",
              height: 129.25998779743745,
              zIndex: 1028,
            },
            {
              rotate: 0,
              top: 322.319582358581,
              left: -25.195116806412447,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "c82c2aeb-0da2-4721-84fd-0cee91902a4a",
              url: "https://osscolgifts.com/b88e93e3d111404990f0522ebfa7f6d1",
              height: 129.25998779743745,
              zIndex: 1029,
            },
            {
              rotate: 0,
              top: 229.9794785757867,
              left: 191.25006591784003,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "ae027f1c-4b95-404d-af74-f8f15a2ac42b",
              url: "https://osscolgifts.com/c6034788b4154a208f9180a9d266c480",
              height: 129.25998779743745,
              zIndex: 1030,
            },
            {
              rotate: 0,
              top: 229.9794785757867,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "ec852454-f270-4607-9f68-15de6bfde97a",
              url: "https://osscolgifts.com/6bd6a9ced1fa4cf1b3b937c48c991afc",
              height: 129.25998779743745,
              zIndex: 1031,
            },
            {
              rotate: 0,
              top: 229.9794785757867,
              left: -24.140431366344966,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "5e97e4bb-7702-41ad-8641-847bb8b1db1e",
              url: "https://osscolgifts.com/af5691a90bb042b6b10e301c70e467c5",
              height: 129.25998779743745,
              zIndex: 1032,
            },
            {
              rotate: 0,
              top: 139.63937479299233,
              left: -28.195116806412443,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "990b2a15-d880-4fc8-8d0b-ee7daac9ff5f",
              url: "https://osscolgifts.com/e1f44817f45a42b484840ebf5e1e53b8",
              height: 129.25998779743745,
              zIndex: 1033,
            },
            {
              rotate: 0,
              top: 135.72060134196335,
              left: 83.55481727574754,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "a8d6e604-94c3-4a58-b735-98633eee7461",
              url: "https://osscolgifts.com/06f20d9a0d1c4f118cf9f987659c4c77",
              height: 129.25998779743745,
              zIndex: 1034,
            },
            {
              rotate: 0,
              top: 135.7206013419633,
              left: 191.25006591783998,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "9d0b8c97-1073-49b3-b443-62cb576c0cf3",
              url: "https://osscolgifts.com/a90299458d0449d883abc7d1ff4b14c2",
              height: 129.25998779743745,
              zIndex: 1035,
            },
            {
              rotate: 0,
              top: 45.299271010197984,
              left: 83.55481727574751,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "9875e66e-bdbf-4884-bff8-a8420c180da0",
              url: "https://osscolgifts.com/31a71a47f90e48e0a2bc9a0323a741c9",
              height: 129.25998779743745,
              zIndex: 1036,
            },
            {
              rotate: 0,
              top: 45.299271010198005,
              left: 191.25006591783998,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "e39774ae-08df-4969-bb76-684a329dee1d",
              url: "https://osscolgifts.com/5fd72819b47645dca8c388cb74542699",
              height: 129.25998779743745,
              zIndex: 1037,
            },
            {
              rotate: 0,
              top: 72.29927101019803,
              left: -26.14043136634496,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "b0945fb6-6cd2-4c5a-a277-72d5186a79e6",
              url: "https://osscolgifts.com/2dfd37528bc1416883eaabee7dd6b8ad",
              height: 129.25998779743745,
              zIndex: 1038,
            },
            {
              rotate: 0,
              top: -47.040832772596296,
              left: 2.4376417233560406,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "d986b509-7f1c-47ee-b8cb-b9d74fd8ab5b",
              url: "https://osscolgifts.com/b38eaf72f85f4a72a588c1e63b82472b",
              height: 129.25998779743745,
              zIndex: 1039,
            },
            {
              rotate: 0,
              top: -47.040832772596296,
              left: 83.5548172757475,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "c1a8a50c-9b3c-4f96-aaa1-13b71634cd7f",
              url: "https://osscolgifts.com/e3d62db281474035bd59be8e367432f5",
              height: 129.25998779743745,
              zIndex: 1040,
            },
            {
              rotate: 0,
              top: -47.04083277259628,
              left: 192.30475135790746,
              width: 132.89036544850498,
              scale: 1.4287499999999995,
              active: false,
              id: "d9311541-305e-453b-86cc-f199ff169a24",
              url: "https://osscolgifts.com/97568562138f4e2eb7dec753b8d2d0b7",
              height: 129.25998779743745,
              zIndex: 1041,
            },
          ],
          modelImage:
            "https://osscolgifts.com/d6ed9475fbf4465998fab83ab4f94224",
          caseImage: "https://osscolgifts.com/7106846766d14cbc9009dc9345c132cb",
          maskImage: "https://osscolgifts.com/4e88939a4da842af8f8d7195229aca4b",
        },
      },
      cardId: "1191016122404306944",
      phoneCode: "IPHONE13",
      description: "iPhone 13 -  6.1inches - ",
      productCount: 1,
      templateUrl: "27ba0c1569b1484e891ea2b400e95820",
      cardAmountId: "104",
    },
    {
      productId: "1191010232787795968",
      productImageList: [
        "857b98f8653b4ed1a83f3bc2704fc098",
        "790f4560953c4046bb6f05d5e483d8d4",
        "ea6ee8e1d14948cc8c118e28e2e1bfea",
        "5ad72aca91f946bb9c4a12dd7905b1f6",
        "f6e0b97ce03541ef98cc89bcc038c09c",
        "c4a23c4179574a81bfa4e41589bfb96a",
        "1e55df2921c440b6abca11b2bbdc8566",
        "2a4e7f19c46e4f9b97c5729ddfbc7941",
        "341b09bf4f294104b6b6921a00ab8637",
        "76f83a4a3f264477a69764fd150bc822",
      ],
      extendJson: {
        caseColor: "",
        oriPrice: 39.9,
        extend3: "Frosted-13-6.1in",
        extend2: "",
        printUrl: "44f69fc240e24f2b96a4cb689d6bf96e",
        extend1: "6.1inches",
        curPrice: 15,
        phoneName: "iPhone 13",
        printData: {
          graphDatas: [
            {
              rotate: 0,
              top: 416.96044835248966,
              left: 48.616935534220005,
              width: 131.0043668122271,
              scale: 1.3650731943334726,
              active: false,
              id: "b95a7f2d-c910-48f6-a562-31ae4380951f",
              url: "https://osscolgifts.com/f729000da2d54b059f1be3689c2cf8c1",
              height: 122.50944058295964,
              zIndex: 1001,
            },
            {
              rotate: 0,
              top: 305.6593999307688,
              left: 0.11829617727829596,
              width: 117.24890829694324,
              scale: 1.3463757070639977,
              active: false,
              id: "224c7041-239a-4d10-8758-8e9a28710eb4",
              url: "https://osscolgifts.com/2a51939303e6463d9d5d29eb9f22ceaf",
              height: 132.08565022421524,
              zIndex: 1004,
            },
            {
              rotate: 17,
              top: 38.978458260806114,
              left: 109.23420819524576,
              width: 131.0043668122271,
              scale: 2.0681731972658133,
              active: false,
              id: "b2cd2efd-95ec-4907-aded-9c500eaab688",
              url: "https://osscolgifts.com/674271fbc9c64e6cbe0e1f2c912b1bdc",
              height: 132.08565022421524,
              zIndex: 1005,
            },
            {
              rotate: 0,
              top: 173.6181172220737,
              left: 4.433741706861431,
              width: 130.67685589519652,
              scale: 1.606469963297578,
              active: false,
              id: "216ba5bb-d136-437d-b8d2-116cd15737d0",
              url: "https://osscolgifts.com/69d86c1b0e5e450d94558695223f120f",
              height: 132.08565022421524,
              zIndex: 1002,
            },
            {
              rotate: 0,
              top: 98.6473512035033,
              left: 85.27154450624846,
              width: 104.80349344978167,
              scale: 2.1558336141330505,
              active: false,
              id: "677b4ea7-66fc-4f60-920e-e2b5adc9ee83",
              url: "https://osscolgifts.com/cd289fd25efd4773bf840096d0cc9647",
              height: 132.08565022421524,
              zIndex: 1014,
            },
            {
              rotate: 0,
              top: 349.1186645707703,
              left: 189.0691872506382,
              width: 98.2532751091703,
              scale: 2.6573749237829327,
              active: false,
              id: "f0067f14-71aa-4865-b8eb-8fc6d565de7c",
              url: "https://osscolgifts.com/c81bcee60d8f4e8ba2dbb98d8ec4a920",
              height: 132.08565022421524,
              zIndex: 1013,
            },
            {
              rotate: 0,
              top: 38.97845826080611,
              left: 124.1771257511909,
              width: 131.0043668122271,
              scale: 1.2523457206123039,
              active: false,
              id: "89ac5e8b-57e4-4c70-9919-76ff682a2785",
              url: "https://osscolgifts.com/72d33b2038ea464dbdc40c4ac0007ec9",
              height: 132.08565022421524,
              zIndex: 1010,
            },
            {
              rotate: 0,
              top: 231.0500788378722,
              left: 166.45908683301218,
              width: 131.0043668122271,
              scale: 2.476086935592568,
              active: false,
              id: "db8f45bf-3970-4bc0-a138-e97fe9917fc1",
              url: "https://osscolgifts.com/70223c8ff7874afea0eb374a673f7981",
              height: 132.08565022421524,
              zIndex: 1012,
            },
            {
              rotate: 0,
              top: -8.096732365205456,
              left: 172.69364139910982,
              width: 131.0043668122271,
              scale: 1.145,
              active: false,
              id: "f4c00d37-b450-4f1a-8f31-e0e1cc13f693",
              url: "https://osscolgifts.com/10a38f24012049d69ffa9efacd019a0b",
              height: 132.08565022421524,
              zIndex: 1015,
            },
            {
              rotate: 353,
              top: 198.39061935850515,
              left: 128.76227858961886,
              width: 121.83406113537119,
              scale: 1.38146680455615,
              active: false,
              id: "38fafcea-f962-4e58-9941-6b244a8b4fa4",
              url: "https://osscolgifts.com/4e4ebe61c25d4b1aa0b348603736592c",
              height: 132.08565022421524,
              zIndex: 1016,
            },
            {
              rotate: 0,
              top: 305.6593999307688,
              left: 109.71615720524018,
              width: 80.56768558951966,
              scale: 1.8617886178861789,
              active: false,
              id: "e6ed14c7-bf1b-4f0e-abf8-b6c235b77225",
              url: "https://osscolgifts.com/5ca78185badd44d5bc7ff1ae84c579dd",
              height: 132.08565022421524,
              zIndex: 1000,
            },
          ],
          modelImage:
            "https://osscolgifts.com/d6ed9475fbf4465998fab83ab4f94224",
          caseImage: "https://osscolgifts.com/7106846766d14cbc9009dc9345c132cb",
          maskImage: "https://osscolgifts.com/4e88939a4da842af8f8d7195229aca4b",
        },
      },
      cardId: "1191016122404306944",
      phoneCode: "IPHONE13",
      description: "iPhone 13 -  6.1inches - ",
      productCount: 1,
      templateUrl: "27ba0c1569b1484e891ea2b400e95820",
      cardAmountId: "104",
    },
  ],
  userDTO: {
    userId: "49",
    email: "karlysanchez921@gmail.com",
    phone: "3234750261",
    firstName: "karly",
    lastName: "Sanchez",
    billingJson: {
      firstName: "karly",
      lastName: "Sanchez",
      country: "US",
      phone: "3234750261",
      streetAddress: "3761 bella villgio ave.",
      city: "perris",
      postcode: "92571",
      cpf: null,
      state: "california",
      email: "karlysanchez921@gmail.com",
      apartment: null,
    },
    shipAddressJson: {
      firstName: null,
      lastName: null,
      country: null,
      phone: null,
      streetAddress: null,
      city: null,
      postcode: null,
      cpf: null,
      state: null,
      email: null,
      apartment: null,
    },
  },
  payExtendStr:
    '{"sign":"b4d0933a228fb3426c7ca52d8196a02f","transactionId":"J88158926","creditType":"usee"}',
};
const selectModelImage = ref(null);
const selectCaseImage = ref(null);
const selectMaskImage = ref(null);
const printRenderLoading = ref(false);
const stickerList = ref([]);
const updatePrintImage = async () => {
  printRenderLoading.value = true;
  for (let i = 0; i < testDatas.productJson.length; i++) {
    if (!testDatas.productJson[i].extendJson.printUrl) {
      await dealPrintImageHandler(testDatas.productJson[i]);
    }
  }
  printRenderLoading.value = false;
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
    // await updatePrintImage({
    //   orderId,
    //   productId,
    //   imageId
    // })
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
