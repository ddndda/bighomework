<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true" class="up-head">
        <!-- 前面内容 -->
        <template v-slot:before>
          <div class="before-box">
            <p>
              当前审批中
            </p>
            {{ approvalInfo.currApproveCount }}
          </div>
          <div class="before-box">
            <p>
              本月审批通过
            </p>
            {{ approvalInfo.approveCount }}
          </div>
          <div class="before-box">
            <p>
              本月审批驳回
            </p>
            {{ approvalInfo.rejectionCount }}
          </div>
        </template>
        <template>
          <el-button size="mini" type="primary" @click="$router.push('/approvals/securitySetting')">流程设置</el-button>
        </template>
      </page-tools>
      <!-- <ApprovalPageTool /> -->
      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column type="selection" width="30" />
          <el-table-column type="index" width="80" label="序号" :index="(index)=>(index+1+page.pageSize*(page.page-1))" />
          <el-table-column prop="processName" label="审批类型" sortable />
          <el-table-column prop="username" label="申请人" sortable />
          <el-table-column prop="procCurrNodeUserName" label="当前审批人" sortable />
          <el-table-column
            prop="procApplyTime"
            label="审批发起时间"
            sortable
            width="200"
          />
          <el-table-column prop="process_state" label="审批状态" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.processState===0" class="rovalsState">
                <em class="sub" />已提交
              </span>
              <span v-if="scope.row.processState===1" class="rovalsState">
                <em class="stay" />审批中
              </span>
              <span v-if="scope.row.processState===2" class="rovalsState">
                <em class="adopt" />审批通过
              </span>
              <span v-if="scope.row.processState===3" class="rovalsState">
                <em class="reject" />审批不通过
              </span>
              <span v-if="scope.row.processState===4" class="rovalsState">
                <em class="revoke" />撤销
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="toDetail(scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :total="page.total"
            :page-size="page.pagesize"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getApprovalList } from '@/api/approval'
// import ApprovalPageTool from './components/approval-tool'
import pageTools from './components/page-tools.vue'

export default {
  name: 'SocialTableIndex',
  components: { pageTools },
  data() {
    return {
      list: [],
      loading: false,
      page: {
        page: 1,
        total: 0,
        pageSize: 10
      },
      approvalInfo: {
        approveCount: '',
        currApproveCount: '',
        rejectionCount: ''
      }
    }
  },
  created() {
    this.getApprovalList()
  },
  methods: {
    // 初始化数据
    async  getApprovalList() {
      this.loading = true
      const { rows, total, approveCount,
        currApproveCount,
        rejectionCount } = await getApprovalList({ year: 2018, ...this.page })
      this.page.total = total
      this.list = rows
      this.loading = false
      this.approvalInfo = {
        approveCount,
        currApproveCount,
        rejectionCount
      }
    },
    toDetail(obj) {
      this.$router.push({ path: `/approval/${obj.processKey}/detail/${obj.processId
      }` })
    },

    changePage(newPage) {
      this.page.newPage = newPage
      this.getApprovalList()
    }
  }
}
</script>

<style scoped>
:root {
  background-color: rgb(27,40,56);
  color: #7A8B9D;
}
.before-box {
  display: inline-block;
  margin-right: 40px;
  text-align: center;
  background-color: rgb(27,40,56);
  color: #DCDEDF;
  font-weight: 600;
  border-color: rgb(27,40,56);
}
.container {
  background-color: rgb(27,40,56);
  font-weight: 550;
  color: #7A8B9D;
}
.app-container {
  background: rgb(27,40,56);
  font-weight: 550;
}
.up-head {
  background-color: rgb(27,40,56);
  color: #7A8B9D;
  border-color: rgb(27,40,56);
}
.hr-block {
  background-color: rgb(27,40,56);
  font-weight: 550;
  color: #7A8B9D;
}
::v-deep .el-table th,
::v-deep .el-table td {
  background-color: rgb(27,40,56); /* 设置表头和表格内容的背景颜色 */
  color: #7A8B9D;
  font-weight: 550
}
::v-deep .el-table__body-wrapper tbody tr:hover td {
  background-color: rgb(27,40,56); /* 设置鼠标放置时的背景颜色 */
}
::v-deep .el-table__body-wrapper tbody td {
  color: #7A8B9D; /* 设置表格内容的字体颜色 */
  font-weight: 550
}
::v-deep .el-pagination .el-pager li:not(.disabled) {
  background-color: #274256 !important;
  color: #67C1F5 !important;
}
::v-deep .el-pagination .el-pager li:not(.disabled):hover {
  background-color: #4786AA !important;
  color: #FCFDFE !important;
}
::v-deep .el-pagination .el-pager li.active {
  background-color: #6f94aa !important;
  color: #FCFDFE !important;
}
::v-deep .el-pagination button:hover {
  background-color: #4786AA !important;
  color: #FCFDFE !important;
}
::v-deep .el-pagination button {
  background-color: #274256 !important;
  color: #67C1F5 !important;
}
</style>
