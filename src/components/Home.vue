<template>
  <el-container>
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="quit" type="info">退出</el-button>
    </el-header>
    <!--    主题区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="collapse ? '64px':'200px'">
        <!--侧边栏菜单区域-->
        <div class="toggle-button" @click="toggleCollege">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true"
          :collapse="collapse"
        :collapse-transition="false"
        router :default-active="$route.path">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--   图标-->
              <i :class="icosObj[item.id]"></i>
              <!--          文本-->
              <span>{{item.authName}}</span>
            </template>


            <!-- 二级菜单-->
            <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="i.id" >
              <template slot="title">
              <!--   图标-->
              <i class="el-icon-menu"></i>
              <!--          文本-->
              <span>{{i.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主题部分-->
      <el-main>
<!--        将主类容显示到这里：welcome组件-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  export default {
    name: "Home",
    components:{
    },
    data(){
      return {
        menulist :[],
        icosObj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        },
        collapse:false,
        // Active:''
      }
    },
    methods: {
      quit() {
        window.sessionStorage.clear()
        // this.$router.push('/login')
      },
      async getMenuList(){
        const {data:res} = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error('获取菜单列表失败！')
        this.menulist = res.data
        // console.log(res)
      },
      toggleCollege(){
        this.collapse = !this.collapse
      },
      // setActive(path){
      //   // window.sessionStorage.setItem('path','/'+path)
      //   this.Active = '/'+path
      // }
    },
    created() {
      this.getMenuList()
    },
  }
</script>

<style scoped lang="less">
  .el-container {
    height: 100vh;
  }

  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        padding-left: 15px;
      }
    }
  }

  .el-aside {
    background: #333744;
    .el-menu{
      border-right: none;
    }
  }

  .el-main {
    background: #eaedf1;
  }
  .iconfont{
    padding-right: 10px;
  }
  .toggle-button{
    background: #2b4b6b;
    cursor: pointer;
    text-align: center;
    line-height: 24px;
    color: #fff;
    letter-spacing: 2px;
  }
</style>
