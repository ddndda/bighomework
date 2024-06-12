import layout from '@/layout'
export default {
  path: '/approval',
  component: layout,
  name: 'approval',
  children: [
    {
      path: '',
      name: 'approval',
      component: () => import('@/views/approval'),
      meta: {
        title: '审批',
        name: 'approval',
        icon: 'tree-table'
      }
    },
    {
      path: '/approval/process_overtime/detail/:id',
      hidden: true,
      meta: {
        title: '加班申请'
      },
      component: () => import('@/views/approval/overtime.vue')
    },
    {
      path: '/approval/process_leave/detail/:id',
      hidden: true,
      meta: {
        title: '请假申请'
      },
      component: () => import('@/views/approval/leave.vue')
    },
    {
      path: '/approval/process_dimission/detail/:id',
      hidden: true,
      meta: {
        title: '离职申请'
      },
      component: () => import('@/views/approval/quit.vue')
    }
  ]
}
