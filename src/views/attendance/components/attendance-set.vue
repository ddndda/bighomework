<template>
  <div class="add-form">
    <el-dialog title="设置" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-tabs v-model="activeName" style="margin-left:20px" @tab-click="handleClick">
        <!-- 出勤设置 -->
        <el-tab-pane label="出勤设置" name="first">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="formBase"
            label-position="right"
            label-width="100px"
            style="width:700px;"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select v-model="formBase.departmentId" placeholder="请选择" @change="handleChange">
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出勤时间：" prop="time">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:59'
                }"
                :placeholder="formBase.morningStartTime"
                class="timePicker"
              />
              -
              <el-time-select
                v-model="formBase.morningEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.morningEndTime"
                class="timePicker"
              />
              <el-time-select
                v-model="formBase.afternoonStartTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonStartTime"
                class="timePicker"
              />
              -
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonEndTime"
                class="timePicker"
              />
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <!-- 请假设置 -->
        <el-tab-pane label="请假设置" name="second">
          <el-form
            ref="leaveForm"
            :rules="rules"
            :model="leaveBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="leaveBase.departmentId"
                placeholder="请选择"
                @change="handleChangeLeave"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <p>假期类型</p>
          <el-table ref="singleTable" :data="holidayList" style="width: 100%">
            <el-table-column prop="leaveType" label="类型" width="200">
              <template slot-scope="scope">
                {{ holidayType[scope.row.leaveType] }}
                {{ computedHolidayType(scope.row.leaveType) }}
              </template>
            </el-table-column>
            <el-table-column label="是否可用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isEnable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleLeave">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
          <el-alert type="warning" show-icon :closable="false" title>
            <template>
              <div class="tipInfo">
                <p>事假 请假单位为0.5天 只能提交工作日内的请假单</p>
                <p>当请假开关关闭后，员工则不可在员工端提交请假申请</p>
              </div>
            </template>
          </el-alert>
        </el-tab-pane>
        <!-- 扣款设置 -->
        <el-tab-pane label="扣款设置" name="third">
          <el-form
            ref="deductionsForm"
            :rules="rules"
            :model="deductionsBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="deductionsBase.departmentId"
                placeholder="请选择"
                @change="handleChangeDeductions"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <el-table ref="singleTable" :data="stateData" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  {{ lateType[scope.row.dedTypeCode] }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleStatus($event,scope.row)"
                  />
                </div>

                <div v-if="scope.row.dedTypeCode==='51000'" class="attentInfo">
                  <p>
                    迟到≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                      @input.native="handleInput($event)"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event,true)"
                      />元
                    </p>
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.timesLowerLimit"
                        class="inputInfo"
                        disabled
                        @input.native="handleInput($event)"
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                        @input.native="handleInput($event,true)"
                      />元
                    </p>
                  </div>
                  <p>
                    迟到>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次旷工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                        @input.native="e=>scope.row.absenceDays=e.target.value?.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')"
                      />天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='52000'" class="attentInfo">
                  <p>
                    早退≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                      @input.native="handleInput($event)"
                    />分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      早退≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event,true)"
                      />元
                    </p>
                    <p>
                      早退>
                      <el-input v-model="scope.row.timesLowerLimit" class="inputInfo" disabled />次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                        @input.native="handleInput($event,true)"
                      />元
                    </p>
                  </div>
                  <p>
                    早退>
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟
                  </p>
                  <div style="padding-left:120px;">
                    <p>
                      早退>
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />次，每次旷工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                        @input.native="e=>scope.row.absenceDays=e.target.value?.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')"
                      />天
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='53000'" class="attentInfo">
                  <p>
                    旷工按
                    <el-input
                      v-model="scope.row.fineSalaryMultiples"
                      class="inputInfo"
                      @input.native="handleInput($event)"
                    />倍工资处罚
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <!-- 加班设置 -->
        <el-tab-pane label="加班设置" name="fourth">
          <el-form
            ref="overtimeForm"
            :model="overtimeBase"
            :rules="overtimeRule"
            label-width="110px"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="overtimeBase.departmentId"
                placeholder="请选择"
                @change="handleChangeovertime"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="加班规则：">
              <div v-for="item in overtimeBase.rules" :key="item.id" class="ruleInfo">
                <el-row>
                  <el-col :span="10">
                    <div class="grid-content bg-purple">
                      <el-switch v-model="item.isEnable" :active-value="1" :inactive-value="0" />
                      &nbsp;&nbsp;{{ item.rule }}
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="grid-content bg-purple-light">
                      <span class="pad">
                        <el-checkbox v-model="item.isTimeOff" :true-label="1" :false-label="0">调休假</el-checkbox>
                      </span>
                      <template>
                        <el-time-select
                          v-model="item.ruleStartTime"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59'
                          }"
                          style="width:100px;"
                          :disabled="item.isTimeOff===0"
                        />&nbsp;
                        <el-time-select
                          v-model="item.ruleEndTime"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59',
                            minTime: item.startTime
                          }"
                          style="width:100px;"
                          :disabled="item.isTimeOff===0"
                        />
                      </template>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="打卡验证：" prop="isClock">
              <el-switch v-model="overtimeBase.isClock" :active-value="1" :inactive-value="0" />&nbsp;&nbsp;加班需要有打卡记录
            </el-form-item>
            <el-form-item label="开启补偿：" prop="isCompensationint">
              <el-switch v-model="overtimeBase.isCompensationint" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="调休假设置：" prop="latestEffectDate">
              <div class="ruleInfo">
                最晚有效期： 次年
                <el-date-picker
                  v-model="overtimeBase.latestEffectDate"
                  type="date"
                  placeholder="选择日期"
                  style="width:150px;"
                  format="MM-dd"
                  value-format="MM-dd"
                />
              </div>
            </el-form-item>
            <el-form-item label prop="unit">
              <div class="ruleInfo">
                <p>
                  请假最小单位
                  <el-input v-model="overtimeBase.unit" style="width:50px" />天
                </p>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleOvertime">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployee } from '@/api/employee'
