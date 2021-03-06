import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=> import('../components/login')
const Home = ()=>import('../components/Home')
const Welcome = ()=>import('../components/welcome')
const Users = ()=>import('../components/users/users')
const Rights = ()=>import('../components/power/rights')
const Roles = ()=>import('../components/power/roles')
Vue.use(VueRouter)

const routes = [
  {path:'/login',component:Login},
  {path:'',redirect:'/login'},
  {path: '/home',component:Home,
    redirect: '/welcome',
    children:[{path:'/welcome', component:Welcome},
      {path: '/users', component:Users},
      {path:'/rights',component:Rights},
      {path: '/roles',component:Roles}]}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由导航守卫
router.beforeEach(((to, from, next) => {
  //to 将要访问的路径
  //from 从哪个路径过来的
  if (to.path === '/login') return next()
  // 取出本地token
  const token = window.sessionStorage.getItem('token')
  // 如果没有token，就直接跳转到登录页
  if (!token) return next('/login')
  next()
}))

export default router
