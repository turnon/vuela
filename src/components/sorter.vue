<template>
  <div class='ves-selector' v-if="$store.getters.has_aggs">
    <el-cascader placeholder="order by" filterable clearable v-model="value" separator=": " :options="$store.getters.order_options"
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

    watch: {
      "$store.state.current_index": function() {
        this.value = []
      }
    },

    methods: {
      handle_change() {
        let sort = this.value[1] ? [this.value[1]] : []
        this.$store.commit("refresh", {
          sort: sort
        })
      }
    }
  }
</script>

<style scoped>
  .ves-selector .el-cascader {
    width: 100%
  }
</style>
