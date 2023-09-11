<template>
  <div class="top-bar-component">
    <div class="left-part">
      {{ currentMenu }}
    </div>
    <div class="right-part">
      <img
        src="@/assets/images/log_out_icon.png"
        @click="logoutHandler"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { loginOutRequest } from "@/api/user.js";
import axios from "axios";
const currentMenu = ref(null);
const router = useRouter();
watch(
  () => router.currentRoute.value,
  (path) => {
    currentMenu.value = path.meta.title;
  },
  { deep: true, immediate: true }
);
const logoutHandler = () => {
  ElMessageBox.confirm("是否确定退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      // 清除缓存
      clearLocalStore();
      router.push("/login");
    })
    .catch(() => {
      console.log("取消退出登录！");
    });
};
const clearLocalStore = () => {
  loginOutRequest().then(() => {
    axios.defaults.headers["token"] = "";
  });
};
</script>

<style lang="less" scoped>
.top-bar-component {
  background: #fff;
  height: 60px;
  color: #000;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-part {
    font-size: 18px;
    font-weight: bold;
    color: #152c5b;
    font-family: Source Han Sans SC-Bold, Source Han Sans SC;
    filter: drop-shadow(2px 2px 2px gray);
  }
  .right-part {
    img {
      filter: invert(1);
      cursor: pointer;
    }
  }
}
</style>