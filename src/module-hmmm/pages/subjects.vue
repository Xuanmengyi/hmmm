<template>
  <div class="container">
    <el-card class="box-card" shadow="never">
      <el-button type="success" style="float: right" @click="addSubject">
        <i class="el-icon-edit"></i>
        <span>新增用户</span>
      </el-button>
      <div>
        <el-form class="form1" :model="tage">
          <el-input
            v-model="tage.subjectName"
            size="small"
            style="width: 200px"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button style="margin-left: 15px" @click="tage.subjectName = ''"
            >清空</el-button
          >
          <el-button type="primary" @click="SearchSubject">搜索</el-button>
        </el-form>
      </div>
      <el-col :span="24"
        ><div class="grid-content">
          <i
            class="el-icon-info"
            style="color: #909399; margin-top: 10px; margin-left: 23px"
          ></i>
          <span class="wenzi">共{{counts}}条记录</span>
        </div></el-col
      >
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="subjectName" label="学科名称" width="220">
        </el-table-column>
        <el-table-column prop="username" label="创建者" width="220">
        </el-table-column>
        <el-table-column prop="addDate" label="创建日期" width="160">
          <template slot-scope="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column
          prop="isFrontDisplay"
          :formatter="formatterFn"
          label="前台是否显示"
          width="190"
        >
        </el-table-column>
        <el-table-column prop="twoLevelDirectory" label="二级目录" width="200">
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
        </el-table-column>
        <el-table-column prop="totals" label="题目数量" width="170">
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="{ row }">
            <el-button type="text" @click="classification(row)"
              >学科分类</el-button
            >
            <el-button type="text" @click="lableBtn(row)">学科标签</el-button>
            <el-button type="text" @click="editSubject(row)">修改</el-button>
            <el-button type="text" @click="delBtn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-top: 20px; margin-bottom: 20px"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="tage.pagesize"
        layout="prev, pager, next,sizes,  jumper"
        :total="counts"
        :current-page.sync="tage.page"
        @current-change="tableList"
        @size-change="tableList"
      >
      </el-pagination>
    </el-card>
    <subjects-add
      :diVisible.sync="diVisible"
      ref="addform"
      @refreshList="tableList"
    />
  </div>
</template>

<script>
import subjectsAdd from './subjectAdd.vue'
import { Reception } from '@/api/hmmm/constants'
import { list, remove } from '@/api/hmmm/subjects.js'
import { list as list1 } from '@/api/hmmm/directorys'
import { list as list2 } from '@/api/hmmm/tags'
export default {
  data () {
    return {
      Reception: Reception,
      tage: {
        page: 1,
        pagesize: 10,
        subjectName: ''
      },
      tableData: [],
      counts: 0,
      diVisible: false
    }
  },
  components: { subjectsAdd },
  created () {
    this.tableList()
  },
  methods: {
    async tableList () {
      const { data } = await list(this.tage)
      // console.log(data)
      this.tableData = data.items
      this.counts = data.counts
    },
    addSubject () {
      this.diVisible = true
    },
    editSubject (row) {
      // console.log(row)
      this.$refs.addform.formData = row
      this.$refs.addform.formData.isFrontDisplay = row.isFrontDisplay
      this.diVisible = true
    },
    formatterFn (row, column, cellValue) {
      // console.log(cellValue)
      const res = this.Reception.find(ele => ele.value === cellValue)
      // console.log(res)
      return res && res.label
    },
    async delBtn (id) {
      await remove({ id: id })
      this.$message.success('删除成功')
      this.tableList()
    },
    async SearchSubject () {
      await list()
      this.tableList()
    },
    async classification (row) {
      this.$router.push('/subjects/directorys')
      await list1({ subjectID: row.id })
    },
    async lableBtn (row) {
      this.$router.push('/subjects/tags')
      await list2({ subjectID: row.id })
    }
  }
}
</script>

<style scoped lang='less'>
.box-card {
  width: 98%;
  margin: 20px 20px;
}
.form1 {
  width: 60%;
  height: 32px;
  display: flex;
  line-height: 32px;
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
.wenzi {
  font-size: 13px;
  margin-left: 6px;
  color: #909399;
}
</style>
