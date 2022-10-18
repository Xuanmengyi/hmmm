<template>
  <div class="container">
    <el-dialog
      :title="title"
      :before-close="handleClose"
      :visible.sync="diVisible"
      width="20%"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item style="margin-left: -40px" label="学科名称">
          <el-input
            v-model="formData.subjectName"
            placeholder="请输入学科名称"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: -40px" label="是否显示">
          <el-switch
            v-model="q"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="btn"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { update, add } from '@/api/hmmm/subjects.js'
export default {
  props: {
    diVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formData: {
        subjectName: '',
        isFrontDisplay: 0,
        id: ''
      },
      q: true
    }
  },
  computed: {
    title () {
      return this.formData.id ? '修改学科' : '新增学科'
    },
    btn () {
      if (this.formData.isFrontDisplay === 0) {
        /* eslint-disable */
        return this.q = false
      } else {
        return this.q = true
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:diVisible', false)
      this.formData = {
        subjectName: ''
      }
    },
    async submit () {
      this.formData.id ? await update(this.formData) : await add(this.formData)
      this.$emit('refreshList')
      this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
      this.handleClose()
    }
  }

}
</script>

<style scoped lang='less'>
</style>
