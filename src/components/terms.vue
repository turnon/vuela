<template>
  <el-cascader placeholder="terms" filterable v-model="included" :options="$store.state.aggs" :props="props" @change="handle_change" />
</template>

<script>
  import Vue from 'vue'
  import {
    Cascader,
    CascaderPanel
  } from 'element-ui';
  import {
    isEmpty
  } from 'element-ui/src/utils/util';

  Vue.use(Cascader)

  CascaderPanel.methods.syncActivePath = function() {
    const {
      store,
      multiple,
      activePath,
      checkedValue
    } = this;
    if (!isEmpty(activePath)) {
      const nodes = activePath.map(node => this.getNodeByValue(node.getValue()));
      // Fix "Cannot read property 'level' of null"
      // this.expandNodes(nodes);
      if (!nodes.every(node => node === null)) {
        this.expandNodes(nodes);
      }
    } else if (!isEmpty(checkedValue)) {
      const value = multiple ? checkedValue[0] : checkedValue;
      const checkedNode = this.getNodeByValue(value) || {};
      const nodes = (checkedNode.pathNodes || []).slice(0, -1);
      this.expandNodes(nodes);
    } else {
      this.activePath = [];
      this.menus = [store.getNodes()];
    }
  }

  function reduce_to_terms(options) {
    if (!options) {
      return []
    }

    let group_by_field = options.reduce((group_by_field, node) => {
      let group = group_by_field[node.field] || [];
      group.push(node.value);
      group_by_field[node.field] = group;
      return group_by_field
    }, {})


    let conditions = []
    for (let field in group_by_field) {
      let values = group_by_field[field]
      let condition = {
        terms: {
          [field]: values
        }
      }
      conditions.push(condition)
    }

    return conditions
  }

  export default {
    data() {
      return {
        props: {
          expandTrigger: 'hover',
          multiple: true
        },
        included: [],
      }
    },

    methods: {
      handle_change() {
        let terms = reduce_to_terms(this.included.map(arr => arr[1]))
        this.$emit("change_cond", {
          type: 'query',
          cond: terms
        })
      }
    }
  }
</script>

<style>
</style>
