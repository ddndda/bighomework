<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <template v-slot:before>
          <div class="before-box">
            <p>未处理</p>
            {{ attendInfo.tobeTaskCount }}
          </div>
        </template>
        <template v-slot:after>
          <!-- <el-button size="mini" type="warning" @click="setRemind">提醒</el-button> -->
          <el-button size="mini" type="primary" @click="handleSet">设置</el-button>
        </template>
      </page-tools>
      <!-- 筛选栏 -->
      <el-card class="hr-block">
        <el-form ref="formData" :model="formData" label-width="120px" class="formInfo">
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.deptID">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.id"
                @change="searchParamsChange"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 考勤数据 -->
      <el-card class="hr-block">
        <!-- 考勤列表 -->
        <div style="width:100%;position: relative;overflow-x: auto; overflow-y: hidden;">
          <div style="width: 3000px;">
            <table border="0" align="center" cellpadding="0" cellspacing="0" class="tableInfo">
              <tr>
                <th>序号</th>
                <th>姓名</th>
                <th>工号</th>
                <th>部门</th>
                <th>手机</th>
                <th v-for="(it, ind) in monthOfReport" :key="ind">{{ attendInfo.month }}/{{ ind + 1 }}</th>
              </tr>
              <tr v-for="(item, index) in list" :key="item.id">
                <td>{{ index+1+(page.page-1)*page.pagesize }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.workNumber }}</td>
                <td>{{ item.departmentName }}</td>
                <td>{{ item.mobile }}</td>
                <td
                  v-for="(it,ind) in item.attendanceRecord"
                  :key="ind"
                  @click="showChangeDialog(item.id,item.departmentId,it.adtStatu,it.day,item.name)"
                >
                  <span v-for="att in attStatus" :key="att.key">
                    <span v-if="att.key===it?.adtStatu">
                      {{ att.attName }}
                    </span>
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 分页组件 -->
        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :page-size="page.pagesize"
            :current-page="page.page"
            layout="prev, pager, next"
            :total="page.total"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 提醒组件 -->
    <el-dialog
      title="提醒"
      :visible.sync="tipsDialogVisible"
      width="280px"
      center
    >
      <div class="attenInfo">
        <p>系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSub">我知道了</el-button>
        <el-button @click="centerDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 设置组件弹层 -->
    <attendance-set ref="set" @handleCloseModal="handleCloseModal" />
    <!-- 修改员工考勤状态弹层 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span slot="title">
        {{ attendInfo.name }} {{ attendInfo.month }}/{{ attendInfo.getDate }}（实际工作日考勤方案）
      </span>
      <div class="attenInfo">
        <p class="colRed">注：统计考勤时，异常状态优先正常状态</p>
        <p class="check">
          <el-radio-group v-model="modifyData.adtStatu">
            <el-radio
              v-for="(item) in userAttState"
              :key="item.key"
              :label="item.key"
            >
              {{ item.attName }}
            </el-radio>
          </el-radio-group>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="btnOK">确定</el-button>
        <el-button @click="centerDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAttendancesList, getUserAttStatus, updateAttendance } from '@/api/attendance'
