<template>
  <div id="app">

    <el-input v-model="index_type" @change="get_mapping"/>
    <el-button type="primary" @click="$store.dispatch('submit')">submit</el-button>

    <el-alert type="error" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <!-- <selector class="mt-3" /> -->
    <div>{{ $store.state.result }}</div>
  </div>
</template>

<script>
  import selector from './components/selector.vue'

  import Es from './functions/es.js'

  export default {
    name: 'app',
    data() {
      return {
        index_type: "",
      }
    },
    components: {
      selector
    },

    methods: {
      get_mapping() {
        this.$store.dispatch('change_index', this.index_type)
      },
    }
  }
</script>

<style>
</style>
