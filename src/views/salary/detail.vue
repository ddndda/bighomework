<template>
  <div class="detailsContainer">
    <div class="contLeft">
      <div class="topTit">
        <img src="@/assets/common/img.jpeg" alt="">
        <div class="info">
          <p class="name"><strong> {{ user.username }} </strong><span :class="dutyStatus">{{ dutyStatusTxt }}</span></p>
          <p class="time">入职时间:  {{ user.timeOfEntry }}   最新工资： {{ user.currentPostWage + user.currentBasicSalary }} <ul><span class="more">?</span><li>员工所有调薪后的基本工资、岗位工资合计</li></ul></p>
          <p>当月基本工资 / 当月岗位工资: {{ user.currentBasicSalary }} / {{ user.currentPostWage }}</p>
        </div>
      </div>
      <div>
        <div class="social">
          <div class="title"> <strong>津贴</strong></div>
          <div class="table">
            <div class="tabTit"><div>津贴类型</div><div> 补贴金额 </div><div>津贴类型</div><div> 补贴金额 </div></div>
            <div class="tabRow"><div>交通补助</div><div> {{ benefit.transportationSubsidyAmount }} </div><div>通讯补助</div><div> {{ benefit.communicationSubsidyAmount }} </div></div>
            <div class="tabRow"><div>午餐补助</div><div> {{ benefit.lunchAllowanceAmount }} </div><div>住房补助</div><div> {{ benefit.housingSubsidyAmount }} </div></div>
          </div>
        </div>
        <div class="fund">
          <div class="title"> <strong>社保公积金</strong> <span v-if="userSocialSecurity.socialSecurityEnterprise">企业 {{ userSocialSecurity.socialSecurityEnterprise + userSocialSecurity.providentFundEnterprises }}</span>
            <span v-else>
              企业 --
            </span>
            <span v-if="userSocialSecurity.socialSecurityIndividual">个人 {{ userSocialSecurity.socialSecurityIndividual + userSocialSecurity.providentFundIndividual }}
            </span>
            <span v-else>
              个人 --
            </span>
          </div>
          <div class="table">
            <div class="tabTit">
              <div>缴费项目</div>
              <div>基数</div>
              <div> 企业缴纳 </div>
              <div>个人缴纳</div>
            </div>
            <div class="tabRow">
              <div>社保</div>
              <div> {{ userSocialSecurity.socialSecurityBase?userSocialSecurity.socialSecurityBase: '--' }}
              </div>
              <div>{{ userSocialSecurity.socialSecurityEnterprise?userSocialSecurity.socialSecurityEnterprise:'--' }}
              </div>
              <div> {{ userSocialSecurity.socialSecurityIndividual?userSocialSecurity.socialSecurityIndividual:'--' }} </div>
            </div>
            <div class="tabRow">
              <div>公积金</div>
              <div> {{ userSocialSecurity.providentFundBase?userSocialSecurity.providentFundBase:'--' }} </div>
              <div>{{ userSocialSecurity.enterpriseProvidentFundPayment?userSocialSecurity.enterpriseProvidentFundPayment:'--' }}
              </div>
              <div> {{ userSocialSecurity.personalProvidentFundPayment?userSocialSecurity.personalProvidentFundPayment:'--' }}
              </div>
            </div>
            <div class="tabRow">
              <div>缴费合计</div>
              <div> {{ userSocialSecurity.socialSecurityBase + userSocialSecurity.providentFundBase?userSocialSecurity.socialSecurityBase + userSocialSecurity.providentFundBase:'--' }}</div>
              <div>{{ userSocialSecurity.socialSecurityBase + userSocialSecurity.providentFundBase?userSocialSecurity.socialSecurityBase + userSocialSecurity.providentFundBase:'--' }}</div>
              <div> {{ userSocialSecurity.socialSecurityIndividual + userSocialSecurity.providentFundIndividual?userSocialSecurity.socialSecurityIndividual + userSocialSecurity.providentFundIndividual:'--' }} </div>
            </div>
          </div>
        </div>
        <div class="formTable">
          <el-form :label-position="'left'" label-width="180px" :model="user">
            <el-form-item label="实际出勤天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.actualAtteOfficialDays" placeholder="0" :disabled="true" />
            </el-form-item>
            <el-form-item label="计薪天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.workingDays" placeholder="0" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <div class="contRit">
      <div class="topTit"><strong>招聘日程</strong></div>
      <div class="Items">
        <li><div class="name"><p>HR专员</p><p>2018-12-3 3:30</p></div><div class="act"> <strong>放弃</strong> </div></li>
        <li><div class="name"><p>HR专员</p><p>2018-12-3 3:30</p></div><div class="act"> <strong>放弃</strong> </div></li>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getAtteArchiveDetail } from '@/api/attendance'
import { getSettings, getUserSocialData } from '@/api/salary'

