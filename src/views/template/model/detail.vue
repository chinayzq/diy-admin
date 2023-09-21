<template>
  <div class="template-detail-component" @click="clearActiveState">
    <div class="basic-image-part">
      <div class="common-title">Base Map Selection</div>
      <el-input
        v-model="templateName"
        class="model-selector"
        placeholder="Please enter a template name"
      ></el-input>
      <el-select
        class="model-selector"
        v-model="oneLevelCategory"
        filterable
        placeholder="Slect One Level Category"
      >
        <el-option
          v-for="item in oneLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        class="model-selector"
        v-model="selectModel"
        filterable
        @change="modelChange"
        placeholder="Select Model"
      >
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div v-loading="imageContainerLoading">
        <div class="item-title">Model Image</div>
        <div class="model-image-list" v-if="modelImageList.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in modelImageList"
            :key="item.url"
            @click="setSelectImage('model', item, modelImageList)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>no pictures</div>

        <div class="item-title">Case Image</div>
        <div class="model-image-list" v-if="caseImageList.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in caseImageList"
            :key="item.url"
            @click="setSelectImage('case', item, caseImageList)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>no pictures</div>

        <div class="item-title">Mask Image</div>
        <div class="model-image-list" v-if="maskImage.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in maskImage"
            :key="item.url"
            @click="setSelectImage('mask', item, maskImage)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>no pictures</div>
      </div>
    </div>
    <div class="center-container">
      <div class="common-title">Template Configuration</div>
      <div class="graph-container">
        <img
          style="z-index: 1"
          class="single-graph-image"
          v-if="selectModelImage"
          :src="selectModelImage"
          alt=""
        />
        <img
          style="z-index: 2"
          class="single-graph-image"
          v-if="selectCaseImage"
          :src="selectCaseImage"
          alt=""
        />
        <div
          :style="{
            zIndex: 3,
            maskImage: `url(${selectMaskImage})`,
          }"
          @mousemove="
            (event) => {
              moveHandler(event, item);
            }
          "
          class="mask-container"
        >
          <!-- 该图只为撑起来mask容器 -->
          <img
            style="position: relative; width: 300px; z-index: 0"
            :src="selectModelImage"
            alt=""
          />
          <div
            @mousedown="
              (event) => {
                dragStartHandler(event, item);
              }
            "
            @click.stop="activeItem(item)"
            @mouseup="eventEndHandler"
            v-for="item in dragStickerList"
            :id="`drag_dom_${item.id}`"
            :key="item.id"
            :style="{
              height: `${item.height}px`,
              width: `${item.width}px`,
              top: `${item.top}px`,
              left: `${item.left}px`,
              transform: `rotate(${item.rotate}deg)`,
              zIndex: item.active ? 9999 : `${item.zIndex}`,
            }"
            :class="['drag-image', item.active && 'drag-image-active']"
          >
            <img
              draggable="false"
              style="height: 100%; width: 100%"
              :src="item.url"
              alt=""
            />
            <template v-if="item.active">
              <img
                draggable="false"
                @click.stop="iconDeleteHandler(item)"
                :src="DeleteIcon"
                class="operation-icon delete-icon"
                alt=""
              />
              <!-- <span class="replace-icon"> Replace </span> -->
              <img
                draggable="false"
                @click.stop="iconCopyHandler(item)"
                :src="PlusIcon"
                class="operation-icon plus-icon"
                alt=""
              />
              <div
                @mousedown.stop.prevent="
                  (event) => {
                    resizeStart(event, item);
                  }
                "
                class="operation-icon resize-icon"
              >
                <img draggable="false" :src="ResizeIcon" alt="" />
              </div>
              <img
                draggable="false"
                @mousedown.stop.prevent="
                  (event) => {
                    rotateStart(event, item);
                  }
                "
                :src="RotateIcon"
                class="operation-icon rotate-icon"
                alt=""
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="sticker-part">
      <div class="common-title">Stickers</div>
      <el-collapse>
        <el-collapse-item
          :name="item.id"
          v-for="item in stickerList"
          :key="item.id"
        >
          <template #title>
            <img class="sticker-title-img" v-lazy="item.stickerUrl" alt="" />
          </template>
          <div class="sticker-list-container">
            <span
              class="single-sticker"
              v-for="subItem in item.stickerChildlist"
              :key="subItem.url"
              @click="addStickerToGraph(subItem)"
            >
              <img v-lazy="subItem.url" alt="" />
            </span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup name="template-detail-component">
