<template>
  <div>
    <el-dialog
  :title="edit?'编辑用户':'创建用户'"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="width:400px;margin-left: 120px;" label-width="120px">
    <el-form-item label="用户名" prop="name" size="medium">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="mail">
    <el-input v-model="ruleForm.mail"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" v-if="!edit">
    <el-input v-model="ruleForm.password"></el-input>
  </el-form-item>
  <el-form-item label="角色">
    <el-input v-model="ruleForm.role"></el-input>
  </el-form-item>
  <el-form-item label="权限组名称">
    <el-select v-model="ruleForm.groupId" placeholder="请选择">
      <el-option v-for="item in group" :label="item.title" :value="item.id" :key="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="联系电话">
    <el-input v-model="ruleForm.phone"></el-input>
  </el-form-item>
  <el-form-item label="介绍">
    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit?submitEdit():submitAdd()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { list } from '../../api/base/permissions'
import { add, update } from '../../api/base/users'
export default {
  created () {
    this.getPermission()
  },
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        name: '',
        mail: '',
        password: '',
        role: '',
        groupId: '',
        desc: '',
        phone: ''
      },
      page: {
        page: 1,
        pagesize: 10
      },
      edit: false,
      group: [],
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        mail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      isShow: true,
      id: ''
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    show () {
      this.dialogVisible = true
      this.ruleForm.name = ''
      this.ruleForm.mail = ''
      this.ruleForm.password = ''
      this.ruleForm.role = ''
      this.ruleForm.groupId = ''
      this.ruleForm.phone = ''
      this.ruleForm.desc = ''
    },
    async getPermission () {
      const data = await list(this.page)
      this.group = data.data.list
      // console.log(this.ruleForm.group)
    //   console.log(this.permissionList)
    },
    async submitAdd () {
      this.$refs.ruleForm.validate()
      try {
        await add({
          avatar: '',
          email: this.ruleForm.mail,
          introduction: this.ruleForm.desc,
          password: this.ruleForm.password,
          permission_group_id: this.ruleForm.groupId,
          phone: this.ruleForm.phone,
          role: this.ruleForm.role,
          sex: 1,
          username: this.ruleForm.name
        })
        this.$message({ message: '添加成功', type: 'success' })
        this.$refs.ruleForm.resetFields()
        this.ruleForm.role = ''
        this.ruleForm.groupId = ''
        this.dialogVisible = false
        this.$emit('getUserList')
      } catch (err) {
        console.log(err)
      }
    },
    async submitEdit () {
      this.$refs.ruleForm.validate()
      try {
        await update({
          avatar: '',
          email: this.ruleForm.mail,
          id: this.id,
          introduction: this.ruleForm.desc,
          permission_group_id: this.ruleForm.groupId,
          phone: this.ruleForm.phone,
          role: this.ruleForm.role,
          username: this.ruleForm.name
        })
        this.$message({ message: '修改成功', type: 'success' })
        this.$refs.ruleForm.resetFields()
        this.ruleForm.role = ''
        this.ruleForm.groupId = ''
        this.dialogVisible = false
        this.$emit('getUserList')
      } catch (err) {
        console.log(err)
      }
    },
    changeShow () {
      this.isShow = !this.isShow
    },
    showEdit (row) {
      this.edit = true
      console.log(row)
      this.ruleForm.name = row.username
      this.ruleForm.mail = row.email
      this.ruleForm.role = row.role
      this.ruleForm.groupId = row.permission_group_id
      this.ruleForm.desc = row.introduction
      this.ruleForm.phone = row.phone
      this.id = row.id
    },
    cancelEdit () {
      this.edit = false
    }
  }
}
</script>

<style>
.el-dialog__footer{
    text-align: center;
}
</style>
