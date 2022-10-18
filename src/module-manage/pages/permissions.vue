<template>
  <div>
    <el-card class="box-card" shadow="never">
      <el-button type="success" style="float: right" @click="addMen">
        <i class="el-icon-edit"></i>
        <span>新增用户</span>
      </el-button>
      <div>
        <el-form class="form1" :model="tage">
          <el-input
            v-model="tage.title"
            size="small"
            style="width: 200px"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button style="margin-left: 15px" @click="delBtn1">清空</el-button>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form>
      </div>
      <el-col :span="24"
        ><div class="grid-content">
          <i
            class="el-icon-info"
            style="color: #909399; margin-top: 10px; margin-left: 23px"
          ></i>
          <span class="wenzi">共{{ this.counts }}条记录</span>
        </div></el-col
      >

      <el-table
        ref="multipleTable"
        :data="tableData"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="用户名" prop="title" align="center" width="750">
        </el-table-column>
        <el-table-column label="日期" sortable width="720">
          <template slot-scope="{ row }">
            {{ row.create_date | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              style="background: #ecf5ff; color: #409eff"
              icon="el-icon-edit"
              circle
              @click="editForm(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              style="background: #fef0f0; color: #f56c6c"
              circle
              @click="delBtn(row.id)"
            ></el-button>
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
      >
      </el-pagination>
    </el-card>
    <permissions-list
      ref="addform"
      :di-visible.sync="diVisible"
      @refreshList="permissionsList1"
    />
  </div>
</template>

<script>
import { list, remove } from '@/api/base/permissions'
import permissionsList from './permissionsList.vue'
export default {
  components: { permissionsList },
  data () {
    return {
      tage: {
        page: 1,
        pagesize: 10,
        title: ''
      },
      counts: 0,
      tableData: [],
      diVisible: false
    }
  },

  created () {
    this.permissionsList1()
  },

  methods: {
    async permissionsList1 () {
      const { data } = await list(this.tage)
      // console.log(data)
      this.counts = data.counts
      this.tableData = data.list
      // console.log(this.tableData)
    },
    addMen () {
      this.diVisible = true
    },
    editForm (row) {
      // console.log(row.id)
      this.$refs.addform.formData.title = row.title
      this.$refs.addform.formData.id = row.id
      this.diVisible = true
    },
    delBtn1 () {
      this.tage.title = ''
    },
    async searchBtn () {
      // await simple(this.tage)
      this.permissionsList1()
    },
    async delBtn (id) {
      try {
        await this.$confirm('确定要删除吗？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        // 删除接口封装
        // 调用删除接口
        // console.log(id)
        await remove({ id: id })
        // 刷新列表
        this.permissionsList1()
      } catch (error) {
        console.log(error)
      }
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
