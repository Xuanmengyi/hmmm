<template>
  <div>
    <el-card class="box-card" shadow="never">
      <el-form class="form1" :model="formBase">
        <el-form-item label="标签名称" label-width="80px" :inline="true">
          <el-input v-model="formBase.tags" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="城市" label-width="80px">
          <el-select
            class="filter-item"
            v-model="formBase.province"
            @keyup.enter="handleFilter"
            @change="handleProvince"
            filterable
          >
            <el-option
              v-for="item in citySelect.province"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" label-width="70px">
          <el-select
            class="filter-item"
            v-model="formBase.city"
            @keyup.enter="handleFilter"
            filterable
          >
            <el-option
              v-for="item in citySelect.cityDate"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业简称" label-width="70px">
          <el-input
            v-model="formBase.shortName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form class="form1" :model="formBase">
        <el-form-item label="状态" label-width="80px">
          <el-input v-model="formBase.state" placeholder="请选择"></el-input>
        </el-form-item>
        <el-button style="margin-left: 40px" @click="clickBtn">清空</el-button>
        <el-button type="primary" @click="searchBtn">搜索</el-button>
        <el-button type="success" style="margin-left: 925px" @click="addForm">
          <i class="el-icon-edit"></i>
          <span>新增用户</span>
        </el-button>
      </el-form>
      <el-col :span="24"
        ><div class="grid-content">
          <i
            class="el-icon-info"
            style="color: #909399; margin-top: 10px; margin-left: 23px"
          ></i>
          <span class="wenzi">共{{ counts }}条记录</span>
        </div></el-col
      >
      <!-- table -->
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" width="100" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="number"
          label="企业编号"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="shortName"
          label="企业简称"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="150">
        </el-table-column>
        <el-table-column
          prop="creatorID"
          label="创建人"
          align="center"
          width="170"
        >
        </el-table-column>
        <el-table-column
          prop="addDate"
          label="创建日期"
          align="center"
          width="200"
        >
          <template slot-scope="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" width="200">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
          :formatter="formatterFn"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              style="background: #ecf5ff; color: #409eff"
              icon="el-icon-edit"
              circle
              @click="editForm(row)"
            ></el-button>
            <el-button
              style="background: #f0f9eb; color: #e6a23c"
              v-if="row.state === 1"
              type="success"
              icon="el-icon-check"
              circle
              @click="changBtn(row.id, row.state)"
            ></el-button>
            <el-button
              style="background: #fdf6ec; color: #67c23a"
              v-else
              type="success"
              icon="el-icon-close"
              circle
              @click="changBtn(row.id, row.state)"
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
        :page-size="formBase.pagesize"
        layout="prev, pager, next,sizes,  jumper"
        :total="counts"
        :current-page.sync="formBase.page"
        @current-change="handleList"
        @size-change="handleList"
      >
      </el-pagination>
    </el-card>
    <CompanysAdd
      :form-base="formBase"
      :dialogFormVisible.sync="dialogFormVisible"
      ref="addValue"
      @newDataes="handleList"
    />
  </div>
</template>

<script>
import { list, remove, disabled } from '@/api/hmmm/companys'
import { status } from '@/api/hmmm/constants'
import { provinces, citys } from '@/api/hmmm/citys.js'
import CompanysAdd from '../components/companys-add.vue'
export default {
  components: { CompanysAdd },
  data () {
    return {
      status: status,
      counts: 0,
      citySelect: {
        province: [],
        cityDate: []
      },
      formBase: {
        tags: '',
        province: '',
        city: '',
        shortName: '',
        state: ''
      },
      formBase2: {
        page: 1,
        pagesize: 10
      },
      formBase3: {
        page: 1,
        pagesize: 10,
        tags: '',
        province: '',
        city: '',
        shortName: ''
      },
      titleInfo: {},
      tableData: [],
      btnqwer: true,
      dialogFormVisible: false
    }
  },
  created () {
    this.handleList()
    this.getCityData()
  },
  methods: {
    clickBtn () {
      this.formBase = {
        tags: '',
        province: '',
        city: '',
        shortName: '',
        state: ''
      }
    },
    async handleList () {
      const { data } = await list(this.formBase2)
      // console.log(data)
      this.tableData = data.items
      this.counts = data.counts
    },
    formatterFn (row, column, cellValue) {
      // console.log(cellValue)
      const res = this.status.find(ele => ele.value === cellValue)
      return res && res.label
    },
    getCityData: function () {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    handleProvince: function (e) {
      this.citySelect.cityDate = citys(e)
      this.formBase.city = this.citySelect.cityDate[0]
    },
    editForm (row) {
      // console.log(row)
      // const { id, isFamous, shortName, company, province, city, tags, remarks } = row
      // const rows = { id, isFamous, shortName, company, province, city, tags, remarks
      if (row.isFamous === 0) {
        row.isFamous = false
        this.$refs.addValue.formBase1 = row
      } else if (row.isFamous === 1) {
        row.isFamous = true
        this.$refs.addValue.formBase1 = row
      }
      this.dialogFormVisible = true
    },
    addForm () {
      this.dialogFormVisible = true
    },
    async delBtn (id) {
      await this.$confirm('确定要删除吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
      await remove({ id: id })
      this.$message.success('删除成功')
      this.handleList()
    },
    async changBtn (id, state) {
      const data = state ? 0 : 1
      await this.$confirm('以成功禁用，是否继续？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
      await disabled({ id: id, state: data })
      this.handleList()
    },
    async searchBtn () {
      await list(this.formBase3)
      this.handleList()
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
  width: 100%;
  height: 32px;
  display: flex;
  line-height: 32px;
  margin-bottom: 15px;
}
:deep(.el-input__inner) {
  width: 337px;
  height: 32px;
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