import { ref, onBeforeMount, watch } from "vue";
import { getPhoneColor, getModelList } from "@/api/model";
import { getStickerList } from "@/api/sticker";
import { getItemByClassId } from "@/api/dictionary";
import { useRoute } from "vue-router";
import { uuid } from "@/utils";
import DeleteIcon from "@/assets/images/drag_delete_icon.png";
import PlusIcon from "@/assets/images/drag_plus_icon.svg";
import ResizeIcon from "@/assets/images/drag_resize_icon.png";
import RotateIcon from "@/assets/images/drag_rotate_icon.svg";
onBeforeMount(() => {
  initModelList();
  initOneLevelOptions();
  initStickerList();
  if (testFlag) {
    selectModel.value = "IPHONE14";
    modelChange("IPHONE14");
  }
});

const testFlag = true;

const templateName = ref(null);

const stickerLoading = ref(false);
const stickerList = ref([]);
const initStickerList = () => {
  stickerLoading.value = true;
  getStickerList()
    .then((res) => {
      if (res.code === 200) {
        stickerList.value = res.data;
      } else {
        stickerList.value = [];
      }
    })
    .finally(() => {
      stickerLoading.value = false;
    });
};

const selectModel = ref("");
const modelOptions = ref([]);
const initModelList = () => {
  getModelList().then((res) => {
    if (res.code === 200) {
      modelOptions.value = res.data.map((item) => {
        return {
          value: item.phoneCode,
          label: item.phoneName,
        };
      });
    }
  });
};
const modelChange = (model) => {
  getModelImages(model);
};

const imageContainerLoading = ref(false);
const modelImageList = ref([]);
const caseImageList = ref([]);
const maskImage = ref([]);
const getModelImages = (phoneCode) => {
  imageContainerLoading.value = true;
  getPhoneColor({ phoneCode })
    .then((res) => {
      if (res.code === 200) {
        modelImageList.value = res.data
          .filter((item) => item.type === "1")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
        caseImageList.value = res.data
          .filter((item) => item.type === "2")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
        maskImage.value = res.data
          .filter((item) => item.type === "3")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
      } else {
        modelImageList.value = [];
        caseImageList.value = [];
        maskImage.value = [];
      }
    })
    .finally(() => {
      imageContainerLoading.value = false;
      if (testFlag) {
        setSelectImage("model", modelImageList.value[0], modelImageList.value);
        setSelectImage("case", caseImageList.value[0], caseImageList.value);
        setSelectImage("mask", maskImage.value[0], maskImage.value);
      }
    });
};

const selectModelImage = ref(null);
const selectCaseImage = ref(null);
const selectMaskImage = ref(null);
const setSelectImage = (type, item, itemList) => {
  switch (type) {
    case "model":
      selectModelImage.value = item.url;
      break;
    case "case":
      selectCaseImage.value = item.url;
      break;
    case "mask":
      selectMaskImage.value = item.url;
      break;
  }
  itemList.forEach((single) => {
    single.active = false;
  });
  item.active = true;
};

const route = useRoute();
const oneLevelCategory = ref(null);
const oneLevelOptions = ref([]);
const initOneLevelOptions = () => {
  getItemByClassId({
    classId: "19",
  })
    .then((res) => {
      if (res.code === 200) {
        oneLevelOptions.value = res.data.map((item) => {
          return {
            label: item.itemName,
            value: item.itemCode,
          };
        });
        console.log("oneLevelOptions.value", oneLevelOptions.value);
      }
    })
    .finally(() => {
      const { typeCode } = route.query;
      if (typeCode) {
        oneLevelCategory.value = typeCode;
      }
    });
};

const dragStickerList = ref([
  {
    id: "xxx1",
    url: "/diyadmin/download?fileId=a377ec418cae49bf80fbde0fdec415ff",
    height: 100,
    width: 100,
    top: 200,
    left: 50,
    rotate: 0,
    zIndex: 1001,
    active: false,
  },
]);
const addStickerToGraph = ({ url }) => {
  dragStickerList.value.push({
    id: uuid(),
    url,
    height: 100,
    width: 100,
    top: 280,
    left: 100,
    zIndex: getMaxIndex(),
    active: false,
  });
};
const activeItem = (dragItem) => {
  clearActiveState();
  dragItem.active = true;
};
// 清除所有拖拽图形active状态
const clearActiveState = () => {
  dragStickerList.value.forEach((item) => {
    item.active = false;
  });
};
// 获取addStickerToGraph最大Index
const getMaxIndex = () => {
  if (dragStickerList.value.length) {
    let count = 0;
    dragStickerList.value.forEach((item) => {
      if (item.zIndex > count) {
        count = item.zIndex;
      }
    });
    return count + 1;
  } else {
    return 1000;
  }
};

