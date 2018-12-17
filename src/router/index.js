import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import PlanList from '@/components/planList'
import PlanAdd from '@/components/planAdd'
import AssemblyAdd from '@/components/assemblyAdd'
import AssemblyList from '@/components/assemblyList'
Vue.use(Router);


Vue.prototype.__routes = [
  {
    path: '/',
    component: App,
    desc: "首页",
    children:[
      {
        path: '/planList',
        name: 'PlanList',
        component: PlanList,
        desc: "方案页面",
      },
      {
        path: '/planAdd',
        name: 'PlanAdd',
        component: PlanAdd,
        desc: "新建方案页面",
      },
      {
        path: '/assemblyAdd',
        name: 'AssemblyAdd',
        component: AssemblyAdd,
        desc: "新建组件页面",
      },
      {
        path: '/assemblyList',
        name: 'AssemblyList',
        component: AssemblyList,
        desc: "新建组件页面",
      },
    ]
  },
  
];

export default new Router({
  routes: Vue.prototype.__routes
})
