<template>
  <div class="page-container">
    <!-- 年份选择 -->
    <div class="calendar-box">
      <el-date-picker
        v-model="yearVal"
        type="year"
        format="yyyy"
        value-format="yyyy"
        width="130px"
        placeholder="选择年"
        @change="handleChangeYear"
      />
    </div>
    <el-tabs value="first">
      <el-tab-pane label="员工历史归档" name="first" class="tab-body">
        <div v-loading="loading" class="data-area">
          <!-- 无数据时 -->
          <div v-show="showArchivig" class="archivig">该年份无归档报表</div>
          <!-- 有数据时 -->
          <div v-if="!showArchivig">
            <div v-for="( itemes, index) in tableData" :key="index" class="itemes">
              <!-- 报表 -->
              <div class="item-top-lab" :class="{act: itemes.act}">
                <div class="lab" @click="openTable(itemes,index)">
                  <i class="el-icon-arrow-right my-arrow" />
                </div>
                <div>
                  <p ref="sheelName" class="title">{{ itemes.archiveYear }}-{{ itemes.archiveMonth }}月员工报表</p>
                  <p class="labTit" @click="openTable(itemes,index)">考勤统计</p>
                </div>
                <div class="fill-flex" />
                <div class="people-num">
                  <p class="itemTit">
                    <span>总人数</span>
                  </p>
                  <p class="itemNum">{{ itemes.totalPeopleNum }}</p>
                </div>
                <div class="people-num">
                  <p class="itemTit">
                    <span>全勤人数</span>
                  </p>
                  <p class="itemNum">{{ itemes.fullAttePeopleNum }}</p>
                </div>
              </div>
              <!-- 报表展开body -->
              <div v-show="itemes.act" class="item-drop-dowm">
                <el-alert
                  title="迟到、早退和补签的统计单位为“次”；所有假期类型、外出、旷工的统计单位均为“天”。"
                  type="warning"
                  :closable="false"
                  show-icon
                />
                <div class="top-lab">
                  <div class="right-lab-box">
                    <a
                      class="el-button fr el-button--primary el-button--mini"
                      title="导出"
                      @click="()=>handleExport(itemes)"
                    >
                      导出
                    </a>
                  </div>
                </div>
                <el-table
                  id="item"
                  :data="contentData"
                  height="300"
                  border
                  style="width: 100%;text-align: center"
                >
                  <el-table-column prop="name" label="姓名" width="120" />
                  <el-table-column prop="workNumber" label="工号" width="150" />
                  <el-table-column prop="mobile" label="手机号" width="200" />
                  <el-table-column prop="department" label="部门" width="200" />
                  <el-table-column prop="leaveDays" label="事假" width="100" />
                  <el-table-column prop="dayOffLeaveDays" label="调休" width="100" />
                  <el-table-column prop="normalDays" label="正常" width="100" />
                  <el-table-column prop="laterTimes" label="迟到次数" width="100" />
                  <el-table-column prop="earlyTimes" label="早退次数" width="100" />
                  <el-table-column prop="absenceDays" label="旷工天数" width="100" />
                  <el-table-column prop="isFullAttendanceint" :formatter="(row, column, cellValue, index)=>fStandards(cellValue)" label="是否全勤" width="100" />
                  <el-table-column prop="actualAtteOfficialDays" label="实际出勤天数（正式）" width="180" />
                  <el-table-column prop="workingDays" label="应出勤工作日" width="120" />
                  <el-table-column prop="salaryOfficialDays" label="计薪天数（正式）" width="150" />
                </el-table>
              <!-- end -->
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import { getDepartment } from '@/api/department'
import {
  getArchivingList,
  getArchivingCont,
  exportHistoricalExcel
} from '@/api/attendance'
import FileSaver from 'file-saver'

