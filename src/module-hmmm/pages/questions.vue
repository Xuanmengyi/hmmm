<template>
  <div class="container" sytle="padding:0 10px;">
    <el-card class="box-card">
      <div class="btn_wrapper">
        <span style="font-size: 12px; color: pink">
          说明：目前支持学科和关键字条件筛选
        </span>
        <el-button
          type="success"
          size="small"
          @click="$router.push('/questions/new')"
        >
          <i class="el-icon-edit"></i>
          <span>新增试题</span>
        </el-button>
      </div>
      <el-form ref="selectedTestForm">
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="学科">
              <el-select
                v-model="formData.subjectID"
                placeholder="请选择"
                @change="getCurrentSubject"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in subjectSimple"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="二级目录">
              <el-select v-model="formData.catalogID" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in directorysSimple"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="标签">
              <el-select v-model="formData.tags" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in tagsSimple"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="关键词">
              <el-input
                placeholder="根据题干搜索"
                v-model="formData.keyword"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="试题类型">
              <el-select v-model="formData.questionType" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.label"
                  v-for="item in questionType"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="难度">
              <el-select v-model="formData.difficulty" placeholder="请选择">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in difficulty"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="方向">
              <el-select v-model="formData.direction" placeholder="请选择">
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in direction"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="录入人">
              <el-select v-model="formData.creatorID" placeholder="请选择">
                <el-option
                  :label="item.username"
                  :value="item.id"
                  v-for="item in usersSimple"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="题目备注">
              <el-input v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="企业简称">
              <el-input v-model="formData.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="城市">
              <el-select
                class="citySelect"
                style="width: 48%; margin-right: 2%"
                @change="getSubArea"
                v-model="formData.province"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in provinces"
                  :key="index"
                ></el-option>
              </el-select>
              <el-select
                class="citySelect"
                style="width: 50%"
                v-model="formData.city"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in subArea"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="text-align: right">
              <el-button size="small" @click="clearForm">清除</el-button>
              <el-button size="small" type="primary" @click="searchQuestion"
                >搜索</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="24"
        ><div class="grid-content">
          <i
            class="el-icon-info"
            style="color: #909399; margin-top: 10px; margin-left: 23px"
          ></i>
          <span class="wenzi">共{{ this.counts }}条记录</span>
        </div></el-col
      >
      <!-- <table></table> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="number" label="试题编号" width="140">
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="180">
        </el-table-column>
        <el-table-column
          prop="catalog"
          label="目录"
          width="180"
        ></el-table-column>
        <el-table-column prop="questionType" label="题型" width="160">
          <template slot-scope="{ row }">
            {{ changeToLabel(row.questionType, questionType) }}
          </template>
        </el-table-column>
        <el-table-column prop="question" label="题干" width="220">
          <template slot-scope="{ row }">
            <span v-html="row.question"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="addDate"
          label="录入时间"
          width="200"
        ></el-table-column>
        <el-table-column prop="difficulty" label="难度" width="200">
          <template slot-scope="{ row }">
            {{ changeToLabel(row.difficulty, difficulty) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="creator"
          label="录入人"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              style="background: #ecf5ff; color: #409eff"
              icon="el-icon-view"
              circle
              @click="previewQuestion(row)"
            ></el-button>
            <el-button
              style="background: #f0f9eb; color: #67c23a"
              type="success"
              icon="el-icon-edit"
              circle
              @click="
                $router.push({
                  name: 'questions-new',
                  params: {
                    id: row.id,
                  },
                })
              "
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              style="background: #fef0f0; color: #f56c6c"
              circle
              @click="delBtn(row.id)"
            ></el-button>
            <el-button
              style="background: #fdf6ec; color: #f6ce8b"
              type="success"
              icon="el-icon-check"
              circle
              @click="addBtn(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-top: 20px; margin-bottom: 20px"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="tableValue.pagesize"
        layout="prev, pager, next,sizes,  jumper"
        :total="counts"
        :current-page.sync="tableValue.page"
        @current-change="handleList"
        @size-change="handleList"
      >
      </el-pagination>
    </el-card>
    <PreviewDialog
      :previewDialog.sync="previewDialog"
      :currentRow="currentRow"
    />
  </div>
</template>

<script>
import { simple } from '@/api/hmmm/subjects.js'
import { questionType, difficulty, direction } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { list, remove, choiceAdd } from '@/api/hmmm/questions.js'
import PreviewDialog from './components/questions-choice/previewDialog.vue'
export default {
  name: 'questionBasis',
  components: { PreviewDialog },
  data () {
    return {
      counts: 0,
      formData: {},
      questionType,
      difficulty,
      direction,
      currentTags: 0,
      provinces: [],
      subArea: [],
      activeName: 'first',
      subjects: [],
      subjectSimple: [],
      tagsSimple: [],
      directorysSimple: [],
      usersSimple: [],
      tableData: [],
      tableValue: {
        page: 1,
        pagesize: 10
      },
      previewDialog: false,
      currentRow: {}
    }
  },
  created () {
    this.getDirectoryList()
    this.getUsersSimpleList()
    this.getProvinces()
    this.handleList()
  },
  methods: {
    async getDirectoryList () {
      const { data } = await simple()
      this.subjectSimple = data
    },
    async getUsersSimpleList () {
      const { simple } = await import('@/api/base/users.js')
      const { data } = await simple()
      this.usersSimple = data
    },
    getProvinces () {
      const data = provinces()
      this.provinces = data
    },
    getSubArea (val) {
      this.subArea = citys(val)
    },
    // async selectSubject () {
    //   const { data } = await list()
    //   this.subjects = data.items
    // },
    async getCurrentSubject (val) {
      const directorys = await import('@/api/hmmm/directorys.js')
      const res = await directorys.simple({ subjectID: val })
      this.directorysSimple = res.data
      const tags = await import('@/api/hmmm/tags.js')
      const res1 = await tags.simple({ subjectID: val })
      this.tagsSimple = res1.data
    },
    searchQuestion () {
      if (this.formData.chkState === -1) {
        this.$delete(this.formData, 'chkState')
        this.$delete(this.$refs.testTable[this.currentTags].testData, 'chkState')
      }
      this.$refs.testTable[this.currentTags].testData = { ...this.$refs.testTable[this.currentTags].testData, ...this.formData }
      this.$refs.testTable[this.currentTags].getTestList()
    },
    clearForm () {
      this.$refs.testTable.testData = { page: 1, pagesie: 5 }
      this.$refs.testTable.getTestList()
    },
    getCurrentState (val) {
      console.log(val)
    },
    async handleList () {
      const { data } = await list(this.tableValue)
      // console.log(data)
      this.tableData = data.items
      this.counts = data.counts
    },
    async addBtn (id) {
      await this.$confirm('是否添加到精选题库？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
      await choiceAdd({ id: id, choiceState: 1 })
      this.handleList()
    },
    async delBtn (id) {
      await this.$confirm('确定要删除吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
      await remove({ id: id })
      this.handleList()
    },
    async previewQuestion (row) {
      const { detail } = await import('@/api/hmmm/questions.js')
      const data = { id: row.id }
      const res = await detail(data)
      this.currentRow = res.data

      this.previewDialog = true
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
.btn_wrapper {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
::v-deep .el-form-item__label {
  width: 80px;
}
::v-deep .el-form-item__content {
  margin-left: 80px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background: #f4f4f5;
  margin-bottom: 20px;
  width: 100%;
  margin-top: 13px;
  border-radius: 4px;
}
::v-deep .el-select {
  width: 100%;
}
.wenzi {
  font-size: 13px;
  margin-left: 6px;
  color: #909399;
}
.alertIcon {
  ::v-deep .el-alert__icon {
    font-size: 16px;
    width: 16px;
  }
}
</style>
