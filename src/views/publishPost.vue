<template>
  <div class="postPublish">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><a href="javascript:;">文章管理</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card" style="margin-top: 30px">
      <el-form ref="form" :model="post" label-width="80px">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="post.title"></el-input>
        </el-form-item>
        <!-- 复选框 -->
        <el-form-item label="类型">
          <el-radio-group v-model="post.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group></el-form-item
        >
        <!-- 内容 -->
        <el-form-item label="内容">
          <VueEditor
            :config="config"
            v-if="post.type == 1"
            ref="myedit"
          ></VueEditor>
          <!-- 视频 -->
          <el-upload
            class="upload-demo"
            v-else
            :action="axios.defaults.baseURL + '/upload'"
            :on-success="successVideo"
            :headers="getToken()"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>

        <!-- 栏目 -->
        <el-form-item label="栏目">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCates"
            @change="handleCheckedCatesChange"
          >
            <el-checkbox
              v-for="item in cateList"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面">
          <el-upload
            :action="axios.defaults.baseURL + '/upload'"
            list-type="picture-card"
            :headers="getToken()"
            :on-remove="coverRemove"
            :on-success="successCover"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 发布按钮 -->
        <el-button type="primary" @click="publishPost">发布文章</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
import axios from "@/utils/request.js";
import { getCateList } from "@/apis/category.js";
import { publishThisPost } from "@/apis/post.js";
export default {
  data() {
    return {
      axios,
      post: {
        title: "", // 标题
        content: "", //文章内容，文章》》内容   视频 》》路径
        cover: [], // 封面，也是id集合
        type: 1, // 类型
        categories: [], // 文章所属栏目 id数组
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: axios.defaults.baseURL + "/upload",
          name: "file",
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert(axios.defaults.baseURL + res.data.data.url);
          },
        },
      },
      checkAll: false,
      checkedCates: [],
      isIndeterminate: false,
      cateList: [], // 栏目列表
      dialogImageUrl: "", // 封面
      dialogVisible: false,
    };
  },
  methods: {
    // 封面
    successCover(respose) {
      this.post.cover.push({ id: respose.data.id });
    },
    // 删除不想要的封面
    coverRemove(file) {
      let id = file.response.data.id;
      this.post.cover = this.post.cover.filter((v) => {
        return v.id != id;
      });
    },
    // 改变复选框 --- 全选
    handleCheckAllChange(val) {
      this.checkedCates = val
        ? this.cateList.map((v) => {
            return v.id;
          })
        : [];
      this.isIndeterminate = false;
    },
    // 改变复选框 --- 单选
    handleCheckedCatesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cateList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cateList.length;
    },
    // 上传视频
    successVideo(respose) {
      this.post.content = this.axios.defaults.baseURL + respose.data.url;
    },
    // 获取token
    getToken() {
      return { Authorization: localStorage.getItem("userManager") };
    },
    // 发布
    async publishPost() {
      console.log(this.post);
      // 当为文章时
      if (this.post.type == 1) {
        // 获取富文本里面的内容
        this.post.content = this.$refs.myedit.editor.root.innerHTML;
      }

      this.post.categories = this.checkedCates.map((v) => {
        return { id: v };
      });

      // 发布文章
      let res = await publishThisPost(this.post);
      console.log(res);
    },
  },
  components: {
    VueEditor,
  },
  async mounted() {
    // 获取栏目表
    let res = await getCateList();
    this.cateList = res.data.data;
    // 判断是否登录
    if (localStorage.getItem("userManager")) {
      this.cateList.splice(0, 2);
    } else {
      this.cateList.splice(0, 1);
    }
  },
};
</script>

<style lang="less" scoped>
</style>