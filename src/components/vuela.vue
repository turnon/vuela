<template>
  <div>
    <el-select v-model="index_type" placeholder="index" filterable style="width: 100%" @change="change_index">
      <el-option v-for="idx in $store.getters.index_names" :key="idx" :label="idx" :value="idx" />
    </el-select>

    <el-alert type="error" style="margin-top: .5rem" :title="$store.state.alarm" :closable="false" v-show="$store.getters.has_alarm" />

    <div class="vuela-options" v-if="$store.getters.has_aggs">
      <div v-for="cond in conditions" :key="cond.id" style="margin-top: .25rem">
        <component :is="cond.operator" @change_cond="change_cond(cond.id, $event)" :style="{width: 'calc(100% - 97px)'}" />

        <div class="vuela-rm-buttons">
          <el-button type="info" plain icon="el-icon-check" />
          <el-button type="info" plain icon="el-icon-delete" />
        </div>
      </div>

      <el-select v-model="new_cond" placeholder="add condition" style="width: 100%; margin-top: .25rem" @change="add_cond">
        <el-option v-for="cond in ['match_phrase', 'terms', 'sorter',]" :key="cond" :label="cond" :value="cond" />
      </el-select>
    </div>

    <div class="vuela-submit" v-if="$store.getters.has_aggs">
      <el-button type="primary" plain @click="$store.dispatch('submit')">submit</el-button>
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
    Alert
  } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css';

  import terms from './terms.vue'
  import match_phrase from './match_phrase.vue'
  import sorter from './sorter.vue'
  import store from '../functions/store.js'

  Vue.use(Input)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Button)
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
        conditions: [],
        index_type: "",
      }
    },
    components: {
      match_phrase,
      terms,
      sorter
    },

    watch: {
      "$store.state.current_index": function() {
        this.conditions = []
      },
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
      add_cond() {
        this.conditions.push({
          id: Date.now().toString(),
          operator: this.new_cond
        })
      },
      change_cond(id, cond) {
        this.$store.commit('change_cond', {
          id,
          ...cond
        })
      },
      change_index() {
        this.$store.dispatch('change_index', this.index_type)
      },
    }
  }
</script>

<style>
  .vuela-options input.el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .vuela-submit .el-button {
    margin-top: .25rem;
    margin-left: 0;
    width: 100%;
  }

  .vuela-rm-buttons {
    display: inline-block;
    margin-left: -4px;
  }

  .vuela-rm-buttons button:nth-child(2) {
    margin-left: -5px;
    width: 50px;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
  }

  .vuela-rm-buttons button:nth-child(2) i {
    margin-left: -3px;
  }
</style>
