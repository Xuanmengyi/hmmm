<template>
  <el-pagination
    style="text-align: right; margin-top: 20px"
    background
    layout="prev, pager, next, sizes,jumper"
    :total="total"
    :page-sizes="[5, 10, 20, 30]"
    :page-size="5"
  >
  </el-pagination>
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
