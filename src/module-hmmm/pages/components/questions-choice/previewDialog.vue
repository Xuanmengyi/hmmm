<template>
  <el-dialog
    title="题目预览"
    :visible.sync="previewDialog"
    width="900"
    :before-close="handleClose"
    class="previewDialog"
  >
    <el-row>
      <el-col :span="6"
        >【题型】：{{
          currentRow.questionType === '1'
            ? '单选题'
            : currentRow.questionType === '2'
            ? '多选题'
            : '简答题'
        }}</el-col
      >
      <el-col :span="6">【编号】：{{ currentRow.id }}</el-col>
      <el-col :span="6"
        >【难度】：{{
          currentRow.difficulty === '1'
            ? '简单'
            : currentRow.questionType === '2'
            ? '一般'
            : '困难'
        }}</el-col
      >
      <el-col :span="6">【标签】：{{ currentRow.tags }}</el-col>
      <el-col :span="6">【学科】：{{ currentRow.subjectName }}</el-col>
      <el-col :span="6">【目录】：{{ currentRow.directoryName }}</el-col>
      <el-col :span="6">【方向】：{{ currentRow.direction }}</el-col>
    </el-row>
    <hr />
    【题干】：
    <div class="question" style="color: blue">
      <p v-html="currentRow.question"></p>
    </div>
    <div class="options" v-show="currentRow.questionType === '1'">
      <div class="questionType" style="padding-bottom: 5px">
        单选题 选项：（以下选中的选项为正确答案）
      </div>
      <div
        class="radioOptions"
        style="padding: 8px 0px"
        v-for="item in currentRow.options"
        :key="item.id"
      >
        <el-radio
          v-model="item.isRight"
          :label="1"
          :disabled="item.isRight !== 1"
          >{{ item.title }}</el-radio
        >
      </div>
    </div>
    <div class="options" v-show="currentRow.questionType === '2'">
      <div class="questionType" style="padding-bottom: 5px">
        多选项 选项：（以下选中的选项为正确答案）
      </div>
      <div
        class="checkedOption"
        style="padding: 8px 0px"
        v-for="item in currentRow.options"
        :key="item.id"
      >
        <el-checkbox :checked="Boolean(item.isRight)" :label="item.isRight">{{
          item.title
        }}</el-checkbox>
      </div>
      <!-- <div class="checkedOption" style="padding: 8px 0px">
          <el-checkbox label="备选项2"></el-checkbox>
        </div>
        <div class="checkedOption" style="padding: 8px 0px">
          <el-checkbox label="备选项3"></el-checkbox>
        </div> -->
    </div>
    <hr />
    【参考答案】：
    <el-button type="danger" size="small" @click="isDisplay = false"
      >视频答案预览</el-button
    >
    <div
      :class="`video ${
        isDisplay || currentRow.videoURL === '' ? 'isDisplay' : ''
      }`"
    >
      <video type="video/mp4" :src="currentRow.videoURL" controls></video>
    </div>
    <hr />
    【答案解析】：
    <div class="answerAnalysis" style="display: inline-block">
      <p v-html="currentRow.answer"></p>
    </div>
    <hr />
    【题目备注】：{{ currentRow.remarks }}
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'previewDialog',
  props: {
    previewDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      radioOptions: '1',
      isDisplay: true,
      checked: 1
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:previewDialog', false)
    }
  }
}
</script>

<style scoped lang="scss">
.previewDialog {
  .el-col {
    padding: 10px 0;
  }
}
.video {
  width: 400px;
  height: 300px;
  video {
    width: 100%;
    height: 100%;
  }
}
.isDisplay {
  display: none !important;
}
</style>
