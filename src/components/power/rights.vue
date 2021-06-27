<template>
  <div>
        <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图-->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限级别" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="danger">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "rights",
    data(){
      return {
        rightsList:[]
      }
    },
    async created() {
      const {data:res}=await this.$http.get('rights/list')
      if (res.meta.status !==200){return this.$message.error('请求数据失败')}
      console.log(res.data)
      this.rightsList = res.data
    }
  }
</script>

<style scoped>

</style>
