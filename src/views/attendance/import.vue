<template>
  <div class="container">
    <div class="app-container">
      <!-- title -->
      <h2 class="title">
        考勤导入
      </h2>
      <!-- 提示 -->
      <el-alert
        title="如果某员工已有打卡记录，最新上传的不覆盖原有数据。可上传多名员工的打卡记录。每名员工可上传多条记录，同考勤日内取员工第一次和最后一次打卡时间。"
        type="warning"
        show-icon
        :closable="false"
      />
      <!-- 上传区域 -->
      <div class="upload-box">
        <div class="upload-btn">
          <el-upload
            class="upload-btn-box"
            action="/api/attendances/import"
            :headers="uploadHeader"
            :multiple="false"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              <div>
                (推荐<a href="http://172.17.0.226:8083/importAtteTemplate.xlsx" class="a-btn">下载模板文件</a>，填写后上传)
              </div>
              <a href="javascript:;" class="a-btn" @click="()=>uploadRulesVisible=true">
                点击查看文件上传要求
              </a>
            </div>
          </el-upload>
        </div>
        <el-upload
          class="upload-drag"
          drag
          action="/api/attendances/import"
          :headers="uploadHeader"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处</div>
        </el-upload>
      </div>
    </div>
    <!-- 文件上传要求弹层 -->
    <el-dialog
      title="文件上传要求"
      :visible.sync="uploadRulesVisible"
      width="500px"
    >
      <div class="upInfoTip">
        <p>
          <strong>重要提示：</strong>
        </p>
        <p>支持WPS、excel2003以上版本文件</p>
        <p>请将要上传的内容放在第一个sheet中</p>
        <p>请不要加密模板文件，将导致错误</p>
        <p>请不要上传带宏的文件，将导致错误</p>
        <p>请不要过多的使用格式，如背景色和边框，将可能导致超时</p>
        <p>请将手机号、身份证号、银行卡号等内容设置为文本格式</p>
        <p>示例行的内容无需删除，将不会上传到系统中</p>
        <p>
          <strong>格式说明：</strong>
        </p>
        <p>聘用形式：只能填写“正式”或“非正式”</p>
        <p>部门编码：必须是系统里已存在的部门编码，否则会报错</p>
        <p>开户行：至少给出总行名字，最好细化到支行</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      uploadRulesVisible: false,
      uploadHeader: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  created() {
  },
  methods: {
    uploadSuccess({ success, message }) {
      if (success) {
        Message.success(message)
        this.$router.back()
      } else {
        Message.error(message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}

.upload-box {
  display: flex;
  justify-content: center;
  margin: 100px 0;
  .upload-btn {
    width: 360px;
    height: 180px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px 0 0 6px;
    .upload-btn-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      .el-upload__tip {
        text-align: center;
      }
      .a-btn {
        color: red;
      }
    }
  }
  .upload-drag {
     ::v-deep().el-upload-dragger {
      border-radius: 0 6px 6px 0;
      border-left: none;
    }
  }

}
</style>
