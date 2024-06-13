<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前面内容 -->

        <template v-slot:before>
          <el-button size="mini" type="danger" @click="$router.push('/salary/setting')">设置</el-button>
          <el-button size="mini" type="primary" @click="$router.push(`/salary/report/${yearMonth}`)">
            {{ yearMonth }}报表
          </el-button>
        </template>
      </page-tools>
      <!-- 条件筛选 -->
      <el-card class="hr-block">
        <el-form label-width="120px">
          <el-form-item label="聘用形式:">
            <el-checkbox-group v-model="formData.approvalsTypeChecks">
              <el-checkbox
                v-for="item in approvalsType"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="员工状态:">
            <el-checkbox-group v-model="formData.approvalsStateChecks">
              <el-checkbox
                v-for="item in approvalsState"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.departmentChecks">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 表格展示 -->
      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="index" label="序号" :index="index=>index+1+page.pageSize*(page.page-1)" />
          <el-table-column prop="username" label="姓名" width="150" />
          <el-table-column prop="mobile" label="手机" width="180" />
          <el-table-column prop="workNumber" label="工号" width="180" />
          <el-table-column prop="formOfEmployment" :formatter="formatEmployment" width="100" label="聘用形式" />
          <el-table-column prop="departmentName" label="部门" width="180" />
          <el-table-column prop="timeOfEntry" width="200" label="入职时间" />
          <el-table-column prop="currentBasicSalary" label="工资基数" />
          <el-table-column label="津贴方案" width="120" prop="subsidyName" />
          <el-table-column label="操作" width="260">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.currentBasicSalary + scope.row.currentPostWage > 0 "
                size="mini"
                type="primary"
                @click="changeSalary('ChangeSalary',scope.row.id)"
              >调薪</el-button>
              <el-button
                v-else
                size="mini"
                type="danger"
                @click="fixedSalary('FixedSalary',scope.row.id)"
              >定薪</el-button>
              <el-button size="mini">
                <router-link :to="{'path': `salary/detail/${scope.row.id}/${yearMonth}`}">查看</router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="height: 50px" align="middle">
          <el-pagination
            layout="prev,pager,next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.pageSize"
            @current-change="changePage"
          />

        </el-row>
      </el-card>
      <!--查看弹框-->
      <el-dialog :title="topLabel" :visible.sync="centerDialogVisible" width="700px" left>
        <component :is="currentComponent" ref="dialogRef" :user-salary="selectedSalaryInfo" :user-id="selectUserId" @editSuccess="editSuccess" @onDialogCancel="centerDialogVisible=false" />
        <!-- <ChangeSalary v-if="seeState == 'changeSalary'" :user-salary="selectedSalaryInfo" :user-id="selectUserId" @onDialogCancel="centerDialogVisible=false" /> -->
        <!-- <FixedSalary v-if="seeState == 'fixedSalary'" /> -->
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getSalarysList, getTips, getSalaryDetail, getCompanySetting } from '@/api/salary'
import { getDepartment } from '@/api/department'
import ChangeSalary from './components/change-salary'
import FixedSalary from './components/fixed-salary'
import pageTools from './components/page-tools.vue'
export default {
  name: 'UsersTableIndex',
  components: { ChangeSalary, FixedSalary, pageTools },
  data() {
    return {
      seeState: '',
      centerDialogVisible: false,
      topLabel: '转正',
      approvalsType: [
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ],
      approvalsState: [
        {
          id: '1',
          value: '在职'
        },
        {
          id: '2',
          value: '离职'
        }
      ],
      department: [],
      subsidyScheme: [],
      list: [],
      departments: [],
      loading: true,
      page: {
        total: 0,
        page: 1,
        pageSize: 10
      },
      tips: {},
      yearMonth: '',
      formData: {
        approvalsTypeChecks: [],
        // approvalsStateChecks: [],
        departmentChecks: []
      },
      selectedSalaryInfo: {},
      selectUserId: null,
      currentComponent: ''

    }
  },
  computed: {
    tipsInfo() {
      return `本月0：入职 0 离职 0 调薪 0 未定薪 0`
    }
  },
  watch: {
    centerDialogVisible: function(newVal) {
      if (!newVal) {
        this.$refs.dialogRef.onClose()
      }
    }
  },
  created() {
    this.getSalarysList() // 获取工资
    this.getDepartment() // 获取组织
    this.getSalarySetting()
  },
  methods: {
    // 对聘用形式进行文本显示
    formatEmployment(row) {
      const data = this.approvalsType.find(item => item.id === row.formOfEmployment)
      return data ? data.value : '未知'
    },
    async  getSalarysList() {
      this.loading = true
      const { rows, total } = await getSalarysList({ page: this.page.page, pageSize: this.page.pageSize, approvalsTypeChecks: this.formData.approvalsTypeChecks.join(), departmentChecks: this.formData.departmentChecks.join() })
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    async  getSalarySetting() {
      const { dataMonth } = await getCompanySetting()
      this.yearMonth = dataMonth
    },
    // 获取组织列表
    async  getDepartment() {
      this.departments = await getDepartment()
    },
    async getTips() {
      const { tipsRes } = await getTips()
      this.tips = tipsRes
    },
    changePage(newPage) {
      console.log(newPage)
      this.page.page = newPage
      this.getSalarysList()
    },
    async  changeSalary(key, userId) {
      this.topLabel = '调薪'
      this.currentComponent = key
      this.centerDialogVisible = true
      this.selectUserId = userId
      this.selectedSalaryInfo = await getSalaryDetail(userId)
    },
    fixedSalary(key, userId) {
      this.topLabel = '定薪'
      this.currentComponent = key
      this.centerDialogVisible = true
      this.selectUserId = userId
    },
    editSuccess() {
      this.getSalarysList()
    },
    // 查询参数发生变化
    changeParams() {
      this.page.page = 1 // 重置第一页
      this.getSalarysList() // 重新拉取工资数据
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
