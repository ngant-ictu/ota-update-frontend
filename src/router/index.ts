import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import PatchManagement from '../views/PatchManagement.vue'
import DeviceManage from '../views/DeviceManage.vue'
import GroupManage from '../views/GroupManage.vue'
import DeviceDetail from '@/components/DeviceDetail.vue'
import HistoryActive from '../views/HistoryActive.vue'
import GroupItem from '@/components/groupdevice/Item.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/path-management',
    name: 'PatchManagement',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PatchManagement
  },
  {
    path: '/device-patching',
    name: 'DeviceManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceManage,
  },
  {
    path: '/device-management',
    name: 'DeviceManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: DeviceManage,
  },
  {
    path: '/group-device',
    name: 'GroupManage',
    component: GroupManage,
  },
  {
    path: '/group-device/:id',
    name: 'GroupItem',
    component: GroupItem,

  },
  {
    path: '/device-management/:id',
    name: 'DeviceDetail',
    component: DeviceDetail,

  },
  {
    path: '/history-active',
    name: 'HistoryActive',
    component: HistoryActive,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
