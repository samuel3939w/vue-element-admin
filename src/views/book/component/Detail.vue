<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">顯示幫助</el-button>
      <el-button v-loading="loading" type="success" @click="submitForm">{{
        isEdit ? "編輯電子書" : "新增電子書"
      }}</el-button>
    </sticky>
    <div class="detail-comtainer">
      <el-row>
        <Warning />
        <el-col :span="24">
          <EbookUpload
            :disabled="isEdit"
            :fileList="fileList"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              書名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="category"
                label="分類: "
                :label-width="labelWidth"
              >
                <el-select v-model="postForm.category" placeholder="請選擇分類">
                  <el-option label="ComputerScience" :value="1"></el-option>
                  <el-option label="SocialSciences" :value="2"></el-option>
                  <el-option label="Economics" :value="3"></el-option>
                  <el-option label="Education" :value="4"></el-option>
                  <el-option label="Engineering" :value="5"></el-option>
                  <el-option label="Environment" :value="6"></el-option>
                  <el-option label="Geography" :value="7"></el-option>
                  <el-option label="History" :value="8"></el-option>
                  <el-option label="Laws" :value="9"></el-option>
                  <el-option label="LifeSciences" :value="10"></el-option>
                  <el-option label="Literature" :value="11"></el-option>
                  <el-option label="Biomedicine" :value="12"></el-option>
                  <el-option
                    label="BusinessandManagement"
                    :value="13"
                  ></el-option>
                  <el-option label="EarthSciences" :value="14"></el-option>
                  <el-option label="MaterialsScience" :value="15"></el-option>
                  <el-option label="Mathematics" :value="16"></el-option>
                  <el-option
                    label="MedicineAndPublicHealth"
                    :value="17"
                  ></el-option>
                  <el-option label="Philosophy" :value="18"></el-option>
                  <el-option label="Physics" :value="19"></el-option>
                  <el-option
                    label="PoliticalScienceAndInternationalRelations"
                    :value="20"
                  ></el-option>
                  <el-option label="Psychology" :value="21"></el-option>
                  <el-option label="Statistics" :value="22"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="author"
                label="作者: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="publisher"
                label="出版社: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="language"
                label="語言: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.language" placeholder="語言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="rootFile"
                label="根文件: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="filePath"
                label="文件路徑: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路徑"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="unzipPath"
                label="解壓路徑: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解壓路徑"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="coverPath"
                label="封面路徑: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路徑"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="originalName"
                label="文件名稱: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名稱"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="cover"
                :label-width="labelWidth"
                label="封面："
              >
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img" />
                </a>
                <span v-else>無</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="contents"
                :label-width="labelWidth"
                label="目錄："
              >
                <div
                  v-if="contentsTree && contentsTree.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>無</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from "@/components/Sticky";
import Warning from "./Warning.vue";
import EbookUpload from "../../../components/EbookUpload";
import MdInput from "../../../components/MDinput";
import { createBook, updateBook, getBook } from "../../../api/book";

const defaultForm = {
  category: "",
  title: "",
  author: "",
  publisher: "",
  language: "",
  rootFile: "",
  cover: "",
  url: "",
  originalName: "",
  fileName: "",
  coverPath: "",
  filePath: "",
  unzipPath: "",
};

const fields = {
  category: "分類",
  title: "書名",
  author: "作者",
  publisher: "出版社",
  language: "語言",
  rootFile: "根文件",
  filePath: "文件路徑",
  unzipPath: "解壓路徑",
  coverPath: "封面路徑",
  originalName: "文件名稱",
};

export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput,
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + "必須填寫"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      postForm: defaultForm,
      fileList: [],
      labelWidth: "120px",
      contentsTree: [],
      rules: {
        category: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        rootFile: [{ validator: validateRequire }],
        filePath: [{ validator: validateRequire }],
        unzipPath: [{ validator: validateRequire }],
        coverPath: [{ validator: validateRequire }],
        originalName: [{ validator: validateRequire }],
      },
    };
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName;
      this.getBookData(fileName);
    }
  },
  props: {
    isEdit: Boolean,
  },
  methods: {
    beforeUpload(file) {
      if (!this.postForm.category) {
        this.$message({
          message: "請選擇該電子書的分類",
          type: "error",
        });
      }  
    },
    getBookData(fileName) {
      getBook(fileName).then((response) => {
        this.setData(response.data);
      });
    },
    onContentClick(data) {
      if (data.text) {
        window.open(data.text);
      }
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath,
      } = data;
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath,
      };
      this.contentsTree = contentsTree;
      if (this.isEdit) {
        this.fileList = [{ name: originalName || fileName, url }];
      }
    },
    setDefault() {
      //this.postForm = Object.assign({}, defaultForm);
      this.contentsTree = [];
      this.fileList = [];
      this.$refs.postForm.resetFields();
    },
    onUploadSuccess(data) {
      this.setData(data);
    },
    onUploadRemove() {
      this.setDefault();
    },
    showGuide() {},
    findCategoryText(category) {
      let categoryText=''
      const categoryList = [
        "ComputerScience",
        "SocialSciences",
        "Economics",
        "Education",
        "Engineering",
        "Environment",
        "Geography",
        "History",
        "Laws",
        "LifeSciences",
        "Literature",
        "Biomedicine",
        "BusinessandManagement",
        "EarthSciences",
        "MaterialsScience",
        "Mathematics",
        "MedicineAndPublicHealth",
        "Philosophy",
        "Physics",
        "PoliticalScienceAndInternationalRelations",
        "Psychology",
        "Statistics",
      ];
      categoryList.forEach((item, key) => {
        if (key + 1 === category) {
          console.log(item);
          categoryText = item;
        }
      });
      return categoryText;
    },
    submitForm() {
      const onSuccess = (response) => {
        const { msg } = response;
        this.$notify({
          title: "操作成功",
          message: msg,
          type: "success",
          duration: 2000,
        });
        this.loading = false;
      };
      if (!this.loading) {
        this.loading = true;
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            const book = { ...this.postForm };
            const categoryText = this.findCategoryText(book.category);
            book.categoryText=categoryText
            delete book.contentsTree;
            if (!this.isEdit) {
              createBook(book)
                .then((response) => {
                  onSuccess(response);
                  this.setDefault();
                })
                .catch(() => {
                  this.loading = false;
                });
            } else {
              updateBook(book)
                .then((response) => {
                  onSuccess(response);
                })
                .catch(() => {
                  this.loading = false;
                });
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message;
            this.$message({
              message,
              type: "error",
            });
            this.loading = false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-comtainer {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>