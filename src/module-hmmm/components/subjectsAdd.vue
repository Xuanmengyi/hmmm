<template>
  <div class="container">
    <el-dialog
      title="提示"
      :visible.sync="DialogVisible"
      width="30%"
      center
    >
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    DialogVisible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang='less'></style>
