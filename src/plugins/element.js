import Vue from 'vue'
// import { Button } from 'element-ui'
// import {Form,FormItem} from 'element-ui'
// import {Input} from "element-ui";
// // 导入弹框提示组件
// import {Message} from 'element-ui'

import {Button,Form,FormItem,Input,Message,
        Container,Header,Aside,Main,
        Menu,Submenu,MenuItem,
  Breadcrumb,BreadcrumbItem,
  Card,Select,Col,Row,Table, TableColumn,Switch,
  Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
