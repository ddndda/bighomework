<template>
  <div class="detailBox">
    <div class="detailTop">
      <img src="@/assets/common/img.jpeg" width="100" height="100" alt>
      <div>
        <p>
          <b style="vertical-align: middle;">{{ sizeForm.user.username }}</b>
          <span :class="dutyStatus?'job-txt-green':'job-txt-red'">{{ dutyStatusTxt }}</span>
        </p>
        <p>
          <span>最新工资基数 {{ sizeForm.salaryBase }}  </span>
          &emsp;&emsp;
          <span>入职时间   {{ sizeForm.user.timeOfEntry }}</span>
          &emsp;&emsp;
          <span>联系电话 {{ sizeForm.user.mobile }}</span>
        </p>
        <p>
          本月不缴纳社保
          <el-switch v-model="isPaySocialInMonth" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />&emsp;&emsp;
          本月不缴纳公积金
          <el-switch
            v-model="isPayProvidentInMonth"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </p>
      </div>
    </div>
    <div class="detailContentBox">
      <el-form ref="form" :model="sizeForm.userSocialSecurity" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="参保城市" prop="participatingInTheCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.participatingInTheCityId"
            value-key="id"
            placeholder="请选择参保城市"
            @change="socialSecurityCityChange"
          >
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="社保类型" prop="socialSecurityType">
          <el-select v-model="sizeForm.userSocialSecurity.socialSecurityType" placeholder="请选择社保类型">
            <el-option label="首次开户" :value="1" />
            <el-option label="非首次开户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="户籍类型" prop="householdRegistrationType">
          <el-select v-model="sizeForm.userSocialSecurity.householdRegistrationType" placeholder="请选择户籍类型">
            <el-option label="本市城镇" :value="1" />
            <el-option label="本市农村" :value="2" />
            <el-option label="外阜城镇" :value="3" />
            <el-option label="外阜农村" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="社保基数" prop="socialSecurityBase">
          <el-input v-model="sizeForm.userSocialSecurity.socialSecurityBase" type="number" style="width:38%" />（基数范围是3387 ~ 25401）
        </el-form-item>
        <el-form-item label="工伤比例" prop="industrialInjuryRatio">
          <el-input v-model="sizeForm.userSocialSecurity.industrialInjuryRatio" style="width:38%" type="number" />（比例范围是0.2％ ~ 3％，推荐0.2％）
        </el-form-item>
        <el-form-item label="社保缴纳">
          <el-form-item label="个人" label-width="74px" style="display:inline-block">
            <el-input
              v-model="computePersonalPayment"
              style="width:100%"
              placeholder="个人"
              inline="true"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="公司" label-width="74px" style="display:inline-block">
            <el-input
              v-model="computeCompanyPament"
              style="width:100%"
              placeholder="企业"
              size="small"
              inline="true"
              :disabled="true"
            />
          </el-form-item>
          <el-table :data="computePaymentItemList">
            <el-table-column label="缴费项目" prop="name" />
            <el-table-column label="企业基数">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ sizeForm.userSocialSecurity.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="企业比例">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ paymentItem.row.scaleCompany }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="企业缴纳">
              <template slot-scope="paymentItem">
                <el-input
                  v-show="paymentItem.row.switchCompany"
                  v-model="paymentItem.row.companyPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
            <el-table-column label="个人基数">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ sizeForm.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="个人比例">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ paymentItem.row.scalePersonal }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="个人缴纳">
              <template slot-scope="paymentItem">
                <el-input
                  v-show="paymentItem.row.switchPersonal"
                  v-model="paymentItem.row.personalPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="社保备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.socialSecurityNotes"
            type="textarea"
            :rows="2"
            placeholder="1-300字符"
            maxlength="300"
            style="width:38%"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="公积金城市" prop="providentFundCity">
          <el-select v-model="sizeForm.userSocialSecurity.providentFundCityId" placeholder="请选择公积金城市" value-key="id">
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="公积金基数" prop="providentFundBase">
          <el-input v-model="sizeForm.userSocialSecurity.providentFundBase" style="width:38%" type="number" />（基数范围是2273 ~ 25401）
        </el-form-item>
        <el-form-item label="企业比例" prop="enterpriseProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.enterpriseProportion"
            style="width:38%"
            placeholder="12"
            type="number"
          />（比例范围是5％ ~ 12％，推荐12％ ）
        </el-form-item>
        <el-form-item label="个人比例" prop="personalProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.personalProportion"
            style="width:38%"
            placeholder="12"
            type="number"
          />（比例范围是5％ ~ 12％，推荐12％ ）
        </el-form-item>
        <el-form-item label="公积金缴纳">
          <el-form-item
            label="个人"
            label-width="60px"
            style="display:inline-block"
            prop="personalProvidentFundPayment"
          >
            <el-input
              v-model="sizeForm.userSocialSecurity.personalProvidentFundPayment"
              style="width:100%"
              placeholder="个人"
              inline="true"
              type="number"
            />
          </el-form-item>
          <el-form-item
            label="公司"
            label-width="60px"
            style="display:inline-block"
            prop="enterpriseProvidentFundPayment"
          >
            <el-input
              v-model="sizeForm.userSocialSecurity.enterpriseProvidentFundPayment"
              style="width:100%"
              placeholder="企业"
              inline="true"
              type="number"
            />
          </el-form-item>
          <el-form-item style="display:inline-block">
            <span>（为自动测算结果，可手动调整）</span>
          </el-form-item>
        </el-form-item>
        <el-form-item label="公积金备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.providentFundNotes"
            type="textarea"
            :rows="2"
            placeholder="1-300字符"
            style="width:38%"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit()">保存</el-button>
          <el-button @click="()=>$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveContent, getContent, getPaymentItemList, getSocialCities } from '@/api/social'

