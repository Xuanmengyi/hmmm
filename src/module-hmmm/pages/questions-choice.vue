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
      <el-tabs v-model="chkType.value" type="card" @tab-click="handleClick">
        <el-tab-pane
          :label="item.label"
          v-for="item in chkType"
          :key="item.value"
        >
          <testTable
            ref="testTable"
            @currentState="getCurrentState"
          ></testTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>

import testTable from './components/questions-choice/table.vue'
import { simple } from '@/api/hmmm/subjects.js'
import { questionType, difficulty, direction, chkType } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'

// import { tagsSimple } from '@/api/hmmm/tags.js'
// import { simple } from '@/api/hmmm/directorys.js'

export default {
  name: 'question_choice',
  components: {
    testTable
  },
  data () {
    return {
      formData: {
      },
      questionType,
      difficulty,
      direction,
      chkType,
      currentTags: 0,
      provinces: [],
      subArea: [],
      activeName: 'first',
      subjects: [],
      subjectSimple: [],
      tagsSimple: [],
      directorysSimple: [],
      usersSimple: []
    }
  },
  created () {
    this.getDirectoryList()
    this.getUsersSimpleList()
    this.getProvinces()
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
    handleClick (tab) {
      const chkState = tab.label
      this.chkType.forEach((item, index) => {
        if (item.label === chkState) {
          this.currentTags = index
          this.formData.chkState = item.value
        }
      })
      this.searchQuestion()
    },
    getCurrentState (val) {
      console.log(val)
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
::v-deep .el-select {
  width: 100%;
}
.alertIcon {
  ::v-deep .el-alert__icon {
    font-size: 16px;
    width: 16px;
  }
}
</style>
