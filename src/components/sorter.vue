<template>
  <div class='ves-selector'>
    <el-cascader placeholder="sort" filterable clearable v-model="value" separator=": " :options="$store.getters.order_options"
      :props="props" @change="handle_change" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        props: {
          expandTrigger: 'hover'
        },
        value: []
      }
    },

    methods: {
      handle_change() {
        this.$emit('change_sort', this.value[1])
      }
    }
  }
</script>

<style scoped>
  .ves-selector .el-cascader {
    width: 100%
  }
</style>
