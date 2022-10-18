<template>
  <div>
    <el-dialog
      :title="title"
      :before-close="handleClose"
      :visible.sync="diVisible"
      width="50%"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            v-model="formData.permissions"
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { update, add } from '@/api/base/permissions'
export default {
  name: 'permissionsList',
  props: {
    diVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      data: [{
        id: 1,
        label: '系统菜单和页面权限点',
        children: [{
          id: 2,
          label: '后台框架',
          children: [{
            id: 6,
            label: '用户管理',
            children: [{
              id: 10,
              label: '用户新增'
            },
            {
              id: 11,
              label: '用户列表'
            }, {
              id: 12,
              label: '用户分页'
            }]
          }, {
            id: 7,
            label: '菜单管理'
          }, {
            id: 8,
            label: '权限管理'
          }, {
            id: 9,
            label: '日志管理'
          }]
        },
        {
          id: 3,
          label: '列表页',
          children: [{
            id: 13,
            label: '查询表格',
            children: [{
              id: 16,
              label: '查询'
            }, {
              id: 17,
              label: '添加'
            }, {
              id: 18,
              label: '列表'
            }]
          }, {
            id: 14,
            label: '标准列表'
          },
          {
            id: 15,
            label: '卡片列表'
          }]
        }, {
          id: 4,
          label: '表单页',
          children: [{
            id: 19,
            label: '基础表单'
          }, {
            id: 20,
            label: '分步表单'
          }, {
            id: 21,
            label: '高级表单'
          }]
        }, {
          id: 5,
          label: '详情页',
          children: [{
            id: 22,
            label: '基础详情页'
          }, {
            id: 23,
            label: '高级详情页'
          }]
        }, {
          id: 24,
          label: '用户搜索'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formData: {
        permissions: [],
        title: '',
        id: ''
      }
    }
  },
  computed: {
    title () {
      return this.formData.id ? '编辑权限组' : '创建权限组'
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:diVisible', false)
      this.formData = {
        permissions: [],
        title: '',
        id: ''
      }
    },
    async submit () {
      // const arr = []
      // function search (item) {
      //   for (var k in item) {
      //     if (k === 'id') {
      //       arr.push(item.id)
      //     }
      //     if (item[k] instanceof Object) {
      //       search(item[k])
      //     }
      //   }
      //   return arr
      // }
      // this.formData.permissions = this.data.map(item => {
      //   return search(item)
      // })
      // console.log(this.formData.permissions)
      this.formData.permissions = this.data.map(item => {
        if (item.children) {
          return item.id
        }
        return item.id
      })

      // console.log(this.formData.permissions)
      this.formData.id ? await update(this.formData, this.formData.id) : await add(this.formData)
      this.$emit('refreshList')
      this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
      this.handleClose()
    }
  }
}
</script>

<style>
</style>
