<template>
  <div class='container'>
    <el-dialog
  :title="edit?'修改文章':'新增文章'"
  :visible.sync="dialogVisible"
  width="48%">
  <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
 <el-form-item label="文章标题：" prop="title">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="文章内容：" prop="articleBody">
    <Editor ref="edit" v-model="form.articleBody" :min-height="192" />
  </el-form-item>
  <el-form-item label="视频地址：">
    <el-input v-model="form.videoURL"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="edit?submitEdit():submitAdd()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/Editor'
import { add, update } from '@/api/hmmm/articles'
export default {
  components: {
    Editor
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        id: '',
        title: '',
        articleBody: '',
        videoURL: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        articleBody: [
          { required: true, validator: this.checkNoticeContent, trigger: 'blur' }
        ]
      },
      edit: false
    }
  },
  methods: {
    showAdd () {
      this.edit = false
      this.dialogVisible = true
    },
    async submitAdd () {
      this.$refs.ruleForm.validate()
      await add(this.form)
      this.$message({ message: '添加成功', type: 'success' })
      this.form.title = ''
      this.form.articleBody = ''
      this.form.videoURL = ''
      this.dialogVisible = false
      this.$emit('getarticles')
    },
    // 自定义校验规则（富文本）
    checkNoticeContent (rule, value, callback) {
      if (!value || !value.replaceAll(/<[^>]+>/g, '')) { return callback(new Error('请输入文章内容')) }
      return callback()
    },
    showEdit (row) {
      this.edit = true
      this.dialogVisible = true
      // console.log(row)
      this.form.id = row.id
      this.form.title = row.title
      this.form.articleBody = row.articleBody
      this.form.videoURL = row.videoURL
    },
    async submitEdit () {
      this.$refs.ruleForm.validate()
      await update(this.form)
      this.$message({ message: '修改成功', type: 'success' })
      delete this.form.id
      this.form.title = ''
      this.form.articleBody = ''
      this.form.videoURL = ''
      this.dialogVisible = false
      this.$emit('getarticles')
    },
    cancel () {
      this.dialogVisible = false
      delete this.form.id
      this.form.title = ''
      this.form.articleBody = ''
      this.form.videoURL = ''
    }
  }
}
</script>

<style scoped lang='less'></style>
