<template>
  <div class="template-dialog-component">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="800"
      top="65px"
      :before-close="handleClose"
    >
      <div class="list-container" v-loading="listLoading">
        <el-row :gutter="48" v-if="listDatas.length">
          <el-col :span="8" v-for="item in listDatas" :key="item.templateName">
            <div class="single-template">
              <div class="title-line">
                <span>
                  {{ item.templateName }}
                </span>
              </div>
              <div class="image-container">
                <img src="@/assets/images/template_demo.png" alt="" />
              </div>
              <div class="single-operation">
                <el-button type="primary" @click="jumpToTemplateDetail(item)"
                  >Edit</el-button
                >
                <el-button type="danger" @click="deleteHandler(item)"
                  >Delete</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="no-data">
          <span> There is currently no data available, </span>
          <span class="link-span" @click="jumpToTemplateDetail">
            go to add a template!
          </span>
        </div>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="handleClose">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTemplateList, deleteTemplate } from "@/api/template";
import { useRouter } from "vue-router";
const emit = defineEmits();
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
watch(
  props.dataset,
  (datas) => {
    if (datas.typeCode) {
      getTemplate();
    }
  },
  {
    deep: true,
  }
);

const listLoading = ref(false);
const listDatas = ref([]);
const demoList = [
  {
    templateName: "xxx1",
    templateId: "1",
  },
  {
    templateName: "xxx2",
  },
  {
    templateName: "xxx3",
  },
  {
    templateName: "xxx4",
  },
  {
    templateName: "xxx5",
  },
];
const getTemplate = () => {
  listLoading.value = true;
  getTemplateList({
    typeCode: props.dataset.typeCode,
  })
    .then((res) => {
      console.log(res);
      if (res.code === 200) {
        listDatas.value = res.data;
      } else {
        listDatas.value = demoList;
      }
    })
    .finally(() => {
      listLoading.value = false;
    });
};

const deleteHandler = ({ templateId }) => {
  ElMessageBox.confirm("Are you sure to delete this data?", "warning", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      deleteTemplate({ templateId }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "delete successful！",
            type: "success",
          });
          getTemplate();
        }
      });
    })
    .catch(() => {
      console.log("cancel the delete！");
    });
};

const router = useRouter();
const jumpToTemplateDetail = ({ templateId }) => {
  router.push({
    path: "/template/detail",
    query: {
      templateId,
    },
  });
};
const handleClose = (flag) => {
  listDatas.value = [];
  emit("close", flag);
};
</script>

<style lang="less" scoped>
.template-dialog-component {
  .list-container {
    min-height: 200px;
    .single-template {
      margin-bottom: 20px;
      position: relative;
      .title-line {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
        text-align: center;
      }
      .single-operation {
        display: none;
        position: absolute;
        right: 0;
        top: 25px;
      }
      &:hover {
        .single-operation {
          display: inline-block;
        }
      }
    }
    .no-data {
      height: 100px;
      line-height: 100px;
      text-align: center;
      .link-span {
        color: #409eff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .button-container {
    text-align: right;
  }
}
</style>