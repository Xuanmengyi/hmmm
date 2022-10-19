<template>
  <div class="container">
    <el-card class="box-card">
      <div class="btn_wrapper">
        <el-form :model="groupQuestionForm" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="关键词:" size="small">
                <el-input
                  v-model="keyword"
                  size="small"
                  placeholder="根据编号搜索"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-form-item size="small" style="text-align: right">
                <el-button size="small" @click="clearKeyword">清除</el-button>
                <el-button size="small" type="primary" @click="getGroupQuestion"
                  >搜索</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <data-alert :total="total"></data-alert>
        <el-table
          size="medium"
          :data="tableData"
          class="tableList"
          header-cell-style="background-color: #fafafa;"
          width="100%"
        >
          <el-table-column prop="id" label="编号"> </el-table-column>
          <el-table-column prop="questionType" label="题型">
            <template slot-scope="{ row }">
              {{ changeToLabel(row.questionType, questionType) }}
            </template>
          </el-table-column>
          <el-table-column prop="catalog" label="题目编号" width="220">
            <template slot-scope="{ row: { questionIDs } }">
              <div v-for="(item, index) in questionIDs" :key="index">
                <a
                  href="#"
                  style="color: rgb(0, 153, 255)"
                  @click="previewQuestionDialog(item.id)"
                >
                  {{ item.number }}</a
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="录入时间"> </el-table-column>
          <el-table-column prop="totalSeconds" label="答题时间(s)">
            <template slot-scope="{ row }">
              {{ row.totalSeconds / 60 }}
            </template>
          </el-table-column>
          <el-table-column prop="accuracyRate" label="正确率">
          </el-table-column>
          <el-table-column prop="userName" label="录入人"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                @click="del(row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: right; margin-top: 20px"
          background
          layout="prev, pager, next, sizes,jumper"
          :total="total"
          :page-sizes="[5, 10, 20, 30]"
          :page-size.sync="pagesize"
          :current-page.sync="page"
          @current-change="getGroupQuestion"
          @size-change="getGroupQuestion"
        >
        </el-pagination>
      </div>
      <previewDialog
        :previewDialog.sync="previewDialog"
        :currentRow="currentRow"
      ></previewDialog>
    </el-card>
  </div>
</template>

<script>
import dataAlert from './components/questions-choice/dataAlert.vue'
import previewDialog from './components/questions-choice/previewDialog.vue'

import groupQuestionList from '@/mock/questions.js'
import { questionType } from '@/api/hmmm/constants.js'

export default {
  name: 'questionsRandom',
  components: {
    dataAlert,
    previewDialog
  },
  mounted () {
    this.getGroupQuestion()
  },
  data () {
    return {
      groupQuestionForm: {},
      tableData: [],
      baseUrl: 'http://liufusong.top:7001/questions/randoms?',
      page: 1,
      pagesize: 20,
      keyword: '',
      total: 0,
      questionType,
      previewDialog: false,
      currentRow: {}
    }
  },
  methods: {
    getGroupQuestion () {
      const list = groupQuestionList.list
      console.log(this.page, this.pagesize)
      const res = list({
        url: this.baseUrl + `page=${this.page}&pagesize=${this.pagesize}&keyword=${this.keyword}`
      })
      console.log(res)
      this.total = Number(res.counts)
      this.tableData = res.items
    },
    clearKeyword () {
      this.keyword = ''
      this.getGroupQuestion()
    },
    async previewQuestionDialog (id) {
      const { detail } = await import('@/api/hmmm/questions.js')
      const data = { id }
      const res = await detail(data)
      this.currentRow = res.data

      this.previewDialog = true
    },
    del (id) {
      this.$confirm('您确认删除这个题目吗', '提示', {
        type: 'warning'
      }).then(res => {
        const deleteQuestion = groupQuestionList.delete
        deleteQuestion({
          body: JSON.stringify({
            id: id
          })
        })
        this.$message.success('操作成功')
        this.getGroupQuestion()
      })
    }
  },
  computed: {
    changeToLabel () {
      return function (columnType, type) {
        const find = type.find(item => {
          return item.value === Number(columnType)
        })
        const label = find ? find.label : ''
        return label
      }
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
  .el-input__inner {
    overflow: visible;
  }
}
</style>
