<template>
  <div class="monthStatementBox">
    <div class="monthStatementTop">
      <div class="title">
        <span>社保报表</span>
      </div>
    </div>
    <div class="monthStatementTable">
      <div class="itemDropDown">
        <div class="topLab">
          <div><span style="background-color:#cfeffe;" />已离职</div>
          <div><span style="background-color:#a8f8bb;" />再入职</div>
          <div><span style="background-color:#fedbd7;" />公司合计</div>
          <div><span style="background-color:#ffe8c9;" />一级部门</div>
          <div><span style="background-color:#fdfcd5;" />二级部门</div>
          <div class="rightLabBox">
            <el-button type="primary" size="small" @click="exportList">导出</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="contentData"
          border
          style="width: 100%;text-align: center"
          empty-text="暂无数据"
          fit
          highlight-current-row
        >
          <el-table-column type="index" label="序号" center width="50" />
          <el-table-column prop="username" label="姓名" width="150px" />
          <el-table-column prop="timeOfEntry" :formatter="formatterInvalideValue" label="入职时间" width="150px" />
          <el-table-column prop="mobile" label="手机号" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="idNumber" label="身份证号码" width="180px" :formatter="formatterInvalideValue" />
          <el-table-column prop="theHighestDegreeOfEducation" label="学历" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="bankCardNumber" label="开户行" width="180px" :formatter="formatterInvalideValue" />
          <el-table-column prop="firstLevelDepartment" label="一级部门" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="twoLevelDepartment" label="二级部门" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="workingCity" label="工作城市" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityComputerNumber" label="社保电脑号" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundAccount" label="公积金账号" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="leaveDate" label="离职时间" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="householdRegistrationType" label="户籍类型" :formatter="formatterDomicile" width="150px" />
          <el-table-column prop="participatingInTheCity" label="参保城市" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityMonth" label="社保月份" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityBase" label="社保基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurity" label="社保合计" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityEnterprise" label="社保企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityIndividual" label="社保个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundCity" label="公积金城市" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundMonth" label="公积金月份" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundBase" label="公积金基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="accumulationFundEnterpriseBase" label="公积金企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column
            prop="proportionOfProvidentFundEnterprises"
            label="公积金企业比例"
            width="150px"
            :formatter="formatterInvalideValue"
          />
          <el-table-column prop="individualBaseOfProvidentFund" label="公积金个人基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="personalRatioOfProvidentFund" label="公积金个人比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="totalProvidentFund" label="公积金合计" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundEnterprises" label="公积金企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundIndividual" label="公积金个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="pensionEnterpriseBase" label="养老企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="proportionOfPensionEnterprises" label="养老企业比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="pensionEnterprise" label="养老企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="personalPensionBase" label="养老个人基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="personalPensionRatio" label="养老个人比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="oldAgeIndividual" label="养老个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="unemploymentEnterpriseBase" label="失业企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="proportionOfUnemployedEnterprises" label="失业企业比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="unemployedEnterprise" label="失业企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="theNumberOfUnemployedIndividuals" label="失业个人基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="percentageOfUnemployedIndividuals" label="失业个人比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="unemployedIndividual" label="失业个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="medicalEnterpriseBase" label="医疗企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="proportionOfMedicalEnterprises" label="医疗企业比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="medicalEnterprise" label="医疗企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="medicalPersonalBase" label="医疗个人基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="medicalPersonalRatio" label="医疗个人比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="medicalIndividual" label="医疗个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="baseOfIndustrialInjuryEnterprises" label="工伤企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column
            prop="proportionOfIndustrialInjuryEnterprises"
            label="工伤企业比例"
            width="150px"
            :formatter="formatterInvalideValue"
          />
          <el-table-column prop="industrialInjuryEnterprise" label="工伤企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="fertilityEnterpriseBase" label="生育企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="proportionOfFertilityEnterprises" label="生育企业比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="childbearingEnterprise" label="生育企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="baseOfSeriousIllness" label="大病企业基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="proportionOfSeriouslyIllEnterprises" label="大病企业比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="bigDiseaseEnterprise" label="大病企业" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="personalBaseOfSeriousIllness" label="大病个人基数" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="personalProportionOfSeriousIllness" label="大病个人比例" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="apersonOfGreatDisease" label="大病个人" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="providentFundNotes" label="公积金备注" width="150px" :formatter="formatterInvalideValue" />
          <el-table-column prop="socialSecurityNotes" label="社保备注" width="150px" :formatter="formatterInvalideValue" />
        </el-table>
      </div>
    </div>
    <el-row type="flex" justify="center" align="middle" style="height:60px">
      <el-col :span="12">
        <el-button size="small" type="primary" @click="archivingReportForm">归档{{ yearVal ? yearVal.substr(4) : '' }}报表</el-button>
        <el-button size="small" type="primary" @click="createReportForm">新建报表</el-button>
        <el-button size="small" @click="$router.back()">取消</el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { getArchivingCont, getArchivingArchive, newReport, getArchivingExport } from '@/api/social'
