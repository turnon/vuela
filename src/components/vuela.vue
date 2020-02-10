<template>
  <div>
    <el-select v-model="index_type" placeholder="index" filterable style="width: 100%" @change="change_index">
      <el-option v-for="idx in $store.getters.index_names" :key="idx" :label="idx" :value="idx" />
    </el-select>

    <el-alert type="error" style="margin-top: .5rem" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <selector style="margin-top: .25rem" />

    <sorter style="margin-top: .25rem" />

    <el-button type="primary" plain style="margin-top: .25rem; width: 100%;" v-if="$store.getters.has_aggs" @click="$store.dispatch('submit')">submit</el-button>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    Select,
    Option,
    Button,
    Alert
  } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css';

  import selector from './selector.vue'
  import sorter from './sorter.vue'
  import store from '../functions/store.js'

  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Button)
  Vue.use(Alert)

  export default {
    store,
    props: ["options"],
    data() {
      return {
        index_type: "",
      }
    },
    components: {
      selector,
      sorter
    },

    watch: {
      "$store.state.result": function(val) {
        this.$emit('result', val)
      }
    },

    mounted() {
      this.$store.dispatch('load_indexes', this.options)
    },

    methods: {
      change_index() {
        this.$store.dispatch('change_index', this.index_type)
      },
    }
  }
</script>

<style>
  .ves-selector .el-select {
    width: 100%
  }
</style>
