<template>
  <span class="info-item">
    <span class="label">{{ label }}：</span>
    <span class="value">{{ value }}</span>
  </span>
</template>

<script >
export default {
  name: 'InfoItem',
  props: {
    label: {
      type: String,
      default: ''

    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

  <style lang="scss" scoped>
  .info-item {
    display: inline-block;
   margin: 5px;
    width: 280px;
    .label {
      display: inline-block;
      margin-right: 10px;
      font-size: 14px;
      color: #646a73;
    }
    .value {
      font-size: 14px;
      color: #121826;
    }
  }

  </style>
