<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图-->
    <el-card>
      <!--      添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="success" @click="showDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      表格-->
      <el-table :data="rolesList" stripe border>
<!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['el-bottom',id ===0 ? 'el-top':'']" v-for="(item,id) in scope.row.children" :key="item.id">
              <el-col :span="5" >
                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限、三级权限-->
                <el-row v-for="(two,id) in item.children" :key="id" :class="[id!==0 ? 'el-top':'']">
                <!-- 二级权限-->
                  <el-col :span="9">
                    <el-tag type="success" closable @close="removeRightById(scope.row,two.id)">{{two.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="15">
                  <el-row>
                    <el-col>
                      <el-tag v-for="i3 in two.children"
                              :key="i3.id" type="warning"
                      closable @close="removeRightById(scope.row,i3.id)">{{item.authName}}</el-tag>
                    </el-col>
                  </el-row>
                    </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        添加索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="showEditRole(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRoleRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    添加角色列表-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      width="50%" @close="addDialogClose">
      <el-form :model="addRoleInfo" :rules="rules" ref="ruleFormAddRole" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="addRoleClick">确 定</el-button>
  </span>
    </el-dialog>
    <!--编辑角色-->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialog"
      width="50%" @close="editDialogClose">
      <el-form :model="editRoleInfo" :rules="rules" ref="ruleFormEditRole" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="editRoleClick">确 定</el-button>
  </span>
    </el-dialog>
<!--分配权限对话框-->
    <el-dialog
  title="提示"
  :visible.sync="rightsDialogVisible"
  width="50%" @close="closeRights">
<!--  树形控件-->
      <el-tree :data="rightsList" ref="treeInfo" :default-checked-keys="defKeys" :default-expand-all="true" :props="setProps" show-checkbox node-key="id"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setAllKeys">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
  export default {
    name: "roles",
    data() {
      return {
        rolesList: [],
        addRoleDialog: false,
        // 添加角色信息
        addRoleInfo: {
          roleName: '',
          roleDesc: ''
        },
        rules: {
          roleName: [{required: true, message: '请输入用户名！', trigger: 'blur'}, {
            min: 3,
            max: 8,
            message: "请输入3到8个字符串",
            trigger: 'blur'
          }],
          roleDesc: [{required: true, message: '请输入角色描述！', trigger: 'blur'}, {
            min: 6,
            max: 13,
            message: "请输入6到13个字符串",
            trigger: 'blur'
          }],
        },
        // 显示编辑角色页面
        editRoleDialog: false,
        editRoleInfo: {},
        // 显示分配权限
        rightsDialogVisible:false,
        // 保存权限分配信息
        rightsList: [],
        setProps:{
          label:'authName',
          children:'children'
        },
        // 默认选择的id
        defKeys:[],
        // 角色id
        roleId:null
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')

        this.rolesList = res.data
        console.log(res)
      },
      showDialog() {
        this.addRoleDialog = true
      },
      addRoleClick() {
        this.$refs.ruleFormAddRole.validate(async valid => {
          if (!valid) return this.$message.error('添加角色失败！')
          const {data: res} = await this.$http.post('roles', this.addRoleInfo)
          if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
          // 关闭对话框
          this.addRoleDialog = false
          this.$message.success('添加角色成功！')
          // 更新数据
          this.getRolesList()
        })
      },
      addDialogClose() {
        this.$refs.ruleFormAddRole.resetFields()
      },
      async showEditRole(id) {
        const {data: res} = await this.$http.get('roles/' + id)
        this.editRoleInfo = res.data
        this.editRoleDialog = true
      },
      editDialogClose() {
        this.$refs.ruleFormEditRole.resetFields()
      },
      // 编辑角色信息
      editRoleClick() {
        this.$refs.ruleFormEditRole.validate(async valid => {
          if (!valid) return this.$message.error('请输入正确的信息')
          const {data: res} = await this.$http.put('roles/' + this.editRoleInfo.roleId, this.editRoleInfo)
          if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
          this.editRoleDialog = false
          this.$message.success('修改成功')
          this.getRolesList()
        })
      },
      // 删除角色
      async deleteRole(id){
        const isConfirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (isConfirm!=='confirm') return this.$message.error('已取消删除')
        const {data:res} = await this.$http.delete('roles/'+id)
        if (res.meta.status!==200) return this.$message.error('删除失败')
        this.showDialog = false
        this.$message.success('删除角色成功！')
        this.getRolesList()

      },
      // 添加删除权限按钮的事件
      async removeRightById(role,right_id){
        // 弹窗提示是否删除
        const res = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if (res !== 'confirm') return this.$message.error('已经取消删除！')
        const {data:resData} =
          await this.$http.delete(`roles/${role.id}/rights/${right_id}`)
        if (resData.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        // this.getRolesList()  会出现完整渲染
        role.children = resData.data
      },
      // 展示权限对话框
      async showRoleRights(role){
        // 获取分配权限的数据
        this.roleId = role.id
        const {data:res}=await this.$http.get('rights/tree')
        if (res.meta.status !==200) return this.$message.error('获取权限失败')
        this.rightsList = res.data
        // console.log(this.rightsList)
        this.getKeys(role,this.defKeys)
        this.rightsDialogVisible = true
      },

      // 获取默认选中的节点，通过递归函数
      getKeys(node,arr){
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item=>this.getKeys(item,arr))
      },
      closeRights(){
        this.defKeys = []
      },
      async setAllKeys(){
        const keys = [
          ...this.$refs.treeInfo.getCheckedKeys(),
          ...this.$refs.treeInfo.getHalfCheckedKeys()
        ]
        const endKeys = keys.join(',')
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:endKeys})
        if (res.meta.status !== 200) {
          this.rightsDialogVisible = false
          return this.$message.error('授权失败')
        }
        this.rightsDialogVisible = false
        this.getRolesList()

      }
    }
  }
</script>

<style scoped>

</style>
