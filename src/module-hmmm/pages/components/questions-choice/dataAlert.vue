<template>
  <el-alert
    class="alertIcon"
    type="info"
    :title="`数据一共${total}条`"
    style="margin-bottom: 15px"
    effect="light"
    show-icon
  >
  </el-alert>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    }
  }

}
</script>

<style>
</style>
