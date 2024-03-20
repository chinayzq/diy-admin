<template>
  <div class="sider-bar-component">
    <div class="logo-container">
      <img src="@/assets/images/project_logo.png" alt="" />
    </div>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-container"
      router
      :unique-opened="true"
    >
      <template v-for="(item, index) in menuList" :key="index">
        <el-menu-item v-if="!item.children" :index="item.router">
          <el-icon><component :is="item.icon" /></el-icon>
          {{ item.label }}</el-menu-item
        >
        <el-sub-menu v-else :index="item.router">
          <template #title
            ><el-icon><component :is="item.icon" /></el-icon
            >{{ item.label }}</template
          >
          <el-menu-item
            v-for="(sub, subIndex) in item.children"
            :key="subIndex"
            :index="sub.router"
            ><el-icon><component :is="sub.icon" /></el-icon
            >{{ sub.label }}</el-menu-item
          >
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
const defaultActive = ref("/model");
const router = useRouter();
const currentRoleId = localStorage.getItem("diy-role-id");
watch(
  () => router.currentRoute.value,
  (path) => {
    console.log("path", path);
    if (path?.meta?.detail) {
      defaultActive.value = path.meta.parrentPath;
    } else {
      defaultActive.value = path.path;
    }
  },
  { immediate: true, deep: true }
);
const defaultMenuList = ref([
  {
    label: "用户",
    router: "/user",
    icon: "User",
  },
  {
    label: "订单管理",
    router: "/order",
    icon: "Goods",
  },
  {
    label: "手机壳素材",
    icon: "Goods",
    router: "phoneCase",
    children: [
      {
        label: "机型",
        router: "/model",
        icon: "Menu",
      },
      {
        label: "贴纸",
        router: "/sticker",
        icon: "Discount",
      },
      {
        label: "模板",
        router: "/template",
        icon: "Grid",
      },
    ],
  },
  {
    label: "贴纸素材",
    icon: "Goods",
    router: "StickerCase",
    children: [
      {
        label: "机型",
        router: "/stickerModel",
        icon: "Menu",
      },
      {
        label: "贴纸",
        router: "/stickerList",
        icon: "Discount",
      },
      {
        label: "模板",
        router: "/stickerTemplate",
        icon: "Grid",
      },
    ],
  },
  {
    label: "优惠券",
    router: "/coupon",
    icon: "Ticket",
  },
  {
    label: "合作网红",
    router: "/partner",
    icon: "Avatar",
  },
  {
    label: "数据爬取",
    icon: "DataAnalysis",
    router: "dataCrawling",
    children: [
      {
        label: "TK列表",
        router: "/tk",
        icon: "PriceTag",
      },
      {
        label: "INS列表",
        router: "/ins",
        icon: "PriceTag",
      },
    ],
  },
  {
    label: "页面配置",
    router: "/pageConfig",
    icon: "Document",
  },
  {
    label: "数据字典",
    router: "/dictionary",
    icon: "List",
  },
]);
const menuList = ref([]);
const menuFilter = () => {
  if (currentRoleId === "2") {
    menuList.value = defaultMenuList.value.filter(
      (item) =>
        item.router === "/order" ||
        item.router === "/coupon" ||
        item.router === "/partner" ||
        item.router === "dataCrawling" ||
        item.router === "/tk" ||
        item.router === "/ins"
    );
  } else {
    menuList.value = defaultMenuList.value;
  }
};
menuFilter();
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
  // :deep(.el-menu-item) {
  //   font-weight: bold;
  //   &:hover {
  //     background: rgb(241, 239, 239);
  //   }
  // }
  // :deep(.el-menu-item.is-active) {
  //   background: #fff;
  //   color: #000;
  //   filter: drop-shadow(2px 4px 6px gray);
  //   span {
  //     // filter: drop-shadow(2px 4px 6px gray);
  //   }
  // }
}
</style>