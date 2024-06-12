<template>
  <div class="changeSalary">
    <div class="infoBox">
      <div class="logo"><img src="@/assets/common/img.jpeg" alt=""></div>
      <div class="info">
        <p>
          <span class="name">{{ user.username }}</span>
        </p>
        <p>
          <span>部门：</span>
          {{ user.departmentName }}
        </p><p>
          <span>入职时间：</span>
          {{ user.timeOfEntry }}
        </p>
      </div>
    </div>
    <div>
      <el-form :model="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="调整基本工资" required>
          <el-row>
            <el-input v-model="userSalary.currentBasicSalary" style="width: 220px;" :disabled="true" />
            <span class="Label">-></span>
            <el-form-item ref="formItem1" class="my-inline-form-item" :rules="[{required:true,message:'请输入调整后基本工资'}]" prop="currentBasicSalary">
              <el-input
                v-model="ruleForm.currentBasicSalary"
                style="width: 220px;"
                placeholder="请输入调整后基本工资"
                type="number"
              />
            </el-form-item>
          </el-row>

        </el-form-item>
        <el-form-item label="调整岗位工资" required>
          <el-input v-model="userSalary.currentPostWage" style="width: 220px;" :disabled="true" />
          <span class="Label">-></span>
          <el-form-item ref="formItem2" class="my-inline-form-item" :rules="[{required:true,message:'请输入调整后岗位工资'}]" prop="currentPostWage">
            <el-input
              v-model="ruleForm.currentPostWage"
              style="width: 220px;"
              placeholder="请输入调整后岗位工资"
              type="number"
            />
          </el-form-item>

        </el-form-item>
        <el-form-item label="工资合计">
          <el-input v-model="computeCurrentTotal" style="width: 220px;" :disabled="true" />
          <span class="Label">-></span>
          <el-input v-model="computeChangeTotal" style="width: 220px;" :disabled="true" />
        </el-form-item>
        <el-form-item label="调整幅度">
          <el-input v-model="computeChangeSize" style="width: 220px;" :disabled="true" />
        </el-form-item>
        <div class="buttones" style="text-align: center;margin-top: 40px;">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="onClose">关闭</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { changeSalary, getSalaryDetail } from '@/api/salary'

export default {
  name: 'UsersTableIndex',
  props: {
    userSalary: {
      type: Object,
      default: () => ({})
    },
    userId: {
      type: Number,
      default: NaN
    }},

  data() {
    return {
      user: {},
      ruleForm: {
      }
    }
  },
  computed: {
    computeCurrentTotal() {
      let base = 0
      if (this.userSalary.currentBasicSalary != null) {
        base = Number(this.userSalary.currentBasicSalary)
      }
      let post = 0
      if (this.userSalary.currentPostWage != null) {
        post = Number(this.userSalary.currentPostWage)
      }
      return base + post
    },
    computeChangeTotal() {
      let base = 0
      if (this.ruleForm.currentBasicSalary != null) {
        base = Number(this.ruleForm.currentBasicSalary)
      }
      let post = 0
      if (this.ruleForm.currentPostWage != null) {
        post = Number(this.ruleForm.currentPostWage)
      }
      return base + post
    },
    computeChangeSize() {
      return this.computeChangeTotal - this.computeCurrentTotal
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async onSubmit() {
      await this.$refs.formItem1.validate()
      await this.$refs.formItem2.validate()
      if (this.ruleForm.currentPostWage && this.ruleForm.currentBasicSalary) {
        const sendData = this.ruleForm
        sendData.userId = this.userId
        await changeSalary(sendData)
        this.$message({ message: '保存成功', type: 'success' })
        this.$emit('editSuccess')
        this.onClose()
      }
    },
    onClose() {
      this.ruleForm = {}
      this.$emit('onDialogCancel')
      this.$refs.formItem1.resetField()
      this.$refs.formItem2.resetField()
    },
    async getUserDetailById() {
      const res = await getSalaryDetail(this.userId)
      this.user = res
    }
  }
}
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../styles/variables.scss';
    .changeSalary{
      .infoBox{
        display: flex;
        border-bottom: solid 1px #ccc;
        margin-bottom: 20px;
        padding: 10px 0 20px 0;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .logo{
          border:solid 1px #ccc;
          width: 102px;
          height: 102px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .info{
          p{
            line-height: 30px;
            .name{font-size: 16px;}
            span{
              font-weight: bold;
              display: inline-block;
              margin-right: 0px;
              margin-left: 10px;
            }
          }
        }
        .buttones{
          text-align: center;
        }
      }
      .Label{
        margin: 0 20px;
        color:#999;

      }

      .my-inline-form-item {
          display: inline-block;
        }
    }
  </style>