let currentItem = {};
// move事件处理
const moveHandler = (event) => {
  if (draggingItem.start) {
    dragHandler(event, currentItem);
  }
  if (resizeObj.start) {
    resizeMove(event, currentItem);
  }
  if (rotateObj.start) {
    rotating(event, currentItem);
  }
};

// icon - 拖拽
const draggingItem = {
  x: 0,
  y: 0,
  start: false,
};
const dragHandler = (event, item) => {
  const { clientX, clientY } = event;
  if (clientY === 0 || clientX === 0 || !draggingItem.start) return;
  const xDiff = clientX - draggingItem.x;
  const yDiff = clientY - draggingItem.y;
  draggingItem.x = clientX;
  draggingItem.y = clientY;
  item.top = item.top + yDiff;
  item.left = item.left + xDiff;
};
const dragStartHandler = (event, item) => {
  currentItem = item;
  console.log("currentItem", currentItem);
  draggingItem.start = true;
  const { clientX, clientY } = event;
  draggingItem.x = clientX;
  draggingItem.y = clientY;
};
const dragEndHandler = (event, item) => {
  draggingItem.start = false;
};

// icon - 删除
const iconDeleteHandler = ({ id }) => {
  dragStickerList.value = dragStickerList.value.filter(
    (item) => item.id !== id
  );
};

// icon - 复制
const iconCopyHandler = (item) => {
  const { url, height, width, top, left } = item;
  dragStickerList.value.push({
    id: uuid(),
    url,
    height,
    width,
    top: top + 40,
    left: left + 40,
    zIndex: getMaxIndex(),
    active: false,
  });
};

// icon - 改变大小
const resizeObj = {
  start: false,
  x: 0,
  y: 0,
};
const resizeStart = (event, item) => {
  event.preventDefault();
  currentItem = item;
  const { clientX, clientY } = event;
  resizeObj.start = true;
  resizeObj.x = clientX;
  resizeObj.y = clientY;
};
const resizeMove = (event, item) => {
  if (!resizeObj.start) return;
  const { clientX, clientY } = event;
  const xDiff = clientX - resizeObj.x;
  const yDiff = clientY - resizeObj.y;
  resizeObj.x = clientX;
  resizeObj.y = clientY;
  item.height = item.height + yDiff;
  item.width = item.width + xDiff;
};
const resizeEnd = (event, item) => {
  resizeObj.start = false;
};

// icon - 旋转
let rotateObj = {
  start: false,
  rotate: 0,
};
let pointA = {
  X: 0,
  Y: 0,
};
let pointB = {};
let pointC = {};
const rotateStart = (event, item) => {
  currentItem = item;
  rotateObj.start = true;
  // 计算元素中心点
  const { height, width, id } = item;
  const currentDom = document.getElementById(`drag_dom_${id}`);
  const { left, top } = currentDom.getBoundingClientRect();
  pointA.X = width / 2 + left;
  pointA.Y = height / 2 + top;
  // 记录起始坐标
  pointB.X = event.pageX;
  pointB.Y = event.pageY;
  // 计算元素中心点
  // pointA.X = event.pageX - width / 2;
  // pointA.Y = event.pageY - height / 2;
  // 记录已有旋转角度
  rotateObj.rotate = item.rotate;
};
const rotating = (event, item) => {
  if (!rotateObj.start) return;
  pointC.X = event.pageX;
  pointC.Y = event.pageY; // 获取结束点坐标
  // 计算出旋转角度
  const AB = {};
  const AC = {};
  AB.X = pointB.X - pointA.X;
  AB.Y = pointB.Y - pointA.Y;
  AC.X = pointC.X - pointA.X;
  AC.Y = pointC.Y - pointA.Y; // 分别求出AB,AC的向量坐标表示
  const direct = AB.X * AC.Y - AB.Y * AC.X; // AB与AC叉乘求出逆时针还是顺时针旋转
  const lengthAB = Math.sqrt(
      Math.pow(pointA.X - pointB.X, 2) + Math.pow(pointA.Y - pointB.Y, 2)
    ),
    lengthAC = Math.sqrt(
      Math.pow(pointA.X - pointC.X, 2) + Math.pow(pointA.Y - pointC.Y, 2)
    ),
    lengthBC = Math.sqrt(
      Math.pow(pointB.X - pointC.X, 2) + Math.pow(pointB.Y - pointC.Y, 2)
    );
  const cosA =
    (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) /
    (2 * lengthAB * lengthAC); //   余弦定理求出旋转角
  const angleA = Math.round((Math.acos(cosA) * 180) / Math.PI);
  let allA = 0;
  if (direct < 0) {
    allA = -angleA; //叉乘结果为负表示逆时针旋转， 逆时针旋转减度数
  } else {
    allA = angleA; //叉乘结果为正表示顺时针旋转，顺时针旋转加度数
  }
  console.log("allA", allA);
  // 如果上一次按下旋转已经有度数,需要加上上一次的度数
  if (rotateObj.rotate) {
    allA += rotateObj.rotate;
  }
  item.rotate = allA;
};

