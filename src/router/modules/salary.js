import layout from '@/layout'
export default {
  path: '/salary',
  component: layout,
  name: 'salary',
  children: [
    {
      path: '',
      component: () => import('@/views/salary'),
      name: 'salary',
      meta: {
        icon: 'money',
        title: '工资'
      }
    },
    {
      path: '/salary/detail/:id/:yearMonth',
      name: 'salaryDetail',
      component: () => import('@/views/salary/detail.vue'),
      hidden: true,
      meta: {
        title: '工资详情'
      }
    },
    {
      path: '/salary/setting',
      name: 'salarySetting',
      component: () => import('@/views/salary/setting.vue'),
      hidden: true,
      meta: {
        title: '工资设置'
      }
    },
    {
      path: '/salary/report/:yearMonth',
      name: 'salaryReport',
      component: () => import('@/views/salary/month.vue'),
      hidden: true,
      meta: {
        title: '报表'
      }
    }
  ]
}
