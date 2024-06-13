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
        请假申请
      </div>
      <div style="width: 580px;">
        <info-item label="审批类型" :value="information.processName" />
        <info-item label="开始时间" :value="information.data.startTime" />
        <info-item label="休假类别" :value="information.data.holidayType ==1 ?'事假' : '调休' " />
        <info-item label="结束时间" :value="information.data.endTime" />
        <info-item label="请假时长" :value="information.data.duration" />
        <info-item label="申请单位" :value="information.data.applyUnit" />
        <info-item label="申请事由" :value="information.data.reason" />
        <info-item label="审批状态" :value="processState[information.processState]" />
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
import InfoItem from './components/info-item'
export default {
  name: 'UsersTableIndex',
  components: { InfoItem },
  data() {
    return {
      approvalId: this.$route.params.id,
      information: {
        data: {}
      },
      baseDetail: {},
      taskInstanceOutList: [],
      imgs: '',
      processState: ['已提交', '审批中', '审批通过', '审批不通过', '撤销']
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
      const res = await getApprovalsTaskDetail(this.approvalId)
      this.taskInstanceOutList = res
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

<style scoped lang="scss">

</style>
