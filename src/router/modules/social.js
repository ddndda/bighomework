import layout from '@/layout'
export default {
  path: '/social',
  component: layout,
  children: [{
    path: '',
    name: 'social',
    component: () => import('@/views/social'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  },
  {
    path: '/social/archive',
    component: () => import('@/views/social/historical.vue'),
    hidden: true, // 表示隐藏在左侧菜单
    meta: {
      title: '社保历史归档' // 显示在导航的文本
    }
  },
  {
    path: '/social/report',
    component: () => import('@/views/social/month.vue'),
    hidden: true, // 表示隐藏在左侧菜单
    meta: {
      title: '社保月份报表' // 显示在导航的文本
    }
  },
  {
    path: '/social/detail/:id',
    component: () => import('@/views/social/detail.vue'),
    hidden: true, // 表示隐藏在左侧菜单
    meta: {
      title: '社保详情' // 显示在导航的文本
    }
  }
  ]
}
