<template>
  <!-- <div class="container">{{ this.row.id ? '修改进来的' : '新增进来的' }}</div> -->
  <div class="container questionNew">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ currentId ? '修改试题' : '试题录入' }}</span>
      </div>
      <el-form
        :model="questionForm"
        ref="questionForm"
        size="medium"
        class="questionNewForm"
        :rules="questionRule"
      >
        <el-form-item label="学科:" prop="subjectID" required>
          <el-select
            v-model="questionForm.subjectID"
            placeholder="请选择"
            @change="getCurrentSubject"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in subjectsSimple"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录:" prop="catalogID" required>
          <el-select v-model="questionForm.catalogID" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in directorysSimple"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="enterpriseID" required>
          <el-select v-model="questionForm.enterpriseID" placeholder="请选择">
            <el-option
              :label="item.company"
              :value="item.id"
              v-for="item in companys"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city" required>
          <el-select
            v-model="questionForm.province"
            placeholder="请选择"
            @change="getSubArea"
            style="width: 198px"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in provinces"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="questionForm.city"
            placeholder="请选择"
            style="width: 198px; margin-left: 4px"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in subArea"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向:" prop="direction" required>
          <el-select v-model="questionForm.direction" placeholder="请选择">
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in direction"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="questionType" required>
          <el-radio-group
            v-model="questionForm.questionType"
            @change="changeRadioQuestionType"
          >
            <el-radio label="1">单选</el-radio>
            <el-radio label="2">多选</el-radio>
            <el-radio label="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty" required>
          <el-radio-group v-model="questionForm.difficulty">
            <el-radio label="1">简单</el-radio>
            <el-radio label="2">一般</el-radio>
            <el-radio label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="题干:"
          prop="question"
          class="questionMain"
          required
        >
          <editor v-model="questionForm.question" />
        </el-form-item>
        <el-form-item label="选项:" v-show="questionForm.questionType === '1'">
          <el-radio-group
            v-model="rightCode"
            style="display: block"
            @change="changeRadioIsRight"
          >
            <div
              class="option_item"
              v-for="(item, index) in questionForm.options"
              :key="index"
            >
              <el-radio :label="item.code">{{ item.code }}</el-radio>
              <el-input
                placeholder=""
                size="medium"
                style="width: 240px"
              ></el-input>
              <div class="avatar-uploader" style="margin-left: 4px">
                <UploadImg></UploadImg>
              </div>
            </div>
          </el-radio-group>
          <el-button type="danger" size="small" disabled
            >+增加选项与答案</el-button
          >
        </el-form-item>
        <el-form-item label="选项:" v-show="questionForm.questionType === '2'">
          <el-checkbox-group
            v-model="checkList"
            style="display: block"
            @change="changeCheckBoxIsRight"
          >
            <div
              class="option_item"
              v-for="(item, index) in questionForm.options"
              :key="index"
            >
              <el-checkbox :label="item.code">{{ item.code }}</el-checkbox>
              <el-input
                placeholder=""
                size="medium"
                style="width: 240px"
              ></el-input>
              <div class="avatar-uploader" style="margin-left: 4px">
                <UploadImg></UploadImg>
              </div>
            </div>
          </el-checkbox-group>
          <el-button type="danger" size="small" @click="addOption"
            >+增加选项与答案</el-button
          >
        </el-form-item>
        <el-form-item label="解析视频:" class="analysisVideo">
          <el-input v-model="questionForm.videoURL"></el-input>
        </el-form-item>
        <el-form-item
          label="答案解析:"
          prop="answer"
          class="questionMain"
          required
        >
          <editor v-model="questionForm.answer" />
        </el-form-item>
        <el-form-item label="题目备注:">
          <el-input
            type="textarea"
            v-model="questionForm.remarks"
            :rows="4"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="试题标签:" prop="tags">
          <el-select
            v-model="questionForm.tags"
            multiple
            placeholder="请选择试题标签"
          >
            <el-option
              :label="item.label"
              :value="item.label"
              v-for="(item, index) in tagsSimple"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :type="currentId ? 'success' : 'primary'"
            @click="submitForm"
            >{{ currentId ? '确认修改' : '确认提交' }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Editor from '@/module-hmmm/Editor'
import UploadImg from '@/module-hmmm/UploadImg'

import { provinces, citys } from '@/api/hmmm/citys.js'
import { direction } from '@/api/hmmm/constants.js'
export default {
  name: 'questionEnter',
  components: {
    Editor,
    UploadImg
  },
  data () {
    return {
      currentId: this.$route.params.id,
      questionForm: {
        subjectID: null,
        catalogID: null,
        enterpriseID: null,
        province: '',
        city: '',
        direction: '',
        questionType: '1',
        difficulty: '1',
        question: '',
        remarks: '',
        options: [
          {
            code: 'A',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'B',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'C',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'D',
            img: '',
            isRight: false,
            title: ''
          }
        ],
        tags: '',
        answer: '',
        videoURL: ''
      },
      option: '1',
      subjectsSimple: [],
      rightCode: '',
      checkList: [],
      directorysSimple: [],
      tagsSimple: [],
      provinces: [],
      subArea: [],
      companys: [],
      direction,
      questionRule: {
        subjectID: [{ required: true, message: '请选择学科', trigger: 'blur' }],
        catalogID: [{ required: true, message: '请选择目录', trigger: 'blur' }],
        enterpriseID: [{ required: true, message: '请选择企业', trigger: 'blur' }],
        city: [{ required: true, message: '请选择城市' }],
        direction: [{ required: true, message: '请选择方向', trigger: 'blur' }],
        questionType: [{ required: true, message: '请选择题型', trigger: 'blur' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'blur' }],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案解析', trigger: 'blur' }]

      }

    }
  },
  created () {
    this.getSubjects()
    this.getProvinces()
    this.getCompanys()
    if (this.$route.params.id) {
      this.changeTypeIsRight(this.$route.params.id)
    }
  },

  methods: {
    async changeTypeIsRight (id) {
      // options.forEach(item => {
      //   if (item.isRight === 0) {
      //     this.$set(item, 'isRight', Boolean(false))
      //   } else if (item.isRight === 1) {
      //     this.$set(item, 'isRight', Boolean(true))
      //   }
      // })
      //   this.questionForm.options = options
      const { detail } = await import('@/api/hmmm/questions.js')
      const { data } = await detail({ id })
      this.questionForm = data
      if (data.questionType === '1') {
        const find = data.options.find(item => item.isRight === 1)
        this.rightCode = find ? find.code : ''
      } else if (data.questionType === '2') {
        data.options.forEach(item => {
          if (item.isRight) {
            this.checkList.push(item.code)
          }
        })
        console.log(this.checkList)
      }
    },
    async getSubjects () {
      const { simple } = await import('@/api/hmmm/subjects.js')
      const { data } = await simple()
      this.subjectsSimple = data
    },
    async getCurrentSubject (val) {
      const directorys = await import('@/api/hmmm/directorys.js')
      const res = await directorys.simple({ subjectID: val })
      this.directorysSimple = res.data
      const tags = await import('@/api/hmmm/tags.js')
      const res1 = await tags.simple({ subjectID: val })
      this.tagsSimple = res1.data

      // this.questionForm.tags = this.tagsSimple.join(',')
    },
    getProvinces () {
      const data = provinces()
      this.provinces = data
    },
    getSubArea (val) {
      this.subArea = citys(val)
    },
    async getCompanys () {
      const { list } = await import('@/api/hmmm/companys.js')
      const { data } = await list({ pagesize: 10000 })
      this.companys = data.items
    },
    changeRadioQuestionType (val) {
      if (val === '1') {
        this.questionForm.options = this.questionForm.options.slice(0, 4)
      }
      this.questionForm.options.forEach(item => {
        item.isRight = false
      })
    },
    changeRadioIsRight (val) {
      this.questionForm.options.forEach(item => {
        item.isRight = false
      })
      this.questionForm.options.find(item => item.code === val).isRight = true
    },
    changeCheckBoxIsRight (val) {
      this.questionForm.options.forEach(item => {
        item.isRight = false
      })
      val.forEach(code => {
        this.questionForm.options.find(item => item.code === code).isRight = true
      })
    },
    addOption () {
      const code = String.fromCharCode(65 + this.questionForm.options.length)
      this.questionForm.options.push({
        code,
        img: '',
        isRight: false,
        title: ''
      })
    },
    async submitForm () {
      try {
        this.$refs.questionForm.validate()
        const { add } = await import('@/api/hmmm/questions.js')
        await add({ ...this.questionForm, tags: this.questionForm.tags.join(',') })
        this.$router.push('/questions/list')
        this.$message.success(this.currentId ? '修改成功' : '录入成功')
      } catch (error) {
        this.$message.error(this.currentId ? '修改失败' : '录入失败')
      }
    }
  },
  watch: {

  }
}
</script>

<style scoped lang='less'>
.questionNew {
  padding: 20px;
}
::v-deep .questionNewForm {
  .el-form-item__label {
    width: 120px;
  }
  .el-form-item__content {
    margin-left: 120px;
    .el-select {
      width: 400px;
    }
    .el-textarea {
      width: 400px;
    }
  }
}
.ql-toolbar {
  padding: 0 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  .ql-formats {
    margin-right: 15px;
    display: inline-block;
    vertical-align: middle;
    .textBtn {
      background: none;
      border: none;
      cursor: pointer;
      display: inline-block;
      float: left;
      height: 24px;
      padding: 3px 5px;
      width: 28px;
    }
  }
}
.analysisVideo {
  .el-input {
    width: 400px;
  }
}
::v-deep .questionMain {
  .ql-container {
    width: 469px;
  }
  .ql-toolbar {
    width: 469px;
  }
  .ql-editor {
    height: 200px;
  }
}
.option_item {
  .el-radio {
    margin-right: 4px;
  }
  .el-checkbox {
    margin-right: 4px;
  }
}
::v-deep .avatar-uploader {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
</style>