import { getDepartment } from '@/api/department'
import {
  attendanceSave,
  getAttendance,
  leaveSave,
  getLeave,
  getDeductions,
  overtimeSave,
  getOvertime,
  deductionsSave
} from '@/api/attendance'
import { Message } from 'element-ui'

export default {
  name: 'Add',
  props: [],
  data() {
    return {
      lateType: {
        '51000': '迟到扣款',
        '52000': '早退扣款',
        '53000': '旷工扣款'
      },
      holidayType: [
        {
          id: '60000',
          name: '年假'
        },
        {
          id: '60100',
          name: '事假'
        },
        {
          id: '60200',
          name: '病假'
        },
        {
          id: '60300',
          name: '婚假'
        },
        {
          id: '60400',
          name: '丧假'
        },
        {
          id: '60500',
          name: '产假'
        },
        {
          id: '60600',
          name: '奖励产假'
        },
        {
          id: '60700',
          name: '陪产假'
        },
        {
          id: '60800',
          name: '探亲假'
        },
        {
          id: '60900',
          name: '工伤假'
        },
        {
          id: '61000',
          name: '调休假'
        },
        {
          id: '61100',
          name: '产检假'
        },
        {
          id: '61200',
          name: '流产假'
        },
        {
          id: '61300',
          name: '长期病假'
        }
      ],
      dialogFormVisible: false,
      isShowSelect: false,
      formOfEmployment: '',
      activeName: 'first',
      formBase: {
        morningStartTime: '',
        morningEndTime: '',
        afternoonStartTime: '',
        afternoonEndTime: '',
        departmentId: ''
      },
      leaveBase: {
        departmentId: ''
      },
      deductionsBase: {
        departmentId: ''
      },
      overtimeBase: {
        departmentId: '',
        isClock: 0,
        isCompensationint: 0,
        latestEffectDate: '',
        unit: '',
        rules: []
      },
      departmentData: [],
      stateData: [],
      holidayList: [],
      tylelist: [],
      deductionList: [],
      rules: {
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        time: [
          {
            required: true, message: '请选择时间', trigger: 'change', validator: this.validateTime
          }
        ]
      },
      overtimeRule: {
        // 表单验证
        unit: [
          { required: true, message: '调休单位不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        latestEffectDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 根据返回请假类型的编号 获取请假名称
    computedHolidayType: function() {
      return function(id) {
        const res = this.holidayType.find(item => item.id === id)
        return res?.name
      }
    }
  },
  watch: {
    dialogFormVisible: function(newVisible) {
      if (newVisible) {
        switch (this.activeName) {
          case 'first':
            this.handleChange(this.formBase.departmentId)
            break
          case 'second':
            this.handleChangeLeave(this.leaveBase.departmentId)
            break
          case 'third':
            this.handleChangeDeductions(this.deductionsBase.departmentId)
            break
          case 'fourth':
            this.handleChangeovertime(this.overtimeBase.departmentId)
            break

          default:
            break
        }
      }
    }
  },
  // 创建完毕状态
  created() {
    this.getDepartment() // 获取部门数据
    this.stateData = []
  },

  methods: {
    // 业务方法
    // 获取部门
    async getDepartment() {
      this.departmentData = await getDepartment()
      this.formBase.departmentId = this.leaveBase.departmentId = this.deductionsBase.departmentId = this.overtimeBase.departmentId = this.departmentData[0].id
      this.handleChange(this.formBase.departmentId)
    },
    // 弹层显示
    dialogFormV() {
      this.dialogFormVisible = true
    },
    // 弹层隐藏
    dialogFormH() {
      this.dialogFormVisible = false
    },
    // 关闭后清除表单数据、校验
    clearFormDate() {
      this.$refs.dataForm.resetFields()
      this.$refs.overtimeForm.resetFields()
    },
    // 退出
    handleClose() {
      this.dialogFormH()
      this.clearFormDate()
    },
    // 界面交互
    // 表单提交
    createData() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          await addEmployee(this.formBase)
          this.$emit('clearFormDate', this.formBase)
          this.formBase = {}
          this.$emit('doQuery', this.requestParameters)
          this.dialogFormVisible = false
        }
      })
    },
    // 出勤设置选择部门
    async handleChange(departmentId) {
      const res = await getAttendance(departmentId)
      this.formBase.departmentId = departmentId
      this.formBase.id = res.id
      this.formBase.companyId = res.companyId
      this.formBase.afternoonEndTime = res.afternoonEndTime
      this.formBase.afternoonStartTime = res.afternoonStartTime
      this.formBase.morningEndTime = res.morningEndTime
      this.formBase.morningStartTime = res.morningStartTime
    },
    // 出勤配置保存更新
    async handleAttendance() {
      try {
        await this.$refs.dataForm.validate()
        await attendanceSave(this.formBase)
        Message.success('出勤时间设置成功!')
        this.$emit('dataSearch')
        this.$refs.dataForm.resetFields()
        this.dialogFormVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    // 请假选择部门
    async handleChangeLeave(id) {
      this.leaveBase.departmentId = id
      const list = await getLeave(id)
      this.holidayList = list
    },
    // 请假配置保存更新
    async handleLeave() {
      await this.$refs.leaveForm.validate()
      await leaveSave(this.holidayList)
      this.$emit('dataSearch')
      this.handleClose()
      Message.success('请假设置保存成功!')
    },
    // 扣款选择部门
    async handleChangeDeductions(id) {
      const res = await getDeductions(id)
      this.stateData = res
    },
    // 扣款配置保存更新
    async handleDeductions() {
      await this.$refs.deductionsForm.validate()
      await deductionsSave(this.stateData)
      this.$emit('dataSearch')
      this.handleClose()
    },
    // 加班选择部门
    async handleChangeovertime(id) {
      const data = await getOvertime(id)
      this.overtimeBase.departmentId = id
      this.overtimeBase.rules = data.extraDutyRuleList
      this.overtimeBase.latestEffectDate = data.dayOffConfigs.latestEffectDate
      this.overtimeBase.unit = data.dayOffConfigs.unit
      this.overtimeBase.isClock = data.extraDutyConfig.isClock
      this.overtimeBase.isCompensationint = data.extraDutyConfig.isCompensationint
    },

    // 加班配置保存更新
    async  handleOvertime() {
      await this.$refs.overtimeForm.validate()
      await overtimeSave(this.overtimeBase)
      this.$emit('dataSearch')
      this.handleClose()
    },
    // 点击设置标签
    handleClick(tab, event) {
      if (tab.index === '0') {
        if (this.formBase.departmentId !== '') {
          this.handleChange(this.formBase.departmentId)
        }
      }
      if (tab.index === '1') {
        if (this.leaveBase.departmentId !== '') {
          this.handleChangeLeave(this.leaveBase.departmentId)
        }
      } else if (tab.index === '2') {
        if (this.deductionsBase.departmentId !== '') {
          this.handleChangeDeductions(this.deductionsBase.departmentId)
        }
      } else {
        if (this.overtimeBase.departmentId !== '') {
          this.handleChangeovertime(this.overtimeBase.departmentId)
        }
      }
    },
    typeTip(obj) {
      this.$message.error(obj)
    },
    testInt(num) {
      if (!(Number(num) % 1 === 0 && Number(num) !== 0)) {
        Message.error('请输入正整数!')
        return false
      }
      return true
    },
    testNum(num) {
      if (!(Number(num) % 1 === 0)) {
        Message.error('请输入整数!')
        return false
      }
      return true
    },
    // 验证输入正整数
    handleInput: function(e, canEmpty) {
      if (canEmpty) {
        this.testNum(e.target.value)
      } else {
        this.testInt(e.target.value)
      }
    },
    // 校验出勤设置中的时间
    validateTime(_, __, callback) {
      if (this.formBase.morningStartTime && this.formBase.morningEndTime && this.formBase.afternoonStartTime && this.formBase.afternoonEndTime) {
        callback()
      } else {
        callback(new Error('请选择时间'))
      }
    },
    //
    handleStatus(e, obj) {
      obj.departmentId = this.deductionsBase.departmentId
      if (this.deductionsBase.departmentId === '') {
        this.$message.error('请选择部门')
        return false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.inputInfo{width: 55px;}

.attentInfo {
  p {
    padding: 3px 0;
  }
  .el-input--medium {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}
.titmInfo {
  .timePicker {
    margin-bottom: 20px;
  }
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 15px 0 0;
  }
}
.ruleInfo {
  .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-dialog {
  min-width: 770px;
}
::v-deep .el-date-picker__header {
  display: none;
}
.tipInfo {
  p {
    padding: 5px 0;
  }
}
.titInfo {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  line-height: 30px;
  padding: 0 0 15px;
}
.attentInfo {
  padding: 30px 15px 15px 80px;
  .deductionInfo {
    margin-left: 100px;
  }
}
.ruleInfo {
  margin-bottom: 5px;
  .pad {
    margin-right: 10px;
    padding-left: 30px;
  }
}
</style>
