<template>
  <div class="dashboard">
    <div class="container">
      <!-- 左侧内容 -->
      <div class="left">
        <div class="panel">
          <!-- 个人信息 -->
          <div class="user-info">
            <img v-if="avatar" class="avatar" :src="avatar" alt="">
            <span v-else class="username">{{ name?.charAt(0) }}</span>
            <div class="company-info">
              <div class="title">
                江苏传智播客教育科技股份有限公司
                <span>体验版</span>
              </div>
              <div class="depart">{{ name }} ｜ {{ company }}-{{ departmentName }}</div>
            </div>
          </div>
          <!-- 代办 -->
          <div class="todo-list">
            <div class="todo-item">
              <span>组织总人数</span>
              <!-- 起始值 终点值 动画时间 -->
              <count-to
                :start-val="0"
                :end-val="homeData.employeeTotal"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>正式员工</span>
              <count-to
                :start-val="0"
                :end-val="homeData.regularEmployeeTotal"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>合同待签署</span>
              <count-to
                :start-val="0"
                :end-val="homeData.contractSignTotal"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>待入职</span>
              <count-to
                :start-val="0"
                :end-val="homeData.toBeEmployed"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>本月待转正</span>
              <count-to
                :start-val="0"
                :end-val="homeData.toBeConfirmed"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>本月待离职</span>
              <count-to
                :start-val="0"
                :end-val="homeData.toBeDismissed"
                :duration="1000"
              />
            </div>
            <div class="todo-item">
              <span>接口总访问</span>
              <count-to
                :start-val="0"
                :end-val="homeData.interfaceAccessTotal"
                :duration="1000"
              />
            </div>
          </div>
        </div>
        <!-- 快捷入口 -->
        <div class="panel">
          <div class="panel-title">快捷入口</div>
          <div class="quick-entry">
            <div
              class="entry-item"
              @click="()=>this.$router.push('/approval')"
            >
              <div class="entry-icon approval" />
              <span>假期审批</span>
            </div>
            <div
              class="entry-item"
              @click="()=>this.$router.push('/social')"
            >
              <div class="entry-icon social" />
              <span>社保管理</span>
            </div>
            <div
              class="entry-item"
              @click="()=>this.$router.push('/role')"
            >
              <div class="entry-icon role" />
              <span>角色管理</span>
            </div>
            <div
              class="entry-item"
              @click="()=>this.$router.push('/employee/detail')"
            >
              <div class="entry-icon salary" />
              <span>添加员工</span>
            </div>
            <div
              class="entry-item"
              @click="()=>this.$router.push('/permission')"
            >
              <div class="entry-icon bpm" />
              <span>添加权限</span>
            </div>
          </div>
        </div>
        <!-- 图表数据 -->
        <div class="panel">
          <div class="panel-title">社保申报数据</div>
          <div class="chart-container">
            <div class="chart-info">
              <div class="info-main">
                <span>申报人数</span>
                <!-- homeData: {} -->
                <count-to
                  :start-val="0"
                  :end-val="homeData.socialInsurance?.declarationTotal"
                  :duration="1000"
                />

              </div>
              <div class="info-list">
                <div class="info-list-item">
                  <span>待申报(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.socialInsurance?.toDeclareTotal"
                    :duration="1000"
                  />
                </div>
                <div class="info-list-item">
                  <span>申报中(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.socialInsurance?.declaringTotal"
                    :duration="1000"
                  />
                </div>
                <div class="info-list-item">
                  <span>已申报(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.socialInsurance?.declaredTotal"
                    :duration="1000"
                  />
                </div>
              </div>
            </div>
            <div class="chart">
              <!-- 图表 -->
              <div ref="social" style=" width: 100%; height:100% " />
            </div>
          </div>
        </div>
        <!-- 图表数据 -->
        <div class="panel">
          <div class="panel-title">公积金申报数据</div>
          <div class="chart-container">
            <div class="chart-info">
              <div class="info-main">
                <span>申报人数</span>
                <count-to
                  :start-val="0"
                  :end-val="homeData.providentFund?.declarationTotal"
                  :duration="1000"
                />
              </div>
              <div class="info-list">
                <div class="info-list-item">
                  <span>待申报(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.providentFund?.toDeclareTotal"
                    :duration="1000"
                  />
                </div>
                <div class="info-list-item">
                  <span>申报中(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.providentFund?.declaringTotal"
                    :duration="1000"
                  />
                </div>
                <div class="info-list-item">
                  <span>已申报(人)</span>
                  <count-to
                    :start-val="0"
                    :end-val="homeData.providentFund?.declaredTotal"
                    :duration="1000"
                  />
                </div>
              </div>
            </div>
            <div class="chart">
              <!-- 图表 -->
              <div ref="provident" style=" width: 100%; height:100% " />
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right">
        <!-- 帮助链接 -->
        <div class="right-top-box">
          <div class="panel link-box">
            <div class="panel-title">帮助链接</div>
            <div class="help">
              <div class="help-list">
                <div class="help-block">
                  <i class="icon-entry" />
                  入门指南
                </div>
                <div class="help-block">
                  <i class="icon-help" />
                  在线帮助手册
                </div>
                <div class="help-block">
                  <i class="icon-support" />
                  联系技术支持
                </div>
                <div class="help-block">
                  <i class="icon-add" />
                  添加链接
                </div>
              </div>
            </div>
          </div>
          <div class="panel calendar-box">
            <div class="caledar-head">
              {{ date.getFullYear() + ' 年 '+(date.getMonth() + 1) + ' 月 ' + date.getDate() + ' 日' }}
              <div>
                <el-button type="text" @click="prevMonth">
                  <i class="el-icon-arrow-left" />
                </el-button>
                <el-button type="text" @click="nextMonth">
                  <i class="el-icon-arrow-right" />
                </el-button>
              </div>

            </div>
            <div class="calendar">
              <el-calendar :value="date" />
            </div>
          </div>
        </div>
        <!-- 通知公告 -->
        <div class="panel">
          <div class="panel-title">通知公告</div>
          <div class="information-list">
            <div v-for="(item,index) in list" :key="index" class="information-list-item">
              <img :src="item.icon" alt="">
              <div>
                <p>
                  <span class="name">
                    {{ item.notice.split(' ')[0] }}
                  </span>
                  <span class="action">
                    {{ item.notice.split(' ')[1] }}
                  </span>
                  {{ item.notice.split(' ')[2] }}
                </p>
                <p>{{ item.createTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { getHomeData, getMessageList } from '@/api/home'
// import * as echarts from 'echarts' // 引入所有的echarts
import * as echarts from 'echarts/core' // 引入核心包
import { LineChart } from 'echarts/charts' // 引入折线图
import { GridComponent } from 'echarts/components' // 引入组件
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  LineChart,
  GridComponent,
  CanvasRenderer
])
export default {
  components: {
    CountTo
  },
  data() {
    return {
      homeData: {},
      list: [],
      date: new Date()
    }
  },
  // 计算属性
  computed: {
    // 将getters中的四个属性映射到计算属性中- 指向
    ...mapGetters(['avatar', 'name', 'company', 'departmentName'])
  },
  watch: {
    homeData() {
      console.log(this.homeData)
      // 设置图表
      this.social.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.homeData.socialInsurance?.xAxis,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        grid: {
          top: '20px',
          bottom: '20px',
          left: '40px',
          right: '20px'
        },
        series: [
          {
            data: this.homeData.socialInsurance?.yAxis,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#26CFC4'
                },
                {
                  offset: 1,
                  color: '#86e6f980'
                }
              ]),
              opacity: 0.4
            },
            lineStyle: {
              color: '#04C9BE', // 线的颜色
              opacity: 0.75,
              width: 1
            }
          }
        ]
      })
      this.provident.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.homeData.providentFund?.xAxis,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        grid: {
          top: '20px',
          bottom: '20px',
          left: '40px',
          right: '20px'
        },
        series: [
          {
            data: this.homeData.providentFund?.yAxis,
            type: 'line',
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#26CFC4'
                },
                {
                  offset: 1,
                  color: '#86e6f980'
                }
              ]),
              opacity: 0.4
            },
            lineStyle: {
              color: '#04C9BE', // 线的颜色
              opacity: 0.75,
              width: 1
            }
          }
        ]
      })
    }
  },

  created() {
    this.getHomeData()
    this.getMessageList()
  },
  mounted() {
    // 获取展示的数据 设置给图表
    // 监听homeData的变化
    this.social = echarts.init(this.$refs.social) // 初始化echart
    // data中没有声明 不是响应式
    this.provident = echarts.init(this.$refs.provident)
    // window resize后修改echarts大小
    window.addEventListener('resize', this.setChartsResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setChartsResize)
  },
  methods: {
    async getHomeData() {
      this.homeData = await getHomeData()
    },
    async getMessageList() {
      this.list = await getMessageList()
    },
    setChartsResize() {
      console.log('resize')
      this.social.resize()
      this.provident.resize()
    },
    // 日历上一个月
    prevMonth() {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, this.date.getDate())
    },
    // 日历下一个月
    nextMonth() {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: rgb(27,40,56);

  ::v-deep .el-calendar-day {
    height:  40px;
  }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child, ::v-deep .el-calendar-table__row td.prev{
  border:none;
  text-align: center;
 }

.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected {
   color: #276ffb;
   background-color: transparent;
 }
 ::v-deep .is-selected .el-calendar-day span {
  position: relative;
  color: #3370FF;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 28px;
    height: 28px;
    border: 1px solid #3370FF;
    transform: translate(-50%,-50%);
  }
 }
 ::v-deep .el-calendar-table .el-calendar-day:hover {
    background-color: transparent;
}
 ::v-deep .el-calendar__header {
   display: none
 }
 ::v-deep .el-calendar__body {
   padding: 0;
 }
  .container {
    display: flex;
    background: rgb(27,40,56);
    .right {
      max-width: 600px;
      .right-top-box {
        display: flex;
      }
      .panel {
        margin-left: 8px;
      }
      :nth-child(1) {
        margin-top: 0;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .left {
      flex: 1;
      :nth-child(1) {
        margin-top: 0;
      }
    }
    .panel {
      margin-top: 8px;
      padding: 20px;
      background-color: #fff;
      &.calendar-box {
        margin-top: 0;
        min-width: 280px;
        .caledar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-button--text {
            padding: 10px 0;
            color: #000;
          }
          .el-button+.el-button {
            margin-left: 20px;
          }
        }
      }
      &.link-box {
        min-width: 304px;
      }
      .panel-title {
        margin-bottom: 20px;
        font-size: 16px;
        color: #383c4e;
        font-weight: 500;
      }
      // 用户信息样式
      .user-info {
        display: flex;
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: #d9d9d9;
          line-height: 48px;
          text-align: center;
        }
         .username {
           width: 30px;
           height: 30px;
           text-align: center;
           line-height: 30px;
           border-radius: 50%;
           background: #04c9be;
           color: #fff;
           margin-right: 4px;
         }
        .company-info {
          margin-left: 10px;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .title {
            color: #383c4e;
            font-weight: 500;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC-Medium;
            span {
              font-size: 12px;
              background: #f5f6f8;
              text-align: center;
              padding: 2px 8px;
              border-radius: 2px;
              color: #697086;
            }
          }
          .depart {
            font-size: 14px;
            color: #697086;
            font-weight: 400;
          }
        }
      }
      // 代办样式
      .todo-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        .todo-item {
          width: 18%;
          height: 90px;
          display: flex;
          flex-direction: column;
          padding: 10px;
          justify-content: space-around;
          :nth-child(1) {
            color: #697086;
            font-size: 14px;
          }
          :nth-child(2) {
            color: #383c4e;
            font-size: 30px;
            font-weight: 500;
          }
        }
      }
      // 快捷入口
      .quick-entry {
        display: flex;
        margin-top: 16px;
        justify-content: space-between;
        .entry-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          // margin-left: 60px;
          cursor: pointer;
          &:nth-child(1) {
            margin-left: 0px;
          }
          .entry-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: #f5f6f8;
            background-size: cover;
            &.approval {
              background-image: url('~@/assets/common/approval.png');
            }
             &.social {
              background-image: url('~@/assets/common/social.png');
            }
             &.salary {
              background-image: url('~@/assets/common/addEmployee.png');
            }
            &.role {
              background-image: url('~@/assets/common/role.png');
            }
             &.bpm {
              background-image: url('~@/assets/common/bpm.png');
            }
          }
          span {
            color: #697086;
            font-size: 14px;
            margin-top: 8px;
          }
        }
      }
      // 图表数据
      .chart-container {
        display: flex;
        gap: 20px;
        .chart-info {
         width: 240px;
          .info-main {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            :nth-child(1) {
              font-size: 14px;
              color: #697086;
            }
            :nth-child(2) {
              margin-top: 10px;
              font-size: 30px;
              color: #04c9be;
              font-weight: 500;
            }
          }
          .info-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            border-radius: 4px;
            padding: 12px 15px;
            background: #f5f6f8;
            .info-list-item {
              min-width: 35%;
              margin-top: 10px;
              display: flex;
              flex-direction: column;

              :nth-child(1) {
                font-size: 14px;
                color: #697086;
              }
              :nth-child(2) {
                margin-top: 10px;
                font-size: 30px;
                color: #383c4e;
                font-weight: 500;
              }
            }
          }
        }
        .chart {
          flex:1
        }
      }
      // 帮助链接
      .help {
        display: flex;
        .calendar {
          flex: 1;

        }
        .help-list {
          width: 100%;
          .help-block {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
            padding: 17px 10px;
            width: 100%;
            height: 54px;
            border-radius: 4px;
            font-size: 14px;
            background: #f5f6f8;
            color: #697086;
            cursor: pointer;
            i {
              width: 16px;
              height: 16px;
              display: inline-block;
              background-size: cover;
              vertical-align: middle;
            }
            i.icon-help {
              background-image: url("~@/assets/common/help.png");
            }
             i.icon-support {
              background-image: url("~@/assets/common/support.png");
            }
             i.icon-add {
              background-image: url("~@/assets/common/add.png");
            }
             i.icon-entry {
              background-image: url("~@/assets/common/entry.png");
            }
          }
        }
      }
      // 通知公告
      .information-list {
        .information-list-item {
          display: flex;
          gap: 10px;
          // align-items: center;
          padding: 20px 0 0;
          border-bottom: 1px solid #F5F6F8;
          img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
          .name {
            color: #276FFB;
          }
          .action {
            color: #697086;
          }
         .col {
           color: #8a97f8;
         }
         div :nth-child(2) {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 20px;
          color: #C2C2C2;
         }
        }
        .information-list-item:nth-child(1) {
          padding: 0;
        }
      }
    }
  }
}
</style>
