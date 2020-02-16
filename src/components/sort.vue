<template>
  <el-cascader placeholder="sort" filterable clearable v-model="value" separator=": " :options="$store.getters.order_options"
    :props="props" @change="handle_change" />
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
        this.$emit('change_cond', {
          type: 'sort',
          cond: this.value[1]
        })
      }
    }
  }
</script>

<style scoped>
</style>
