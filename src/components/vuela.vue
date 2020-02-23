<template>
  <div>
    <el-select v-model="index_type" placeholder="index" filterable style="width: 100%" @change="change_index">
      <el-option v-for="idx in $store.getters.index_names" :key="idx" :label="idx" :value="idx" />
    </el-select>

    <el-alert type="error" style="margin-top: .5rem" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <conditionslist v-if="$store.getters.has_aggs" />

    <div class="vuela-submit" v-if="$store.getters.has_aggs">
      <el-button type="success" plain @click="$store.dispatch('submit')">submit</el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    Input,
    Select,
    Option,
    Button,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Alert
  } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css';

  import conditionslist from './conditions_list.vue'
  import store from '../functions/store.js'

  Vue.use(Input)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Button)
  Vue.use(Dropdown)
  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)
  Vue.use(Alert)

  function replace_or_append(component, result_attr) {
    let last_result = component[result_attr]
    if (!last_result || last_result.simple_scroll_id !== this.simple_scroll_id) {
      component[result_attr] = this
      return
    }
    last_result.hits.hits = last_result.hits.hits.concat(this.hits.hits)
  }

  export default {
    store,
    props: ["options", "flip"],
    data() {
      return {
        new_cond: null,
        index_type: "",
      }
    },
    components: {
      conditionslist
    },

    watch: {
      flip: function(val) {
        this.$store.dispatch('load_more')
      },
      "$store.state.hits": function(val) {
        this.$emit('result', {
          replace_or_append,
          simple_scroll_id: this.$store.state.simple_scroll_id,
          hits: val
        })
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
  .vuela-submit .el-button {
    margin-top: .25rem;
    margin-left: 0;
    width: 100%;
  }
</style>
