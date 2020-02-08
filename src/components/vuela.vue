<template>
  <div>
    <el-input v-model="index_type" @change="get_mapping" />

    <el-alert type="error" style="margin-top: .5rem" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <selector style="margin-top: .25rem" />

    <el-button type="primary" plain style="margin-top: .25rem; width: 100%;" v-if="$store.getters.has_aggs" @click="$store.dispatch('submit')">submit</el-button>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    Input,
    Button,
    Alert
  } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css';

  import selector from './selector.vue'
  import store from '../functions/store.js'

  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Alert)

  export default {
    store,
    data() {
      return {
        index_type: "",
      }
    },
    components: {
      selector
    },

    watch: {
      "$store.state.result": function(val) {
        this.$emit('result', val)
      }
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
