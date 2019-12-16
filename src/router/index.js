import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/Layout'
import Login from '@/views/Login'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/',
      component: Layout,
      children: [
        //首页
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home'),
          meta: {
            title: '统计'
          },
          // alias: '/'
        },

        // 轮播图管理
        {
          path: '/manage/Carousel',
          name: 'Carousel',
          component: () => import('@/views/manage/Carousel'),
          meta: {
            title: '轮播图管理'
          }
        },

        // 一级分类管理
        {
          path: '/manage/FirstClass',
          name: 'FirstClass',
          component: () => import('@/views/manage/FirstClass'),
          meta: {
            title: '一级分类管理'
          }
        },

        // 商城商品管理
        {
          path: '/manage/Goods',
          name: 'Goods',
          component: () => import('@/views/manage/Goods'),
          meta: {
            title: '商城商品管理'
          }
        },

        // 兑换区商品管理
        {
          path: '/manage/Exchange',
          name: 'Exchange',
          component: () => import('@/views/manage/Exchange'),
          meta: {
            title: '兑换区商品管理'
          }
        },

        //会员管理
        {
          path: '/manage/Member',
          name: 'Member',
          component: () => import('@/views/manage/Member'),
          meta: {
            title: '会员管理'
          }
        },

        // 会员打款订单
        {
          path: '/order/MemberPayout',
          name: 'MemberPayout',
          component: () => import('@/views/order/MemberPayout'),
          meta: {
            title: '会员打款订单'
          }
        },

        // 会员商城购物订单
        {
          path: '/order/MemberShopping',
          name: 'MemberShopping',
          component: () => import('@/views/order/MemberShopping'),
          meta: {
            title: '会员商城购物订单'
          }
        },

        // 会员兑换订单
        {
          path: '/order/MemberExchange',
          name: 'MemberExchange',
          component: () => import('@/views/order/MemberExchange'),
          meta: {
            title: '会员兑换订单'
          }
        },

        // 用户协议公告
        {
          path: '/announce/User',
          name: 'User',
          component: () => import('@/views/announce/User'),
          meta: {
            title: '用户协议'
          }
        },

        // 平台公告
        {
          path: '/announce/Platform',
          name: 'Platform',
          component: () => import('@/views/announce/Platform'),
          meta: {
            title: '平台公告'
          }
        },

        // 系统设置
        {
          path: '/settings/System',
          name: 'System',
          component: () => import('@/views/settings/System'),
          meta: {
            title: '系统设置'
          }
        },

        // 收款设置
        {
          path: '/settings/Collection',
          name: 'Collection',
          component: () => import('@/views/settings/Collection'),
          meta: {
            title: '收款设置'
          }
        },
      ]
    }
  ]
})