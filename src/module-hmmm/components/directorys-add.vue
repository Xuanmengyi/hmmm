<template>
  <div class='container'>
    <el-dialog :title="edit?'修改目录':'新增目录'" :visible.sync="dialogVisible" width="24%" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
         <el-form-item label="所属学科">
    <el-select v-model="form.subjectID"  placeholder="请选择" style="width:283px">
      <el-option v-for="(item,index) in subjectList" :key="index" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="目录名称" prop="directoryName">
    <el-input v-model="form.directoryName"></el-input>
  </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit?submitEdit():submitAdd()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { simple } from '../../api/hmmm/subjects'
import { add, update } from '../../api/hmmm/directorys'
export default {
  created () {
    this.getSubjectList()
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        subjectID: '',
        directoryName: '',
        id: ''
      },
      subjectList: [],
      edit: false,
      rules: {
        directoryName: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    addNew () {
      this.edit = false
      this.dialogVisible = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async getSubjectList () {
      const { data } = await simple()
      this.subjectList = data
    },
    edits (row) {
      this.edit = true
      this.dialogVisible = true
      console.log(row)
      this.form.subjectID = row.subjectID
      this.form.directoryName = row.directoryName
      this.form.id = row.id
      // console.log(this.form)
    },
    async submitAdd () {
      try {
        this.$refs.form.validate()
        await add(this.form)
        this.$message({ message: '添加成功', type: 'success' })
        this.dialogVisible = false
        this.form.subjectID = ''
        this.form.directoryName = ''
        // this.form.id = ''
        this.$emit('getDirect')
      } catch (err) {
        console.log(err)
      }
    },
    async submitEdit (row) {
      // console.log(row)
      this.$refs.form.validate()
      try {
        await update(this.form)
        this.$message({ message: '修改成功', type: 'success' })
        delete this.form.id
        this.dialogVisible = false
        this.form.subjectID = ''
        this.form.directoryName = ''
        this.$emit('getDirect')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.el-dialog__footer{
    text-align: center;
}</style>
