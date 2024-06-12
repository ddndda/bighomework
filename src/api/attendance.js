import request from '@/utils/request'
// 获取考勤列表
export function getAttendancesList(params) {
  return request({
    url: '/attendances',
    params
  })
}
// 获取考勤详情
export function getAtteArchiveDetail(userId, yearMonth) {
  return request({
    url: `/attendances/archive/${userId}/${yearMonth}`
  })
}
export function updateAttendance(data) {
  return request({
    url: `/attendances/${data.userId}`,
    method: 'put',
    data
  })
}
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year',
    params
  })
}
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`,
    params
  })
}

export function importArchive(data) {
  return request({
    url: '/archive/atte/export',
    method: 'post',
    // responseType: 'blob', // 使用blob接收二进制文件流
    data
  })
}
// 提醒接口
export function notify() {
  return request({
    url: '/notify/mail',
    method: 'post'
  })
}
export function archives(params) {
  return request({
    url: '/attendances/archives',
    params
  })
}
export function newReports(params) {
  return request({
    url: '/attendances/newReports',
    params
  })
}
export function information() {
  return request({})
}

export function pay() {
  return request({})
}
export function reportFormList(params) {
  return request({
    url: '/attendances/reports',
    params
  })
}

// 请假保存
export function leaveSave(data) {
  return request({
    url: '/cfg/leave',
    method: 'post',
    data
  })
}
// 请假获取
export function getLeave(departmentId) {
  return request({
    url: '/cfg/leave/list',
    params: {
      departmentId
    }
  })
}
// 扣款设置保存
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction',
    method: 'post',
    data
  })
}
// 获取扣款设置
export function getDeductions(departmentId) {
  return request({
    url: '/cfg/ded/list',
    params: {
      departmentId
    }
  })
}

// 加班配置保存
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}

// 获取加班配置
export function getOvertime(departmentId) {
  return request({
    url: '/cfg/extDuty/item',
    params: {
      departmentId
    }
  })
}
// 考勤数据保存
export function attendanceSave(data) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}
// 考勤数据保存
export function getAttendance(departmentId) {
  return request({
    url: '/cfg/atte/item',
    params: {
      departmentId
    }
  })
}
// 获取员工考勤状态
export function getUserAttStatus(userId) {
  return request({
    url: '/attendances/adtStatu/list',
    params: {
      userId
    }
  })
}
export function fileUpdate(data) {
  return request({
    url: `/employee/archives/${data.month}`,
    method: 'put',
    data
  })
}

// 导出历史考勤月份报告
export function exportHistoricalExcel(yearMonth, opType) {
  return request({
    url: `/attendances/historys/${yearMonth}/export`,
    params: {
      opType
    },
    responseType: 'blob'
  })
}
