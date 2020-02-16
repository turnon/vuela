<template>
  <el-select v-model="value" filterable placeholder="sort" @change="handle_change">
    <el-option v-for="item in $store.getters.order_options" :key="item" :label="item" :value="item" />
  </el-select>
</template>

<script>
  export default {
    data() {
      return {
        value: "_doc"
      }
    },

    methods: {
      handle_change() {
        this.$emit('change_cond', {
          type: 'sort',
          cond: this.value
        })
      }
    }
  }
</script>

<style scoped>
</style>
