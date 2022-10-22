import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import FlowchartView from '../views/FlowchartView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'flowchart',
    component: FlowchartView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