const rotateEnd = (event, item) => {
  console.log("rotateEnd");
  rotateObj.start = false;
  rotateObj.rotate = 0;
  pointA = {};
  pointB = {};
  pointC = {};
  // currentItem = {};
};

const eventEndHandler = () => {
  rotateEnd();
  resizeEnd();
  dragEndHandler();
};
</script>

<style lang="less" scoped>
.template-detail-component {
  height: 100%;
  display: flex;
  .basic-image-part {
    flex: 1;
    margin-right: 20px;
    padding-right: 10px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    .model-selector {
      width: 100%;
      margin-bottom: 10px;
    }
    .item-title {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      font-size: 12px;
      color: #333;
      border-bottom: 1px solid #ccc;
    }
    .model-image-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      .singl-model-image {
        cursor: pointer;
        width: 15%;
        padding: 10px 5%;
        margin: 10px 0;
        border: 1px solid #ffffff;
        img {
          width: 100%;
        }
      }
      .single-image-active {
        border: 1px solid #409eff;
      }
    }
    .mask-image-list {
      img {
        width: 15%;
      }
    }
  }
  .no-data {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-container {
    flex: 2;
    min-width: 500px;
    .graph-container {
      height: calc(100% - 30px);
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      .single-graph-image {
        width: 300px;
        position: absolute;
      }
      .mask-container {
        position: relative;
        // -webkit-mask-image: url("../../../assets/images/img_error.png");
        // -webkit-mask-image: url("../../../assets/images/mask_demo.png");
        -webkit-mask-size: cover;
        // -webkit-mask-image: url(https://oss.data.ideaskins.com.cn/diy/2023-5-5/4ea960dd-2565-4069-aa73-b6abaa5e1e27.png);
      }
      .drag-image {
        user-select: none;
        position: absolute;
        cursor: pointer;
        background-image: url("../../../assets/images/login_background2.jpg");
        background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #00000000;
        .operation-icon {
          cursor: pointer;
          height: 35px;
          width: 35px;
          position: absolute;
        }
        .delete-icon {
          left: -17.5px;
          top: -17.5px;
        }
        .replace-icon {
          display: inline-block;
          background: #ffffff;
          border-radius: 20px;
          padding: 5px 10px;
          color: #000;
          cursor: pointer;
          position: absolute;
          right: -33px;
          top: -18px;
          font-size: 14px;
        }
        .plus-icon {
          left: -17.5px;
          bottom: -17.5px;
        }
        .resize-icon {
          right: -17.5px;
          bottom: -17.5px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: nw-resize;
          img {
            width: 25px;
            height: 25px;
          }
        }
        .rotate-icon {
          bottom: -50px;
          left: calc(50% - 17.5px);
        }
      }
      .drag-image-active {
        border: 1px solid #409eff;
      }
    }
  }
  .common-title {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  .sticker-part {
    flex: 1;
    margin-left: 20px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    .sticker-title-img {
      height: 40px;
      width: 40px;
    }
    .sticker-list-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-evenly;
      .single-sticker {
        width: 15%;
        display: inline-block;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>