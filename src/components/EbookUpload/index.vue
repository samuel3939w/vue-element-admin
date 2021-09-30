<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        請將電子書拖入或<em>點擊上傳</em>
      </div>
      <div v-else class="el-upload__text">圖書已上傳</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { removeBook } from "../../api/book";

export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`,
    };
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`,
      };
    },
  },
  methods: {
    beforeUpload(file) {
      this.$emit("beforeUpload", file);
    },
    onSuccess(response, file) {
      const { code, msg, data } = response;
      if (code === 0) {
        this.$message({
          message: msg,
          type: "success",
        });
        this.$emit("onSuccess", data);
      } else {
        this.$message({
          message: (msg && `上傳失敗, 失敗原因: ${msg}`) || "上傳失敗",
          type: "error",
        });
        this.$emit("onError", file);
      }
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message);
      this.$message({
        message:
          (errMsg && errMsg.msg && `上傳失敗, 失敗原因 : ${errMsg.msg}`) ||
          "上傳失敗",
        type: "error",
      });
      this.$emit("onError", err);
    },
    onRemove(file) {
      removeBook(file.response.data)
        .then((response) => {
          const { msg } = response;
          this.$message({
            message: msg,
            type: "success",
          });
          this.$emit("onRemove");
        })
        .catch((e) => {
          this.$emit("onRemove");
          console.log(e);
        });
    },
    onExceed() {
      this.$message({
        message: "每次只能上傳一本電子書",
        type: "warning",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>