<template>
  <div class="postList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">文章管理</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card" style="margin-top: 20px">
      <el-table :data="postList" style="width: 100%" border>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="title" label="标题" width="380">
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? "文章" : "视频" }}
          </template>
        </el-table-column>
        <el-table-column prop="user.nickname" label="作者"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="25"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getPostList } from "../apis/post.js";
export default {
  data() {
    return {
      postList: [],
      pageIndex: 1,
      pageSize: 4,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let res = await getPostList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
      this.postList = res.data.data;
      console.log(res);
    },
    // 切换每页所展示的数据
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.init();
    },
    // 改变数字
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
</style>