export default {
  name: 'HistoricalArchiving',
  components: {
    // PageTool
  },
  data() {
    return {
      num: 0,
      yearVal: '',
      tableData: [],
      showArchivig: false,
      counts: '',
      requestParameters: {
        departmentId: '',
        year: ''
      },
      baseData: {
        atteArchiveMonthlyId: ''
      },
      loading: true,
      showHeight: 40,
      boxHeight: '',
      departmentData: [],
      contentData: []
    }
  },
  computed: {
    // 模糊搜索
    tables() {
      const search = this.baseData.keyword
      for (var i = 0; i < this.tableData.length; i++) {
        if (search) {
          this.tableData[i].contentData.filter(data => {
            return Object.keys(data).some(key => {
              return (
                String(data[key])
                  .toLowerCase()
                  .indexOf(search) > -1
              )
            })
          })
        } else {
          return this.tableData[i].contentData
        }
      }
      return null
    }
  },
  created() {
    const { preDates, preYear } = this.getMonth()
    this.yearVal = preDates
    this.requestParameters.year = preYear
    this.getDepartment()
  },
  methods: {
    getMonth: function() {
    /* 默认显示上个月的日期 */
      var nowdays = new Date()
      var year = nowdays.getFullYear()
      var month = nowdays.getMonth()
      if (month === 0) {
        month = 12
        year = year - 1
      }
      if (month < 10) {
        month = '0' + month
      }
      var preYear = year // 年
      var preDates = year + '-' + month // 上个月
      var preMonth = month // 上个月
      month++
      return {
        preDates: preDates,
        preYear: preYear,
        preMonth: preMonth
      }
    },
    fStandards(state) {
      return state === '1' ? '是' : '否'
    },
    async getArchivingList(params) {
      this.loading = true
      this.tableData = await getArchivingList(params)
      if (this.tableData.length === 0) {
        this.showArchivig = true
      } else {
        this.showArchivig = false
      }
      this.loading = false
    },
    // 部门
    async getDepartment() {
      this.departmentData = await getDepartment()
      this.requestParameters.departmentId = this.departmentData[0].id
      this.getArchivingList(this.requestParameters)
    },
    // 获取列表
    async openTable(obj, index) {
      this.baseData.atteArchiveMonthlyId = obj.id
      if (!obj.act) {
        this.contentData = await getArchivingCont(this.baseData)
        // this.loading = false
        this.$set(this.tableData[index], 'act', true)
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
    },
    // 下载文件
    async handleExport(item) {
      const res = await exportHistoricalExcel(item.archiveYear + item.archiveMonth, 2)
      FileSaver.saveAs(res, `${item.archiveYear}年${item.archiveMonth}月员工出勤历史归档.xlsx`)
    },
    // 选择部门
    handleChange(val) {
      this.requestParameters.departmentId = val
      this.init(this.requestParameters)
    },
    // 选择年份
    handleChangeYear() {
      this.requestParameters.year = this.yearVal
      this.getArchivingList(this.requestParameters)
      if (this.tableData.length === 0) {
        this.showArchivig = true
      } else {
        this.showArchivig = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../../styles/variables.scss";

.page-container {
  position: relative;
  .tab-body {
    min-height: 500px;
    .data-area {
      min-height: 500px;
      text-align: center;
      .archivig {
        padding-top: 200px;
        font-size: 14px;
        color: $secondFontColor;
      }
      .itemes {
      .item-top-lab {
        display: flex;
        align-items: center;
        gap: 40px;
        border-top: solid 1px #f0f0f0;
        border-bottom: solid 3px #ccc;
        padding: 15px 20px;
        .fill-flex {
          flex: 1;
        }
        .people-num {
          margin-right: 40px;
        }
        .labTit {
          cursor: pointer;
        }
        .title {
          font-size: 16px;
          margin: 10px 0;
          span {
            position: relative;
            bottom: -2px;
            font-size: 13px;
            color: #999;
            margin-left: 5px;
          }
        }
        .itemTit {
          color: #999;
          margin: 8px 0;
          font-size: 13px;
        }
        .itemNum {
          font-size: 20px;
          margin: 0;
        }
      }
      .item-drop-dowm {
        background: #fff;
        .top-lab {
          position: relative;
          padding: 15px 15px 30px;
          div {
            display: inline-block;
            margin: 0 10px;
            span {
              display: inline-block;
              position: relative;
              top: 2px;
              margin-right: 5px;
              width: 15px;
              height: 15px;
              background: $cl-1;
            }
          }
          .right-lab-box {
            position: absolute;
            right: -10px;
            top: 10px;
            .btn {
              border: solid 1px $green;
              color: $green;
              border-radius: 3px;
              padding: 4px 10px;
              font-size: 14px;
            }
          }
        }
      }
      .act {
        border-bottom: solid 3px $blue;
        .lab {
          color: $blue;
        }
        .labTit {
          color: $blue;
        }
      }
    }
    .itemes:hover {
      background: #fafbff;
    }
    .itemes .lab:hover {
      cursor: pointer;
    }
    }
  }
  .calendar-box {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 999;
  }
}

</style>
