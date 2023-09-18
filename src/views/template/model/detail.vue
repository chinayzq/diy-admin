<template>
  <div class="template-detail-component">
    <div class="basic-image-part">
      <div class="common-title">Base Map Selection</div>
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
            class="singl-model-image"
            v-for="item in modelImageList"
            :key="item.url"
            @click="setSelectImage('model', item.url)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>no pictures</div>

        <div class="item-title">Case Image</div>
        <div class="model-image-list" v-if="caseImageList.length">
          <div
            class="singl-model-image"
            v-for="item in caseImageList"
            :key="item.url"
            @click="setSelectImage('case', item.url)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>no pictures</div>

        <div class="item-title">Mask Image</div>
        <div class="model-image-list" v-if="maskImage.length">
          <div
            class="singl-model-image"
            v-for="item in maskImage"
            :key="item.url"
            @click="setSelectImage('case', item.url)"
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
        <div class="position-container">
          <img
            class="single-graph-image"
            v-if="selectModelImage"
            :src="selectModelImage"
            alt=""
          />
          <img
            class="single-graph-image"
            v-if="selectCaseImage"
            :src="selectCaseImage"
            alt=""
          />
          <img
            class="single-graph-image"
            v-if="selectMaskImage"
            :src="selectMaskImage"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="sticker-part">
      <div class="common-title">Stickers</div>
      <el-collapse accordion>
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
import { ref, onBeforeMount } from "vue";
import { getPhoneColor, getModelList } from "@/api/model";
import { getStickerList } from "@/api/sticker";
import { getItemByClassId } from "@/api/dictionary";
import { useRoute } from "vue-router";
onBeforeMount(() => {
  initModelList();
  initOneLevelOptions();
  initStickerList();
});

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
      console.log("modelOptions.value", modelOptions.value);
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
          .map((item) => item.colorUrlList)[0];
        caseImageList.value = res.data
          .filter((item) => item.type === "2")
          .map((item) => item.colorUrlList)[0];
        maskImage.value = res.data
          .filter((item) => item.type === "3")
          .map((item) => item.colorUrlList)[0];
        console.log("maskImage.value", maskImage.value);
      } else {
        modelImageList.value = [];
        caseImageList.value = [];
        maskImage.value = [];
      }
    })
    .finally(() => {
      imageContainerLoading.value = false;
    });
};

const selectModelImage = ref(null);
const selectCaseImage = ref(null);
const selectMaskImage = ref(null);
const setSelectImage = (type, url) => {
  switch (type) {
    case "model":
      selectModelImage.value = url;
      break;
    case "case":
      selectCaseImage.value = url;
      break;
    case "mask":
      selectMaskImage.value = url;
      break;
  }
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
</script>

<style lang="less" scoped>
.template-detail-component {
  height: 100%;
  display: flex;
  .basic-image-part {
    flex: 1;
    margin-right: 20px;
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
      .singl-model-image {
        width: 15%;
        padding: 0 5%;
        margin: 10px 0;
        img {
          width: 100%;
        }
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
      .position-container {
        // width: 300px;
        height: 90%;
        width: 350px;
        position: relative;
        .single-graph-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
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