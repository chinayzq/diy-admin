<template>
  <div class="template-list-page">
    <div class="filter-line">
      <el-button type="primary" @click="addNewTemplate">New Template</el-button>
    </div>
  </div>
</template>

<script setup name="template-list-page">
import { useRouter } from "vue-router";

const router = useRouter();
const addNewTemplate = () => {
  router.push({
    path: "/template/detail",
  });
};
</script>

<style lang="less" scoped>
.template-list-page {
  .filter-line {
    margin-bottom: 20px;
  }
}
</style>