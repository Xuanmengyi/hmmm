<template>
  <div class="app-container">
    <el-card>
      <el-button size="small" type="success" style="float:right;">
        <i class="el-icon-edit"></i>
        <span @click="addNewUser">新增用户</span>
      </el-button>
      <div style="margin-bottom:20px;">
        <el-form style="width:60%;display: flex;height: 32px;line-height: 32px;">
        <el-input v-model="page.username" size="small" style="width:200px;" placeholder="根据用户名搜索"></el-input>
        <el-button @click="clear" size="small" style="margin-left:15px;">清空</el-button>
  <el-button @click="getUserList" size="small" type="primary">搜索</el-button>
</el-form>
      </div>
      <el-alert
    :title="alertTitle"
    type="info"
    show-icon>
  </el-alert>
  <el-table
  v-loading="loading"
  :header-cell-style="{backgroundColor:'#FAFAFA'}"
  highlight-current-row
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
        <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="primary" icon="el-icon-edit" plain circle></el-button>
        <el-button v-if="scope.row.id!==2" @click="del(scope.row)" type="danger" icon="el-icon-delete" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 20px;margin-bottom: 20px;"
    background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.pagesize"
      layout="prev, pager, next,sizes,  jumper"
      :total="count"
      @current-change="changePage">
    </el-pagination>
    </el-card>
    <addUsers ref="addNew" @getUserList="getUserList"></addUsers>
  </div>
</template>

<script>
import { done } from 'nprogress'
import { list, remove } from '../../api/base/users'
import addUsers from './addUsers.vue'
export default {
  components: {
    addUsers
  },
  data () {
    return {
      page: {
        page: 1,
        pagesize: 10,
        username: ''
      },
      userList: [],
      count: 0,
      alertTitle: '共0条记录',
      clickedRow: '', // 点击的单元格行号
      loading: true
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    async getUserList () {
      const { data } = await list(this.page)
      this.loading = false
      this.userList = data.list
      this.count = data.counts
      this.alertTitle = `共${this.count}条记录`
      console.log(data)
    },
    addNewUser () {
      this.$refs.addNew.show()
      this.$refs.addNew.getPermission()
      this.$refs.addNew.edit = false
    },
    changePage (val) {
      this.loading = true
      this.page.page = val
      this.getUserList()
    },
    del (row) {
      const t = this
      this.$confirm('确认删除？').then(async function () {
        await remove({ id: row.id })
        t.$message({ message: '成功', type: 'success' })
        t.getUserList()
        done()
      })
    },
    change (row) {
      // console.log(row)
      this.$refs.addNew.show()
      this.$refs.addNew.showEdit(row)
      this.$refs.addNew.getPermission()
    },
    clear () {
      this.page.username = ''
      this.getUserList()
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
