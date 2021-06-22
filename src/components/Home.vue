<template>
  <div>
    HOME 组件
    <el-button @click="quit" type="info">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods:{
      quit(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>

</style>