export default {
  name: 'DetailSocial',
  data() {
    var validateSocialSecurityBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入社保基数'))
      } else if (value < 3387 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是3387 ~ 25401'))
      } else {
        callback()
      }
    }
    var validateIndustrialInjuryRatio = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工伤比例'))
      } else if (value < 0.2 || value > 3) {
        callback(new Error('请不要超出范围，比例范围是0.2％ ~ 3％'))
      } else {
        callback()
      }
    }
    var validateProvidentFundBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入公积金基数'))
      } else if (value < 2273 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是2273 ~ 25401'))
      } else {
        callback()
      }
    }
    var validateEnterpriseProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入企业比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }
    var validatePersonalProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入个人比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }
    return {
      sizeForm: {
        user: {},
        userSocialSecurity: {
          socialSecurityBase: 3387,
          industrialInjuryRatio: 0.2
        }
      },
      paymentItemList: [],
      personalPayment: 0.0,
      companyPayment: 0.0,
      isPaySocialInMonth: 0,
      isPayProvidentInMonth: 0,
      rules: {
        participatingInTheCity: [
          { required: true, message: '请选择参保城市', trigger: 'change' }
        ],
        socialSecurityType: [
          { required: true, message: '请选择社保类型', trigger: 'change' }
        ],
        householdRegistrationType: [
          { required: true, message: '请选择户籍类型', trigger: 'change' }
        ],
        socialSecurityBase: [
          {
            required: true,
            validator: validateSocialSecurityBase,
            trigger: 'blur'
          }
        ],
        industrialInjuryRatio: [
          {
            required: true,
            validator: validateIndustrialInjuryRatio,
            trigger: 'blur'
          }
        ],
        providentFundCity: [
          { required: true, message: '请选择公积金城市', trigger: 'change' }
        ],
        providentFundBase: [
          {
            required: true,
            validator: validateProvidentFundBase,
            trigger: 'blur'
          }
        ],
        enterpriseProportion: [
          {
            required: true,
            validator: validateEnterpriseProportion,
            trigger: 'blur'
          }
        ],
        personalProportion: [
          {
            required: true,
            validator: validatePersonalProportion,
            trigger: 'blur'
          }
        ],
        enterpriseProvidentFundPayment: [
          {
            required: true,
            message: '请输入公司公积金缴纳数额',
            trigger: 'change'
          }
        ],
        personalProvidentFundPayment: [
          {
            required: true,
            message: '请输入个人公积金缴纳数额',
            trigger: 'change'
          }
        ]
      },
      cities: []
    }
  },
  computed: {
    dutyStatusTxt() {
      return this.sizeForm.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    dutyStatus() {
      return this.sizeForm.user.inServiceStatus === 1
    },
    computePaymentItemList() {
      let personalTotal = Number(0)
      let companyTotal = Number(0)
      this.paymentItemList.forEach(item => {
        if (item.name === '工伤' && item.switchCompany) {
          item.scaleCompany = this.sizeForm.userSocialSecurity.industrialInjuryRatio
        }
        if (item.switchCompany) {
          item.companyPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase * item.scaleCompany) / 100
          ).toFixed(2)
          companyTotal = Number(companyTotal + Number(item.companyPay))
        }
        if (item.switchPersonal) {
          item.personalPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase * item.scalePersonal) / 100
          ).toFixed(2)
          personalTotal = Number(personalTotal + Number(item.personalPay))
        }
      })
      // gaolyQQ 不能在这里计算
      // this.personalPayment = parseFloat(personalTotal).toFixed(2)
      // this.companyPayment = parseFloat(companyTotal).toFixed(2)
      return this.paymentItemList
    },
    computeEnterpriseProvidentFundPayment() {
      return parseFloat(
        (this.sizeForm.userSocialSecurity.enterpriseProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
    },
    computePersonalProvidentFundPayment() {
      return parseFloat(
        (this.sizeForm.userSocialSecurity.personalProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
    },
    computePersonalPayment() {
      return this.computePaymentItemList.reduce((acc, cur) => (acc += parseFloat(cur.personalPay)), 0).toFixed(2)
    },
    computeCompanyPament() {
      return this.computePaymentItemList.reduce((acc, cur) => (acc += parseFloat(cur.companyPay)), 0).toFixed(2)
    }
  },
  watch: {
    'sizeForm.userSocialSecurity.providentFundBase': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.enterpriseProportion': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.personalProportion': function() {
      this.changeProvidentFundPayment()
    }
  },
  created() {
    this.sizeForm.userId = this.$route.params.id
    this.getContent()
    this.getCities()
  },
  methods: {
    onSubmit() {
      this.saveData()
    },
    socialSecurityCityChange(id) {
      const res = this.cities.find(item => item.id === id)
      this.initPaymentItem(res)
    },
    async saveData() {
      // 校验
      await this.$refs.form.validate()
      this.sizeForm.userSocialSecurity.enterprisesPaySocialSecurityThisMonth = this.isPaySocialInMonth
      this.sizeForm.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth = this.isPayProvidentInMonth
      this.sizeForm.userSocialSecurity.userId = this.sizeForm.userId
      this.sizeForm.userSocialSecurity.providentFundCity = this.cities.find(item => item.id === this.sizeForm.userSocialSecurity.providentFundCityId).name
      this.sizeForm.userSocialSecurity.participatingInTheCity = this.cities.find(item => item.id === this.sizeForm.userSocialSecurity.participatingInTheCityId).name
      await saveContent(this.sizeForm.userSocialSecurity)
      this.$message.success('保存成功')
    },
    async getContent() {
      // 城市列表获取
      const data = await getContent(this.$route.params.id)
      if (data.userSocialSecurity) {
        this.sizeForm = data
        this.sizeForm.userId = this.$route.params.id
        this.isPaySocialInMonth = data.userSocialSecurity.enterprisesPaySocialSecurityThisMonth
        this.isPayProvidentInMonth = data.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth
        const city = {}
        city.name = this.sizeForm.userSocialSecurity.participatingInTheCity
        city.id = this.sizeForm.userSocialSecurity.participatingInTheCityId
        this.initPaymentItem(city)
      } else {
        this.sizeForm.user = data.user
      }
    },
    async initPaymentItem(city) {
      this.paymentItemList = await getPaymentItemList(city.id)
    },
    changeProvidentFundPayment() {
      this.sizeForm.userSocialSecurity.enterpriseProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.enterpriseProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
      this.sizeForm.userSocialSecurity.personalProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.personalProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
    },
    async getCities() {
      const res = await getSocialCities()
      this.cities = res
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detailBox {
  margin: 20px;
  .detailTop {
    display: flex;
    align-items:center;
    padding: 15px;
    background: #fff;
    img {
      border-radius: 50%;
      margin-right: 40px;
      box-shadow: 1px 2px 4px #cccccc;
    }
  }
  .detailContentBox {
    margin: 15px 0;
    padding: 15px;
    background: #fff;
  }
}
.job-txt-green,
.job-txt-red {
  margin-left: 5px;
  display: inline-block;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}
.job-txt-green {
  background: #67c23a;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.job-txt-red {
  //   padding: 20px;
  background: #f56c6c;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
