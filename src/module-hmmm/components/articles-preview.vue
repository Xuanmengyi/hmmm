<template>
  <div class='container'>
    <el-dialog
  title="预览文章"
  :visible.sync="dialogVisible"
  width="48%">
  <div class="title"><h2>{{title}}</h2>
    <div>{{date|parseTimeByString}} &nbsp; {{username}}  &nbsp;<span class="el-icon-view"></span> &nbsp;{{visit}}</div>

  </div>
  <div id="content" v-html="articleBody"></div>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      articleBody: '',
      date: '',
      visit: '',
      title: '',
      username: ''
    }
  },
  methods: {
    show (row) {
      this.dialogVisible = true
      this.articleBody = row.articleBody
      this.date = row.createTime
      this.visit = row.visits
      this.title = row.title
      this.username = row.username
      // console.log(content.innerHTML)
    }
  }
}
</script>

<style scoped lang='less'>
.title{
  // margin-top: -30px;
  border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
}
.title h2{
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}
#content{
  background: #f5f5f5;
    padding: 10px;
}
</style>
