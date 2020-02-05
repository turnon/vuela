<template>
  <div id="app">

    <el-input v-model="index_type" @change="get_mapping">
      <el-button slot="append" icon="el-icon-search" @click="$store.dispatch('submit')" />
    </el-input>

    <el-alert type="error" style="margin-top: .5rem" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <selector style="margin-top: .25rem" />

    <div>{{ $store.state.result }}</div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Input,
    Button,
    Alert
  } from 'element-ui'
  import selector from './components/selector.vue'

  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Alert)

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
