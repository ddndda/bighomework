import layout from '@/layout'
export default {
  path: '/attendance',
  name: 'attendance',
  component: layout,
  children: [
    {
      path: '',
      name: 'attendance',
      component: () => import('@/views/attendance'),
      meta: {
        title: '考勤',
        icon: 'excel'
      }
    },
    {
      path: '/attendances/report/:month?', // 员工详情的地址
      component: () => import('@/views/attendance/report.vue'),
      hidden: true, // 表示隐藏在左侧菜单
      meta: {
        title: '报表' // 显示在导航的文本
      }
    },
    {
      path: '/attendances/archiving', // 员工详情的地址
      component: () => import('@/views/attendance/historical.vue'),
      hidden: true, // 表示隐藏在左侧菜单
      meta: {
        title: '历史归档' // 显示在导航的文本
      }
    },
    {
      path: '/import/:type', // 员工详情的地址
      component: () => import('@/views/attendance/import.vue'),
      hidden: true, // 表示隐藏在左侧菜单
      meta: {
        title: '导入' // 显示在导航的文本
      }
    }
  ]
}
