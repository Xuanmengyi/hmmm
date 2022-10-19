<template>
<div class="app-container">
  <el-card>
    <el-button size="small" type="success" style="float:right;margin-right: 20px;">
        <i class="el-icon-edit"></i>
        <span @click="addNew">添加菜单</span>
      </el-button>

  <el-table
  :row-class-name="tableRowClassName"
  :header-cell-style="{backgroundColor:'#FAFAFA'}"
  highlight-current-row
  :default-expand-all=Boolean(true)
  size="medium"
    :data="tableData"
    style="width: 100%;margin-top: 50px;"
    row-key="id"
    :tree-props="{children: 'childs',hasChildren: 'hasChildren'}">
    <el-table-column ref="title"
      label="标题"
      width="200">
      <template slot-scope="scope">
        <span v-if="scope.row.is_point" class="point"></span>
        <span v-if="(!scope.row.childs)&&(!scope.row.is_point)" class="child"></span>
        <span v-if="scope.row.childs" class="title"></span>
        <!-- {{ifPoint(scope.row)}} -->
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column
      prop="code"
      label="权限点代码"
      width="1083">
    </el-table-column>
    <el-table-column
      label="操作"
      width="120"
      align="center">
      <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="primary" icon="el-icon-edit" plain circle></el-button>
        <el-button @click="del(scope.row)" type="danger" icon="el-icon-delete" plain circle></el-button>
        </template>
    </el-table-column>
  </el-table>
  <menuAdd ref="add" :tableData="firstData" @getMenuList="getMenuList"></menuAdd>
  </el-card>

</div>
</template>
<script>
import { list, remove } from '@/api/base/menus'
import menuAdd from '../components/menu-add.vue'
export default {
  components: {
    menuAdd
  },
  created () {
    this.getMenuList()
  },
  data () {
    return {
      firstData: [],
      tableData: []
    }
  },
  methods: {
    async getMenuList () {
      try {
        const { data } = await list()
        this.firstData = data
        this.tableData = data
        // console.log(data)
        this.tableData = JSON.parse(JSON.stringify(data).replace(/points/g, 'childs'))
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // ifPoint (row) {
    //   if (row.is_point === true) {
    //     const rows = document.querySelectorAll('.el-table tr')
    //     // console.log(rows)
    //     // console.log(row.index)
    //     const spans = rows[rows.index - 1].querySelectorAll('.el-table__placeholder')
    //     console.log(spans)
    //     // spans[1].className = 'point'
    //   }
    // },
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
    },
    async del (row) {
      await remove({ id: row.id })
      this.getMenuList()
    },
    addNew () {
      this.$refs.add.dialogFormV()
    },
    change (row) {
      this.$refs.add.dialogFormV()
      this.$refs.add.typeStatus = true
      this.$refs.add.hanldeEditForm(row.id)
    }
  }
}
</script>
<style scoped>
.el-tree /deep/ .el-tree-node__expand-icon.expanded {

  -webkit-transform: rotate(0deg);

  transform: rotate(0deg);

}

/*有子节点 且未展开*/

.el-table /deep/ .el-table__expand-icon .el-icon-arrow-right:before {

  background: url('') no-repeat;

  content: "\f016";

  display: block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;

}

/*有子节点 且已展开*/

.el-table /deep/ .el-table__expand-icon--expanded{

  -webkit-transform: rotate(0);

  transform: rotate(0);
content:'';
}

.el-table /deep/ .el-table__expand-icon--expanded .el-icon-arrow-right:before {
/* background: url('../../assets/folder-open-fill.png') no-repeat; */
content:'';
  display: block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;

}

/*没有子节点*/

.el-table /deep/ .el-table__placeholder::before {

  display: block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;
content:''
}
 /deep/ .el-icon-arrow-right:before{
  content:''
}
.point::before {
  background: url('../../assets/yanjing_xianshi.png') no-repeat;
  display: inline-block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;
content:''
}
.child::before {
  background: url('../../assets/24gf-fileEmpty.png') no-repeat;
  display: inline-block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;
content:''
}
.title::before{
  background: url('../../assets/folder-open-fill.png') no-repeat;
  display: inline-block;

  width: 16px;

  height: 16px;

  font-size: 16px;

  background-size: 16px;
content:''
}
.el-table .el-table__expand-icon--expanded{
  display: none;
}
/deep/ .el-table .el-table__expand-icon--expanded{
display: none;
}
</style>
