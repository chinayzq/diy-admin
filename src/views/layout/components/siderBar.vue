<template>
  <div class="sider-bar-component">
    <div class="logo-container">
      <img src="@/assets/images/project_logo.png" alt="" />
    </div>
    <el-menu :default-active="defaultActive" class="el-menu-container" router>
      <el-menu-item
        v-for="item in menuList"
        :key="item.router"
        :index="item.router"
      >
        <el-icon><icon-menu /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
const defaultActive = ref("/model");
const router = useRouter();
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    defaultActive.value = toPath;
  },
  { immediate: true, deep: true }
);
const menuList = ref([
  {
    label: "Model",
    router: "/model",
  },
  {
    label: "Material",
    router: "/material",
  },
  {
    label: "Template",
    router: "/template",
  },
  {
    label: "Dictionary",
    router: "/dictionary",
  },
]);
</script>

<style lang="less" scoped>
.sider-bar-component {
  width: 190px;
  height: 100%;
  color: #000;
  background: #fff;
  .logo-container {
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 11px 4px #555);
    img {
      width: 155px;
    }
  }
  .el-menu-container {
    height: calc(100% - 90px);
  }
  :deep(.el-menu-item) {
    font-weight: bold;
    &:hover {
      background: rgb(241, 239, 239);
    }
  }
  :deep(.el-menu-item.is-active) {
    background: #fff;
    color: #000;
    filter: drop-shadow(2px 4px 6px gray);
    span {
      filter: drop-shadow(2px 4px 6px gray);
    }
  }
}
</style>