import AttendanceSet from './components/attendance-set'
import { getDepartment } from '@/api/department'
import pageTools from './components/page-tools.vue'
export default {
  name: 'Attendances',
  components: { AttendanceSet, pageTools },
  data() {
    return {
      list: [],
      stateData: {
        // 假期类型

        vacationtype: [{
          id: '1',
          name: '正常'
        }, {
          id: '2',
          name: '旷工'
        }, {
          id: '3',
          name: '迟到'
        }, {
          id: '4',
          name: '早退'
        }, {
          id: '5',
          name: '外出'
        }, {
          id: '6',
          name: '出差'
        }, {
          id: '7',
          name: '年假'
        }, {
          id: '8',
          name: '事假'
        }, {
          id: '9',
          name: '病假'
        }, {
          id: '10',
          name: '婚假'
        }, {
          id: '11',
          name: '丧假'
        }, {
          id: '12',
          name: '产假'
        }, {
          id: '13',
          name: '奖励产假'
        }, {
          id: '14',
          name: '陪产假'
        }, {
          id: '15',
          name: '探亲假'
        }, {
          id: '16',
          name: '工伤假'
        }, {
          id: '17',
          name: '调休'
        }, {
          id: '18',
          name: '产检假'
        }, {
          id: '19',
          name: '流产假'
        }, {
          id: '20',
          name: '长期病假'
        }, {
          id: '21',
          name: '测试假'
        }, {
          id: '22',
          name: '补签'
        }

        ],
        type: [{
          leaveType: '60000',
          name: '年假',
          isEnable: false
        },
        {
          leaveType: '60100',
          name: '事假',
          isEnable: false
        },
        {
          leaveType: '60200',
          name: '病假',
          isEnable: false
        },
        {
          leaveType: '60300',
          name: '婚假',
          isEnable: false
        },
        {
          leaveType: '60400',
          name: '丧假',
          isEnable: false
        },
        {
          leaveType: '60500',
          name: '产假',
          isEnable: false
        },
        {
          leaveType: '60600',
          name: '奖励产假',
          isEnable: false
        },
        {
          leaveType: '60700',
          name: '陪产假',
          isEnable: false
        },
        {
          leaveType: '60800',
          name: '探亲假',
          isEnable: false
        },
        {
          leaveType: '60900',
          name: '工伤假',
          isEnable: false
        },
        {
          leaveType: '61000',
          name: '调休假',
          isEnable: false
        },
        {
          leaveType: '61100',
          name: '产检假',
          isEnable: false
        },
        {
          leaveType: '61200',
          name: '流产假',
          isEnable: false
        },
        {
          leaveType: '61300',
          name: '长期病假',
          isEnable: false
        },
        {
          leaveType: '61400',
          name: '测试假',
          isEnable: false
        }
        ],
        departmentType: [{
          dedTypeCode: '51000',
          name: '迟到扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        },
        {
          dedTypeCode: '52000',
          name: '早退扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        },
        {
          dedTypeCode: '53000',
          name: '旷工扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        }
        ],
        overtimeType: [{
          // id: '1',
          departmentId: '', // 部门ID
          rule: '工作日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        },
        {
          // id: '2',
          departmentId: '', // 部门ID
          rule: '休息日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        },
        {
          // id: '3',
          departmentId: '', // 部门ID
          rule: '法定节假日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        }
        ]
      },
      attStatus: [],
      userAttState: [],
      departments: [],
      monthOfReport: '',
      centerDialogVisible: false,
      tipsDialogVisible: false,
      month: '',
      yearMonth: '',
      loading: false,
      attendInfo: {
        month: '',
        getDate: '',
        getInfo: '',
        name: '',
        counts: '',
        tobeTaskCount: ''
      },
      formData: {
        page: 1,
        pagesize: 10,
        deptID: [],
        stateID: ''
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 修改考勤状态弹层
      modifyData: {
        userId: '',
        day: '',
        adtStatu: ''
      }
    }
  },
  // 创建完毕状态
  created() {
    this.getAttendancesList({ page: this.page.page, pagesize: this.page.pagesize }) // 获取考勤列表
    this.getDepartment() // 获取考勤列表
    this.getAllAttType()
  },
  methods: {
    // 暂时不处理
    handleSub() {
      this.tipsDialogVisible = false
      this.$message.success('提醒成功')
    },
    // 设置
    handleSet() {
      this.$refs.set.dialogFormV()
    },
    // 弹框关闭
    handleCloseModal() {
      this.$refs.set.dialogFormH()
    },
    // 获取组织列表
    async getDepartment() {
      const res = await getDepartment()
      this.departments = res
    },
    // 初始化数据list
    async getAttendancesList(params) {
      this.loading = true
      const { data, monthOfReport, tobeTaskCount, yearOfReport } = await getAttendancesList(params)
      this.list = data.rows // 当前记录
      this.page.total = data.total // 总条数
      this.attendInfo.counts = data.total
      this.attendInfo.month = monthOfReport
      this.attendInfo.tobeTaskCount = tobeTaskCount
      var date = new Date()
      var year = date.getFullYear()
      const month = monthOfReport
      var d = new Date(year, month, 0) // 获取月份
      this.monthOfReport = d.getDate() // 获取日期
      this.yearMonth = year + ('' + (month < 10 ? '0' + month : month))
      this.month = monthOfReport
      this.yearMonth = '' + yearOfReport + monthOfReport
      this.loading = false
    },
    // 获取所有考勤类型
    async  getAllAttType() {
      const res = await getUserAttStatus()
      const newArr = this.formatArr(res)
      this.attStatus = newArr
    },
    // 确定修改user出勤状态
    async  btnOK() {
      await updateAttendance(this.modifyData)
      this.$message.success('更新成功')
      this.centerDialogVisible = false
      this.getAttendancesList({ page: this.page.page, pagesize: this.page.pagesize, deptID: this.formData.deptID.join(), stateID: this.formData.stateID }) // 成功之后 重新拉取数据
    },
    // 页码改变
    pageChange(page) {
      this.page.page = page
      this.getAttendancesList({ ...this.page, stateID: this.formData.stateID }) // 获取数据
    },
    async showChangeDialog(id, departmentId, adtStatu, day, name) {
      const res = await getUserAttStatus(id)
      // 数据处理
      const newArr = this.formatArr(res)
      this.userAttState = newArr
      this.modifyData.userId = id
      this.modifyData.day = day
      this.modifyData.departmentId = departmentId
      this.modifyData.adtStatu = adtStatu // 数字转成字符串

      if (adtStatu !== '') {
        this.attendInfo.getDate = day.slice(-2)
        this.attendInfo.getInfo = adtStatu
        this.attendInfo.name = name
        this.centerDialogVisible = true
      }
    },
    // 数据处理
    formatArr(arr) {
      // 数据处理
      const newArr = arr.map(item => {
        return {
          key: Number(Object.keys(item)[0]),
          attName: Object.values(item)[0]
        }
      })
      return newArr
    },
    // 提醒
    setRemind() {
      console.log('提醒')
      this.$confirm('系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送1 次。', '提醒', {
        confirmButtonText: '我知道了',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '发送成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    searchParamsChange() {
      this.page.page = 1
      this.getAttendancesList({ ...this.formData, deptID: this.formData.deptID.join() })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tableInfo {
    margin: 0;
    line-height: 36px;
    border: solid 1px #ebeef5;
    border-right: 0 none;
    border-bottom: 0 none;
    tr {
      th {
        height: 50px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
        border-bottom: 2px solid #e8e8e8;
        background: #fafafa;
        min-width:  120px;
      }
      td {
        height: 36px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
      }
    }
  }

.attenInfo {
  p {
    &.check {
      padding: 20px 0 0;
    }
    .el-radio {
        display: inline-block;
        padding: 5px 0;
        width: 60px;

    }
  }
}

.formInfo {
  .el-radio{
    height: 30px;
    line-height: 30px;
  }
}

.before-box {
    display: inline-block;
    margin-right: 10px;
    text-align: center;
}
</style>
