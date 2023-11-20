<template>
  <div class="page-config-dialog">
    <el-dialog
      v-model="dialogShow"
      :title="props?.dataset?.title"
      width="1000"
      :before-close="handleClose"
    >
    <div v-loading="dialogLoading">
      <div class="editor-container">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: 500px; width: 100%; overflow-y: hidden"
          v-model="formData.content"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
        />
      </div>
      <div class="button-container">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="saveHandler" v-loading="submitLoading">保存</el-button>
      </div>
    </div>
    </el-dialog> 
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css" // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { updateArticle, getArticleDetailById} from '@/api/article'
import { prop } from "dom7";

const formData = ref({
  id: null,
  title: null,
  content: '',
})

//#region wangEditor config
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      fieldName: "file",
      server: "/admin/api/story/file/upload",
      headers: {
        Authorization: localStorage.getItem('diy-admin-token')
      },
      customInsert(res, insertFn) {
        // 从 res 中找到 url，然后插入图片
        insertFn(res.data.url)
      }
    }
  }
}
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
//#endregion

const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
const dialogShow = computed(() => props.dataset.show)
const dialogLoading = ref(false)
watch(() => props.dataset, (data) => {
  if (data.datas.id) {
    dialogLoading.value = true
    getArticleDetailById(data.datas.id).then(res => {
      formData.value = res.data
    }).finally(() => {
      dialogLoading.value = false
    })
  }
}, {deep: true})
const emit = defineEmits();
const handleClose = () => {
  emit("close");
};
const submitLoading = ref(false)
const saveHandler = () => {
  submitLoading.value = true
  updateArticle({
    id: props.dataset.datas.id,
    title: props.dataset.datas.title,
    content: formData.value.content
  }).then(res => {
    console.log(res)
  }).finally(() => {
    submitLoading.value = false
  })
}
</script>

<style lang="less" scoped>
.page-config-dialog {
  .title-line {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .button-container {
    margin-top: 10px;
    text-align: right;
  }
}
</style>