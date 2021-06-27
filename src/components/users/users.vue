<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!--      table表格区域-->
      <template>
        <el-table :data="userlist" stripe border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state" @change="changeState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-tooltip class="item" effect="dark" content="编辑角色" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="userEidt(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="deleteUserInfo(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark"  content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" @click="showSetROleDialog(scope.row)" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页功能-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </template>
    </el-card>

    <!-- 添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="isDialog" @close="closeDialogClosed"
      width="50%">
      <el-form :model="addUserForm" :rules="rules" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isDialog = false">取 消</el-button>
    <el-button type="primary" @click="addUserClick">确 定</el-button>
  </span>
    </el-dialog>

    <!--  修改用户信息对话框  -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isEdit"
      width="50%" @close="closeEditDialog">
      <el-form :model="EditData" :rules="rules" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名称">
          <el-input v-model="EditData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="EditData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isEdit = false">取 消</el-button>
    <el-button type="primary" @click="EditUserInfo">确 定</el-button>
  </span>
    </el-dialog>
<!--分配角色对话框-->
    <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialog"
  width="50%" @close="selectRoleClose">
  <div>
    <p>当前用户是：{{userInfo.username}}</p>
    <p>当前角色是：{{userInfo.role_name}}</p>
    <p>亲选择绑定的角色：
    <el-select v-model="selectRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="changeRole">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
  export default {
    name: "users",
    data() {
      const checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('亲输入合法的email'))
      }
      const checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb()
        }
        cb(new Error('亲输入合法的手机号'))
      }
      return {
        queryInfo: {
          query: '',
          // 当前页码
          pagenum: 1,
          pagesize: 5
        },
        userlist: [],
        total: 0,
        isDialog: false,
        // 添加用户信息的存储器
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: null,

        },
        rules: {
          username: [{required: true, message: '亲输入用户名！', trigger: 'blur'},
            {min: 3, max: 8, message: '长度在3到8个字符串', trigger: 'blur'}],
          password: [{required: true, message: '亲输入密码！', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在6到15位', trigger: 'blur'}],
          email: [{required: true, message: '亲输入邮箱！', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
          mobile: [{required: true, message: '亲输入手机号！', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}]
        },
        isEdit: false,
        // 修改用户信息的存储器
        EditData: {},
        // 展示分配角色对话框
        setRoleDialog:false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 所有的角色列表
        rolesList:[],
        // 保存选择的角色id
        selectRoleId:'',


      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        // console.log(res)
        this.userlist = res.data.users
        this.total = res.data.total
      },
      // 改变每页显示的个数 监听每页显示的页数
      handleSizeChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagesize = newPage
        this.getUserList()
      },
      // 改变当前页面 监听当前页的改变
      handleCurrentChange(currentPage) {
        // console.log(currentPage)
        this.queryInfo.pagenum = currentPage
        this.getUserList()
      },
      async changeState(userInfo) {
        // console.log(userInfo)
        const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status !== 200) {
          // 如果修改失败，就不让页面有变化，重新变回原来的状态
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('修改失败')
        }
        this.$message.success('用户状态修改成功')
      },
      // 添加用户
      addUser() {
        this.isDialog = true
      },
      // 点击按钮添加新用户
      addUserClick() {
        this.$refs.addUserForm.validate(async valid => {
          if (!valid) return this.$message.error('请填写正确的信息')
          const {data: res} = await this.$http.post('users', this.addUserForm)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
            this.isDialog = false
          }
          this.$message.success('添加用户成功')
          // 影藏用户的对话框
          this.isDialog = false
          // 刷新数据
          this.getUserList()
        })
      },
      closeDialogClosed() {
        this.$refs.addUserForm.resetFields()
      },
      // 修改用户
      userEidt(data) {
        // console.log(data)
        this.EditData = data
        this.isEdit = true
      },
      // 修改用户信息
      EditUserInfo() {
        this.$refs.editUserForm.validate(async valid => {
          console.log(valid)
          if (!valid) return this.$message.error('请填写正确的信息')
          const {data: res} = await this.$http.put('users/' + this.EditData.id,
            this.EditData)
          // console.log(res)
          if (res.meta.status !== 200) return this.$message.error('修改用户信息失败！')
          this.isEdit = false
          this.getUserList()
        })
      },
      // 监听修改用户对话框的关闭事件
      closeEditDialog() {
        this.$refs.editUserForm.resetFields()
      },
      async deleteUserInfo(id) {
        console.log('已经点击了')
        const isConfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果点击确认则返回confirm字符串  点击取消就返回cancel字符串
        if (isConfirm !== 'confirm') return this.$message.info('已取消删除')
        const {data: res} = await this.$http.delete('users/' + id)
        console.log(res.meta.status)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getUserList()

      },
      async showSetROleDialog(userInfo){
        this.userInfo = userInfo
        console.log(userInfo)
        // 获取角色列表
        const {data:res}=await this.$http.get('roles')
        if (res.meta.status !==200){
          return  this.$message.error('获取列表失败！')
        }
        this.rolesList = res.data
        console.log(this.rolesList)
        this.setRoleDialog = true
      },
      async changeRole(){
          if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
          const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
          if (res.meta.status !== 200) return this.$message.error('更改角色失败')
          this.$message.success('分配角色成功')

          this.setRoleDialog = false
          this.getUserList()
        },
      selectRoleClose(){
        this.rolesList = ''
        this.userInfo = {}
      }
    }
  }
</script>

<style scoped>

</style>
