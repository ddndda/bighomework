<template>
  <div class="quitApproval">
    <div class="contLeft">
      <div class="left-title">
        申请人信息
      </div>
      <div>
        <info-item label="姓名" :value="information.username" />
      </div>
      <div>
        <info-item label="部门" :value="information.departmentName" />
        <info-item label="入职时间" :value="information.timeOfEntry" />
      </div>
      <el-divider />
      <div class="left-title">
        离职申请
      </div>
      <div style="width: 580px;">
        <info-item label="申请类型" :value="information.processName" />
        <info-item label="期望离职时间" :value="information.data.exceptTime" />
        <info-item label="离职原因" :value="information.data.reason" />
      </div>
    </div>
    <div class="contRit">
      <div class="right-title">
        审批记录
      </div>
      <el-steps direction="vertical" :active="3" finish-status="success" space="85px">
        <el-step v-for="(item, index) in taskInstanceOutList" :key="index">
          <template #title>
            <span class="step-name">
              {{ item.handleUserName }}
            </span>
            <span class="step-type">
              {{ item.handleOpinion }}
            </span>
          </template>
          <template #description>
            <span class="step-description">
              {{ item.handleTime }}
            </span>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import { getApprovalsDetail, getApprovalsTaskDetail, downImg } from '@/api/approval'
import InfoItem from './components/info-item.vue'
export default {
  name: 'UsersTableIndex',
  components: {
    InfoItem
  },
  data() {
    return {
      approvalId: this.$route.params.id,
      information: {
        data: {}
      },
      taskInstanceOutList: [],
      imgs: ''
    }
  },
  created() {
    this.getApprovalsDetail()
    this.getApprovalsTaskDetail()
  },
  methods: {
    async getApprovalsDetail() {
      this.information = await getApprovalsDetail(this.approvalId)
      this.information.data = JSON.parse(this.information.procData)
    },
    async getApprovalsTaskDetail() {
      this.taskInstanceOutList = await getApprovalsTaskDetail(this.approvalId)
    },
    // 图片下载
    async getReviewHistory(id) {
      const response = await downImg(id)
      this.imgs = 'data:image/png;base64,' + btoa(
        new Uint8Array(response.request.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
    }
  }
}
</script>

