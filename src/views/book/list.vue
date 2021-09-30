<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="書名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px; margin-left: 5px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分類"
        class="filter-item"
        style="width: 200px; margin-left: 5px"
        clearable
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label + '(' + item.num + ')'"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查詢
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @change="changeShowCover"
      >
        顯示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      :data="this.list"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="書名" width="150" align="center">
        <template slot-scope="{ row: { titleWrapper } }">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { authorWrapper } }">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="出版社"
        prop="publisher"
        align="center"
        width="150"
      />
      <el-table-column
        label="分類"
        prop="categoryText"
        align="center"
        width="100"
      />
      <el-table-column label="語言" prop="language" align="center" />
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img :src="scope.row.cover" style="width: 120px; height: 180px" />
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="fileName"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { fileName } }">
          <span>{{ fileName || "無" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="文件路徑"
        prop="filePath"
        align="center"
        width="100"
      />
      <el-table-column
        label="封面路徑"
        prop="coverPath"
        align="center"
        width="100"
      />
      <el-table-column
        label="解壓路徑"
        prop="unzipPath"
        align="center"
        width="100"
      />
      <el-table-column
        label="上傳人"
        prop="createUser"
        align="center"
        width="100"
      />
      <el-table-column
        label="上傳時間"
        prop="createDt"
        align="center"
        width="100"
      />
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          />
          <el-button
            style="color: #f56c6c"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination";
import waves from "../../directive/waves";
import { getCategory, listBook, deleteBook } from "../../api/book";
import { parseTime } from "@/utils";

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listQuery: {},
      showCover: false,
      categoryList: [],
      listLoading: false,
      list: [],
      total: 0,
    };
  },
  created() {
    this.parseQuery();
  },
  mounted() {
    this.getList();
    this.getCategoryList();
  },
  methods: {
    parseQuery() {
      const listQuery = { page: 1, pageSize: 20 };
      this.listQuery = { ...listQuery, ...this.listQuery };
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color:#1890ff">${value}</span>`;
      }
      if (!this.listQuery[k]) {
        return v;
      } else {
        return v.replace(new RegExp(this.listQuery[k], "ig"), (value) =>
          highlight(value)
        );
      }
    },
    getList() {
      this.listLoading = true;
      listBook(this.listQuery).then((response) => {
        const { list, count } = response.data;
        this.list = list;
        this.total = count;
        this.listLoading = false;
        this.list.forEach((book) => {
          book.titleWrapper = this.wrapperKeyword("title", book.title);
          book.authorWrapper = this.wrapperKeyword("author", book.author);
          book.createDt = book.createDt
            ? parseTime(book.createDt, "{y}-{m}-{d} {h}:{i}")
            : "無";
        });
      });
    },
    sortChange(data) {
      console.log("sortChange", data);
      const { prop, order } = data;
      this.sortBy(prop, order);
      this.handleFilter();
    },
    sortBy(prop, order) {
      if (order === "ascending") {
        this.listQuery.sort = `+${prop}`;
      } else {
        this.listQuery.sort = `-${prop}`;
      }
    },
    getCategoryList() {
      getCategory().then((response) => {
        this.categoryList = response.data;
      });
    },
    handleFilter() {
      console.log("handleFilter", this.listQuery);
      this.getList();
    },
    handleCreate() {
      this.$router.push("/book/create");
    },
    changeShowCover(value) {
      this.showCover = value;
    },
    handleUpdate(row) {
      this.$router.push(`/book/edit/${row.fileName}`);
    },
    handleDelete(row) {
      this.$confirm("此操作將永久刪除電子書,是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBook(row.fileName).then((response) => {
          this.$notify({
            title: "成功",
            message: response.msg || "刪除成功",
            type: "success",
            duration: 2000,
          });
          this.handleFilter();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>