<template>
  <!-- <div class="container">{{ this.row.id ? '修改进来的' : '新增进来的' }}</div> -->
  <div class="container questionNew">
    <el-card> </el-card>
  </div>
</template>

<script>
export default {
  name: 'questionEnter',
  data () {
    return {
      row: this.$route.params.row
    }
  }
}
</script>

<style scoped lang='less'>
.questionNew {
  padding: 20px;
}
</style>
