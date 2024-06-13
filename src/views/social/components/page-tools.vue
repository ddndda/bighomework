<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="showBefore" class="before">
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

  <style lang="scss">
   .page-tools {
      margin: 10px;
      .before {
        font-size: 18px;
    }
   }
  </style>