export default {
  name: 'UsersTableIndex',
  data() {
    return {
      user: {},
      userSocialSecurity: {},
      benefit: {

      },
      userId: this.$route.params.id,
      yearMonth: this.$route.params.yearMonth,
      atteData: {}
    }
  },
  computed: {
    computeCompanyTotal() {
      let social = 0
      let provident = 0
      if (this.user.socialSecurityCompanyBase != null) {
        social = Number(this.user.socialSecurityCompanyBase)
      }
      if (this.user.providentFundCompanyBase != null) {
        provident = Number(this.user.providentFundCompanyBase)
      }
      return social + provident
    },
    computePersonalTotal() {
      let social = 0
      let provident = 0
      if (this.user.socialSecurityPersonalBase != null) {
        social = Number(this.user.socialSecurityCompanyBase)
      }
      if (this.user.providentFundCompanyBase != null) {
        provident = Number(this.user.providentFundPersonalBase)
      }
      return social + provident
    },
    dutyStatusTxt() {
      return this.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    dutyStatus() {
      return this.user.inServiceStatus === 1 ? 'job-txt-green' : 'job-txt-red'
    }
  },
  created() {
    this.getSocialData()
    this.getSettings()
    this.getAttData()
  },
  methods: {

    // 获取社保+员工相关数据
    async getSocialData() {
      const { user, userSocialSecurity
      } = await getUserSocialData(this.userId, this.yearMonth)
      this.user = user
      this.userSocialSecurity = userSocialSecurity
    },
    // 获取津贴相关数据
    async getSettings() {
      const res = await getSettings()
      this.benefit = res
      console.log(res)
    },
    // 获取出勤信息
    async getAttData() {
      const res = await getAtteArchiveDetail(this.userId, this.yearMonth)
      console.log(res)
    },
    calMoney(type, money, days) {
      if (type === 3) {
        return money
      }
      if (type === 1) {
        return money * days
      }
      return 0
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./../../styles/variables";
  .detailsContainer{
    display: flex;
    padding: 15px;
    .contLeft{
      flex: 4;
      background: #fff;
      margin-right: 10px;
      padding: 20px;
      .topTit{
        display: flex;
        padding-bottom: 10px;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .more{
          display: inline-block;
          position: relative;
          text-align: center;
          width: 16px;
          line-height: 14px;
          font-size: 12px;
          top: -1px;
          left: 5px;
          border: solid 1px #666;
          color:#666;
          border-radius: 50px;
        }
        .info{
          margin-left: 10px;
          line-height: 25px;
          .name{
            span{
              // background: $green1;
              color:#fff;
              padding: 4px 10px;
              border-radius: 3px;
              margin-left: 10px;
              font-size: 12px;
            }
          }
          .time{
            ul{
              position: relative;
              display: inline-block;
              li{
                position: absolute;
                border-radius: 3px;
                box-shadow: 1px 2px 2px #ccc;
                top: 34px;
                left: -43px;
                width: 500px;
                padding:5px 10px;
                line-height: 20px;
                display: none;
                background: #fff;
                border: solid 1px #ccc;
              }
              li::before{
                position:absolute;
                content: '∧';
                left: 50px;
                top: -15px;
                background: #fff;
                color:#ccc;
              }
            }
            ul:hover li{
              display: block;
            }
          }
        }
      }
      .social{
        padding-bottom: 10px;
        .title{
          line-height: 40px;
        }
        .table{
          display: table;
          background: #f9f9f9;
          padding: 20px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          .tabTit{
            display: table-row;
            font-weight: bold;
            div{
              display: table-cell;
            }
          }
          .tabRow{
            display: table-row;
            width: 100%;
            div{
              display: table-cell;
            }
          }
        }
      }
      .fund{
        padding-bottom: 10px;
        .title{
          line-height: 40px;
          span{
            display: inline-block;
            padding: 0 80px;
          }
        }
        .table{
          display: table;
          background: #f9f9f9;
          padding: 20px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          .tabTit{
            display: table-row;
            font-weight: bold;
            div{
              display: table-cell;
            }
          }
          .tabRow{
            display: table-row;
            width: 100%;
            div{
              display: table-cell;
            }
          }
        }
      }
      .formTable{
        margin-top: 20px;
      }
    }
    .contRit{
      flex: 1;
      background: #fff;
      padding:0 20px;
      .topTit{
        margin-bottom: 10px;
        border-bottom: solid 1px #ccc;
        line-height: 40px;
      }
      .Items{
        padding: 20px 0;
        li{
          display: flex;
          .name{
            position: relative;
            text-align: center;
            line-height: 24px;
            padding: 0 0 10px 0;
            flex: 2;
            border-right:solid 1px #ccc;
          }
          .name:after{
            content: ' ';
            border-radius: 50%;
            position: absolute;
            width: 10px;
            height: 10px;
            border:solid 2px $green1;
            right: -5px;
            top:0px;
            background: #fff;
          }
          .act{
            flex: 1;
            text-align: center;
          }
        }
      }
    }
  }
.job-txt-green,.job-txt-red {
  // display: inline-block;
  position: relative;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}
.job-txt-green {
  background: #67c23a;
}
.job-txt-red {
  background: #f56c6c;
}
</style>