import FileSaver from 'file-saver'

export default {
  name: 'HistoricalArchiving',
  data() {
    return {
      num: 0,
      yearVal: this.$route.query.yearMonth,
      contentData: [],
      loading: false
    }
  },
  created() {
    this.getArchivingCont()
  },
  methods: {
    async getArchivingCont() {
      this.loading = true
      this.contentData = await getArchivingCont({ month: this.yearVal, opType: 1 })
      this.loading = false
    },
    // 归档报表
    archivingReportForm() {
      this.$confirm(`您确定要归档${this.yearVal}报表？报表归档将覆盖上一次归档记录，无法恢复。`).then(async() => {
        await getArchivingArchive({ yearMonth: this.yearVal })
        this.$message({
          type: 'success',
          message: '确定!'
        })
      })
    },
    // 新建报表
    createReportForm() {
      const yearMonth = this.getNextMonth()
      const year = yearMonth.substring(0, 4)
      const month = yearMonth.substring(4)
      this.$confirm(
        '您将创建 《 ' + year + '年' + month + '月 》 报表'
      ).then(() => {
        this.yearMonth = yearMonth
        this.createNewReport(yearMonth)
        this.getArchivingCont()
      })
    },
    async createNewReport(yearMonth) {
      await newReport({ yearMonth })
      this.$message.success('操作成功')
    },
    getNextMonth() {
      const year = this.yearVal.substring(0, 4)
      const month = this.yearVal.slice(4)
      let year2 = year
      let month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      const t2 = year2 + month2
      return t2
    },
    async  exportList() {
      const res = await getArchivingExport({ yearMonth: this.yearVal, opType: 1 })
      FileSaver.saveAs(res, `${this.yearVal}社保报表.xlsx`) // 下载文件
    },
    // 无数据时展示 --
    formatterInvalideValue(row, column, cellValue) {
      if (!cellValue) {
        return '--'
      }
      return cellValue
    },
    // 将户籍返回的数字对应为文字
    formatterDomicile(row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '本市城镇'
        case 2:
          return '本市农村'
        case 3:
          return '外埠城镇'
        case 4:
          return '外埠农村'

        default:
          return '--'
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import './../../styles/variables.scss';

  .monthStatementBox{
    padding: 20px;
    .monthStatementTop{
      position:relative;
      background: #fff;
      padding:10px 15px 0 15px;
      border-bottom:solid 1px #f4f4f4;
      .title{
        color:$blue;
        line-height: 40px;
        border-bottom: solid 2px $blue;
        font-size: 18px;
        font-weight: bold;
        display: inline-block;
        padding: 0 25px;
        .yearChange{
          position: absolute;
          top:5px;
          right: 10px;
        }
      }
    }
    .monthStatementTable{
      background: #fff;
        .itemTopLab{
          border-top:solid 1px #f0f0f0;
          border-bottom: solid 3px #ccc;
          padding: 15px;
          div{
            display: inline-block;
            padding:0 50px;
            border-right: solid 1px #ccc;
          }
          div:last-child, div:first-child{
            border: none;
          }
          .lab{
            position: relative;
            top:-15px;
            padding-right: 0;
            padding-left: 15px;
          }
          .labTit{
            cursor:pointer;
          }
          .title{
            font-size: 16px;
            margin: 10px 0;
            span{
              position: relative;
              bottom:-2px;
              font-size: 13px;
              color:#999;
              margin-left: 5px;
            }
          }
          .itemTit{
            color:#999;
            margin: 8px 0;
            font-size: 13px;
          }
          .itemNum{
            font-size: 20px;
            margin: 0;
          }
        }
        .itemDropDown{
          background: #fff;
          .topLab{
            position: relative;
            padding: 15px;
            div{
              display: inline-block;
              margin: 0 10px;
              span{
                display: inline-block;
                position: relative;
                top:2px;
                margin-right: 5px;
                width: 15px;
                height: 15px;
                // background:$cl-1;
              }
            }
            .rightLabBox{
              position: absolute;
              right: -10px;
              top:10px;
              div{
                border:solid 1px $green;
                color:$green;
                border-radius:3px;
                padding: 4px 10px;
                font-size: 14px;
              }
          }
        }
        .act{
          border-bottom:solid 3px $panGreen;
          .lab{
            color:$panGreen;
          }
          .labTit{
            color:$panGreen;
          }
        }
      }
      .itemes:hover{
        background: #fafbff;
      }
      .itemes .lab:hover{
        cursor:pointer;
      }
    }
    .butList{
      border-top:solid 1px #f4f4f4;
      text-align: center;
      background: #fff;
      span{
        display: inline-block;
        background: $green;
        color:#fff;
        padding: 8px 20px;
        border-radius:3px;
        margin: 10px;
        cursor:pointer;
      }
      .cancel{
        background: #ccc;
        color:#666;
      }
    }
  }
</style>
