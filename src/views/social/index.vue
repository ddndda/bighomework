<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- <template v-slot:before>
          本月{{ tips.dateRange }}：社保在缴 {{ tips.socialSecurityCount }} 公积金在缴 {{ tips.providentFundCount }} 增员 {{ tips.newsCount }} 减员 {{ tips.reducesCount }} 入职 {{ tips.worksCount }} 离职 {{ tips.leavesCount }}
        </template> -->
        <template v-slot:before>
          <el-button size="mini" type="danger" @click="$router.push('/social/archive')">历史归档</el-button>
          <el-button size="mini" type="primary" @click="$router.push(`/social/report?yearMonth=${yearMonth}`)">{{ yearMonth }}报表</el-button>
        </template>
      </page-tools>
      <!-- 筛选组件 -->
      <social-tool />
      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" @row-click="(row)=>this.$router.push(`/social/detail/${row.id}`)">
          <el-table-column
            type="index"
            width="50"
            label="序号"
            :index="(index)=>(index+1+page.pageSize*(page.page-1))"
          />
          <el-table-column prop="username" label="姓名" sortable min-width="150" />
          <el-table-column prop="mobile" label="手机" sortable min-width="150" />
          <el-table-column prop="workNumber" label="工号" sortable min-width="150" />
          <el-table-column prop="departmentName" label="部门" sortable width="180" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable min-width="150" />
          <el-table-column prop="leaveTime" label="离职时间" sortable min-width="150" :formatter="formatterLeaveTime" />
          <el-table-column prop="participatingInTheCity" label="社保城市" width="180" />
          <el-table-column prop="providentFundCity" label="公积金城市" width="180" />
          <el-table-column prop="socialSecurityBase" label="社保基数" min-width="100" />
          <el-table-column prop="providentFundBase" label="公积金基数" min-width="100" />
          <!-- <el-table-column label="操作">
            <template v-slot:default="obj">
              <el-button type="text" size="mini" @click="$router.push(`/social_securitys/detail/${obj.row.id}`)">查看详情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :total="page.total"
            :current-page="page.page"
            :page-size="page.pageSize"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getSettings, getSocialList } from '@/api/social'
import SocialTool from './components/social-tool'
import pageTools from './components/page-tools.vue'

export default {
  name: 'SocialTableIndex',
  components: { SocialTool, pageTools },
  data() {
    return {
      list: [],
      yearMonth: '',
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      selectParams: {},
      tips: {},
      loading: false,
      socialCities: []
    }
  },
  created() {
    // 获取社保列表
    this.getSocialList() // 获取列表数据
    this.getSettings()
  },
  methods: {
    async getSettings() {
      const { dataMonth } = await getSettings()
      this.yearMonth = dataMonth
    },
    goDetail(row, event, column) {
      this.$router.push({ path: 'detail' })
    },
    // 获取社保列表
    async getSocialList() {
      try {
        const { rows, total } = await getSocialList({ page: this.page.page, pageSize: this.page.pageSize, ...this.selectParams })
        this.list = rows // 列表数据
        this.page.total = total // 总数
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 修改选项
    changeSelectParams(selectParams) {
      this.selectParams = selectParams
      this.page.page = 1
      // 修改选项后重新获取列表
      this.getSocialList()
    },
    pageChange(page) {
      this.page.page = page // 当前
      this.getSocialList() // 获取列表数据
    },
    formatterLeaveTime(row) {
      const leaveTime = row.leaveTime
      if (leaveTime) {
        return leaveTime
      }
      return '--'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cont-bod-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
}

</style>
