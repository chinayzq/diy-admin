<template>
  <div class="sider-bar-component">
    <div class="logo-container">LOGO</div>
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
  .logo-container {
    height: 90px;
    width: 100%;
    background: #f7e0e0;
    color: #4f4f4f;
    font-size: 20px;
    font-family: fantasy;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-menu-container {
    height: calc(100% - 90px);
  }
  :deep(.el-menu-item) {
    font-weight: bold;
  }
  :deep(.el-menu-item.is-active) {
    border-right: 2px solid #409eff;
    background: #f4f7ff;
    color: #2a61ff;
  }
}
</style>