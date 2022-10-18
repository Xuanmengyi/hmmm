<template>
  <div class="app-container">
    <el-card>
      <el-button size="small" type="success" style="float:right;">
        <i class="el-icon-edit"></i>
        <span @click="addNew">新增目录</span>
      </el-button>
      <div style="margin-bottom:20px;">
        <el-form style="width:60%;display: flex;height: 32px;line-height: 32px;" label-width="80px">
          <el-form-item size="small" label="关键字">
            <el-input placeholder="根据文章标题搜索" v-model="page.keyword" size="small" style="width:200px;"></el-input></el-form-item>
        <el-form-item label="状态" size="small">
    <el-select v-model="page.state" placeholder="请选择" style="width:200px;height: 32.5px;">
      <el-option label="启用" value="1"></el-option>
      <el-option label="禁用" value="0"></el-option>
    </el-select>
  </el-form-item>
        <el-button @click="clear" size="small" style="margin-left:15px;">清空</el-button>
  <el-button @click="getarticles" size="small" type="primary">搜索</el-button>
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
      :data="articlesList"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
      prop="videoURL"
        label="文章标题"
        width="400">
      <template slot-scope="scope">
        {{scope.row.title}}<a style="color:#00f" :href="scope.row.videoURL" class="el-icon-film" v-if=scope.row.videoURL></a>
      </template>
      </el-table-column>
      <el-table-column
        prop="visits"
        label="阅读数"
        witdh="221">
      </el-table-column>
      <el-table-column
        prop="username"
        label="录入人"
        width="221">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="录入时间"
        width="221">
        <template slot-scope="scope">
            {{scope.row.createTime|parseTimeByString}}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{getState(scope.row.state)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        >
        <template slot-scope="scope" class="dosomething">
          <el-button @click="preview(scope.row)" type="text">预览</el-button>
          <el-button @click="changeState(scope.row)" type="text">{{scope.row.state===1?'禁用':'启用'}}</el-button>
        <el-button @click="edit(scope.row)" type="text" :disabled=Boolean(scope.row.state)>修改</el-button>
        <el-button @click="del(scope.row)" type="text" :disabled=Boolean(scope.row.state)>删除</el-button>
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
    <articlesAdd ref="add" @getarticles="getarticles"></articlesAdd>
    <articlesPreview ref="ap"></articlesPreview>
  </div>
</template>

<script>
import { list, changeState, remove } from '../../api/hmmm/articles'
import articlesAdd from '../components/articles-add.vue'
import articlesPreview from '../components/articles-preview.vue'
export default {
  components: {
    articlesAdd,
    articlesPreview
  },
  data () {
    return {
      page: {
        page: 1,
        pagesize: 10
      },
      articlesList: [],
      count: 0,
      alertTitle: '数据一共0条',
      clickedRow: '', // 点击的单元格行号
      loading: true,
      state: '',
      stateList: []
    }
  },
  created () {
    this.getarticles()
  },
  methods: {
    async getarticles () {
      try {
        const { data } = await list(this.page)
        this.loading = false
        this.articlesList = data.items
        this.count = data.counts
        this.alertTitle = `数据一共${data.counts}条`
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    changePage (val) {
      this.loading = true
      this.page.page = val
      this.getarticles()
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
      this.getarticles()
    },
    async del (row) {
      try {
        const t = this
        this.$confirm('确认删除？').then(async function () {
          await remove({ id: row.id })
          t.$message({ message: '删除成功', type: 'success' })
          t.getarticles()
        })
      } catch (err) {
        console.log(err)
      }
    },
    clear () {
      delete this.page.state
      delete this.page.keyword
      // this.$forceUpdate()
      this.getarticles()
    },
    addNew () {
      this.$refs.add.showAdd()
    },
    edit (row) {
      // console.log(row)
      this.$refs.add.showEdit(row)
    },
    preview (row) {
      this.$refs.ap.show(row)
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
