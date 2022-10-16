<<template>
  <div>
    <dataAlert :total="total"></dataAlert>
  <el-table
    size="medium"
    :data="tableData"
    class="tableList"
    header-cell-style="background-color: #fafafa;"
    width="auto"
  >
    <el-table-column prop="number" label="试题编号" width="120">
    </el-table-column>
    <el-table-column prop="subject" label="学科" width="120"> </el-table-column>
    <el-table-column prop="catalog" label="目录" width="120"> </el-table-column>
    <el-table-column prop="questionType" label="题型" width="120">
      <template slot-scope="{ row }">
        {{ changeToLabel(row.questionType, questionType) }}
      </template>
    </el-table-column>
    <el-table-column prop="question" label="题干" width="280">
      <template slot-scope="{ row }">
        <p v-html="row.question"></p>
      </template>
    </el-table-column>
    <el-table-column prop="addDate" label="录入时间" width="180">
      <template slot-scope="{ row }">
        {{ row.addDate | parseTimeByString }}
      </template>
    </el-table-column>
    <el-table-column prop="difficulty" label="难度" width="80">
      <template slot-scope="{ row }">
        {{ changeToLabel(row.difficulty, difficulty) }}
      </template>
    </el-table-column>
    <el-table-column prop="creator" label="录入人" width="120">
    </el-table-column>
    <el-table-column prop="chkState" label="审核状态" width="120">
      <template slot-scope="{ row }">
        {{ changeToLabel(row.chkState, chkType) }}
      </template>
    </el-table-column>
    <el-table-column prop="chkRemarks" label="审核意见" width="150">
    </el-table-column>
    <el-table-column prop="chkUser" label="审核人" width="120">
    </el-table-column>
    <el-table-column prop="publishState" label="发布状态" width="150">
      <template slot-scope="{ row }">
        {{ publishState(row.chkState,row.publishState,publishType) }}
      </template>
    </el-table-column>

    <el-table-column prop="address" label="操作" width="200" fixed="right">
      <template slot-scope="{ row }">
        <el-button type="text" size="small" @click="previewQuestion(row)">预览</el-button>
        <el-button type="text" size="small" :disabled="row.chkState===1 || row.chkState===2" @click="examineQuestion(row)">审核</el-button>
        <el-button type="text" size="small" :disabled="row.publishState===1" @click="edit(row)">修改</el-button>
        <el-button type="text" size="small" @click="isOnShelves(row)">{{row.publishState===0? '上架':'下架'}}</el-button>
        <el-button type="text" size="small" :disabled="row.publishState===1" @click="del(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
    style="text-align: right; margin-top: 20px"
    background
    layout="prev, pager, next, sizes,jumper"
    :total="total"
    :page-sizes="[5, 10, 20, 30]"
    :page-size.sync="testData.pagesize"
    :current-page.sync="testData.page"
    @current-change="getTestList"
    @size-change="getTestList"

  >
  </el-pagination>
  <previewDialog :previewDialog.sync="previewDialog" :currentRow="currentRow" ></previewDialog>
<el-dialog
  title="题目审核"
  :visible.sync="examineDialog"
  width="20%"
  class="examineDialog"
  :before-close="cancelExaminine">
  <el-form :model="examineForm" ref="examineForm" :rules="examineRules">
<el-form-item>
  <el-radio v-model="examineForm.chkState" :label="Number(1)">通过</el-radio>
  <el-radio v-model="examineForm.chkState" :label="Number(2)">拒绝</el-radio>
</el-form-item>
<el-form-item prop="chkRemarks">
<el-input
  type="textarea"
  autosize
  placeholder="请输入审查意见"
  style="min-height: 32px;"
  v-model="examineForm.chkRemarks">
</el-input>
</el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelExaminine">取 消</el-button>
    <el-button type="primary" @click="examineConfirm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { choice } from '@/api/hmmm/questions.js'
import { questionType, difficulty, chkType, publishType } from '@/api/hmmm/constants.js'
import dataAlert from './dataAlert.vue'
import previewDialog from './previewDialog.vue'
export default {
  name: 'selectedTestTable',
  components: {
    dataAlert,
    previewDialog
  },
  data () {
    return {
      tableData: [],
      testData: {
        page: 1,
        pagesize: 5
      },
      examineRules: {
        chkRemarks: [{
          required: true,
          message: '审核意见不能为空',
          trigger: 'clear'
        }]
      },
      currentRow: {},
      questionType,
      difficulty,
      chkType,
      publishType,
      total: 0,
      previewDialog: false,
      examineDialog: false,
      examineForm: {
        id: 0,
        chkState: 1,
        chkRemarks: ''
      }
    }
  },
  created () {
    this.getTestList()
  },
  methods: {
    async getTestList () {
      const { data } = await choice({ ...this.testData, chkType: this.chkState })
      console.log(data.items)
      this.tableData = data.items
      this.total = data.counts
    },
    async previewQuestion (row) {
      const { detail } = await import('@/api/hmmm/questions.js')
      const data = { id: row.id }
      const res = await detail(data)
      this.currentRow = res.data

      this.previewDialog = true
    },
    async examineConfirm () {
      try {
        this.$refs.examineForm.validateField('chkRemarks')
        const { choiceCheck } = await import('@/api/hmmm/questions.js')
        const res = await choiceCheck(this.examineForm)
        console.log(res)
        this.cancelExaminine()
        this.$message.success('操作成功')
        this.getTestList()
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    cancelExaminine () {
      this.$refs.examineForm.resetFields()
      this.examineDialog = false
    },
    examineQuestion (row) {
      this.examineForm.id = row.id
      this.examineDialog = true
    },
    edit (row) {
      this.$router.push({
        name: 'questions-new',
        params: {
          row
        }
      })
    },
    async isOnShelves (row) {
      try {
        await this.$confirm(`您确认${row.publishState === 0 ? '上架' : '下架'}这个题目吗`, '提示', {
          type: 'warning'
        })
        const { choicePublish } = await import('@/api/hmmm/questions.js')
        const data = { id: row.id, publishState: row.publishState === 0 ? 1 : 0 }
        await choicePublish(data)
        this.$message.success('操作成功')
        this.getTestList()
      } catch (error) {
        console.log(error)
      }
    },
    async del (row) {
      try {
        await this.$confirm('您确认删除这个题目吗', '提示', {
          type: 'warning'
        })
        const { remove } = await import('@/api/hmmm/questions.js')
        const data = { id: row.id }
        await remove(data)
        this.$message.success('操作成功')
        this.getTestList()
      } catch (error) {
        this.$message.error('操作失败')
      }
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
    },
    publishState () {
      return function (chkState, publishState, publishType) {
        const find = publishType.find(item => {
          return item.value === `${publishState}${chkState}`
        })
        const label = find ? find.label : '待发布'
        return label
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__header {
  width: 1880px !important;
}
::v-deep .el-table__body {
  width: 1880px !important;
}
::v-deep .examineDialog {
  .el-form-item__content {
    margin-left: 0px !important;
  }
  .el-textarea__inner {
    height: 54px !important;
  }
}
// ::v-deep.el-table__body-wrapper {
//   background-color: #f7f6ff;
// }
// ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//   width: 10px !important;
//   height: 10px !important;
// }
// ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
//   z-index: 1;
// }
::v-deep .el-scrollbar__view {
  white-space: nowrap;
}
::v-deep .el-table__body-wrapper {
  overflow: auto !important;
}
</style>
