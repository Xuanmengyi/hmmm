<template>
  <div class="app-container">
    <el-card>
      <el-button size="small" type="success" style="float: right">
        <i class="el-icon-edit"></i>
        <span @click="addNew">新增目录</span>
      </el-button>
      <div style="margin-bottom: 20px">
        <el-form
          style="width: 60%; display: flex; height: 32px; line-height: 32px"
          label-width="80px"
        >
          <el-form-item size="small" label="目录名称"
            ><el-input
              v-model="page.directoryName"
              size="small"
              style="width: 200px"
            ></el-input
          ></el-form-item>
          <el-form-item label="状态" size="small">
            <el-select
              v-model="page.state"
              placeholder="请选择"
              style="width: 200px; height: 32.5px"
            >
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="clear" size="small" style="margin-left: 15px"
            >清空</el-button
          >
          <el-button @click="getDirect" size="small" type="primary"
            >搜索</el-button
          >
        </el-form>
      </div>
      <el-alert :title="alertTitle" type="info" show-icon> </el-alert>
      <el-table
        v-loading="loading"
        :header-cell-style="{ backgroundColor: '#FAFAFA' }"
        highlight-current-row
        size="medium"
        element-loading-text="给我一点时间"
        :data="directList"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column align="center" prop="id" label="序号" width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="subjectName"
          label="所属学科"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="directoryName" label="目录名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="创建者"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="addDate"
          label="创建日期"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="totals"
          label="面试题数量"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="state" label="状态" width="180">
          <template slot-scope="scope">
            {{ getState(scope.row.state) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope" class="dosomething">
            <el-button @click="changeState(scope.row)" type="text">{{
              scope.row.state === 1 ? '禁用' : '启用'
            }}</el-button>
            <el-button
              @click="edit(scope.row)"
              type="text"
              :disabled="Boolean(scope.row.state)"
              >修改</el-button
            >
            <el-button
              @click="del(scope.row)"
              type="text"
              :disabled="Boolean(scope.row.state)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-top: 20px; margin-bottom: 20px"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pagesize"
        layout="prev, pager, next,sizes,  jumper"
        :total="count"
        @current-change="changePage"
      >
      </el-pagination>
    </el-card>
    <directorysAdd ref="add" @getDirect="getDirect"></directorysAdd>
  </div>
</template>

<script>
import { list, changeState, remove } from '../../api/hmmm/directorys'
import directorysAdd from '../components/directorys-add.vue'
export default {
  components: {
    directorysAdd
  },
  data () {
    return {
      page: {
        page: 1,
        pagesize: 10,
        subjectID: this.$route.query.id
      },
      directList: [],
      count: 0,
      alertTitle: '共0条记录',
      clickedRow: '', // 点击的单元格行号
      loading: true,
      state: '',
      stateList: [],
      type: this.$route.query.type
    }
  },
  created () {
    this.getDirect()
  },
  methods: {
    async getDirect () {
      try {
        const { data } = await list(this.page)
        this.loading = false
        this.directList = data.items
        this.count = data.counts
        this.alertTitle = `共${data.counts}条记录`
        console.log(this.directList)
      } catch (err) {
        console.log(err)
      }
    },
    changePage (val) {
      this.loading = true
      this.page.page = val
      this.getDirect()
    },
    getState (item) {
      if (item === 1) {
        return '已启用'
      }
      if (item === 0) {
        return '已禁用'
      }
    },
    async changeState (row) {
      this.state = row.state ? 0 : 1
      await changeState({
        id: row.id,
        state: this.state
      })
      this.getDirect()
    },
    async del (row) {
      try {
        const t = this
        this.$confirm('确认删除？').then(async function () {
          await remove({ id: row.id })
          t.$message({ message: '删除成功', type: 'success' })
          t.getDirect()
        })
      } catch (err) {
        console.log(err)
      }
    },
    clear () {
      delete this.page.state
      delete this.page.directoryName
      // this.$forceUpdate()
      this.getDirect()
    },
    addNew () {
      this.$refs.add.addNew()
    },
    edit (row) {
      // console.log(row)
      this.$refs.add.edits(row)
    }
  }
}
</script>

<style scoped lang='less'>
.el-alert__icon {
  font-size: 16px;
  width: 16px;
}
</style>
