<template>
  <el-cascader placeholder="terms" filterable v-model="included" :options="options" :props="props" @change="handle_change" />
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

  function merge_excluded(aggs, keep) {
    for (let k of keep) {
      let field_index = aggs.findIndex((field) => {
          return field.label === k.field
        }),
        children = aggs[field_index].children,
        value_index = children.findIndex((value) => {
          return value.key === k.value
        })

      if (value_index < 0) {
        children.push({
          key: k.value,
          label: `${k.value}(0)`,
          value: k
        })
      }
    }
    return aggs
  }

  export default {
    data() {
      return {
        props: {
          expandTrigger: 'hover',
          multiple: true
        },
        included: [],
        keep: [],
      }
    },

    computed: {
      options() {
        return merge_excluded(this.$store.state.aggs, this.keep)
      }
    },

    methods: {
      handle_change() {
        this.keep = this.included.map(arr => arr[1])
        let terms = reduce_to_terms(this.keep)
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
