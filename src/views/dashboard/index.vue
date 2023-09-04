<template>
  <div class="dashboard-component">
    <el-button type="primary" @click="jump">anniu</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const jump = () => {
  router.push("/setting");
};
</script>

<style lang="less" scoped>
.dashboard-component {
  color: #fff;
}
</style>