<template>
  <div class="app-container">
    <el-card>
      <el-button size="small" type="success" style="float:right;">
        <i class="el-icon-edit"></i>
        <span>新增用户</span>
      </el-button>
      <div style="margin-bottom:20px;">
        <el-form style="width:60%;display: flex;height: 32px;line-height: 32px;">
        <el-input size="small" style="width:200px;" placeholder="根据用户名搜索"></el-input>
        <el-button size="small" style="margin-left:15px;">清空</el-button>
  <el-button size="small" type="primary">搜索</el-button>
</el-form>
      </div>
      <el-alert
    :title="alertTitle"
    type="info"
    show-icon>
  </el-alert>
  <el-table
  @row-click='changecolor'
  :row-style='cellStyle'
  :header-cell-style="{backgroundColor:'#FAFAFA'}"
  size="medium"
  element-loading-text="给我一点时间"
      :data="userList"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
      align="center"
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
      align="center"
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="permission_group_title"
        label="权限组名称"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        prop="role"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column
      align="center"
        label="操作"
        width="180">
        <el-button type="primary" icon="el-icon-edit" plain circle></el-button>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 20px;margin-bottom: 20px;"
    background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.pagesize"
      layout="prev, pager, next,sizes,  jumper"
      :total="count">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { list } from '../../api/base/users'
export default {
  data () {
    return {
      page: {
        page: 1,
        pagesize: 10,
        username: ''
      },
      userList: {},
      count: 0,
      alertTitle: '共0条记录',
      clickedRow: '' // 点击的单元格行号
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    async getUserList () {
      const { data } = await list(this.page)
      this.userList = data.list
      this.count = data.counts
      this.alertTitle = `共${this.count}条记录`
      console.log(data)
    },
    addClassName (row) {
      console.log(row)
    },
    changecolor (row, column, cell, event) {
      this.clickedRow = row.dtuSort // 取个唯一值用作判定行

      this.clickedColumn = column.property
    },

    // 控制单元格样式

    cellStyle ({ row, rowIndex }) {
      if (row.dtuSort === this.clickedRow) {
        return {

          background: '#ECF5FF'

        }
      } else {
        return {

          background: 'white'

        }
      }
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
