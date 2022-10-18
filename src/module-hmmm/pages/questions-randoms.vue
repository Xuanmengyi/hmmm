<template>
  <div class="container">
    <el-card class="box-card">
      <div class="btn_wrapper">
        <el-form :model="groupQuestionForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="关键字" class="keywords" size="small">
                <el-input v-model="groupQuestionForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-row> <el-col :span="6" offset="12">2</el-col> </el-row>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      groupQuestionForm: {}
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 0 10px;
  margin: 10px 0;
}
::v-deep .keywords {
  .el-form-item__label {
    width: 80px;
  }
  .el-form-item__content {
    margin-left: 32px;
  }
}
</style>
