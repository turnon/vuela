<template>
  <div class='ves-selector' v-if="$store.getters.has_aggs">
    <el-cascader placeholder="include" v-model="included" :options="$store.state.aggs" :props="props"  @change="handle_change" />
    <el-cascader placeholder="exclude" v-model="excluded" :options="$store.state.aggs" :props="props"  @change="handle_change"
      style="margin-top: .25rem" />
  </div>
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

  export default {
    name: 'selector',
    data() {
      return {
        props: {
          expandTrigger: 'hover',
          multiple: true
        },
        included: [],
        excluded: []
      }
    },
    methods: {
      handle_change() {
        this.$store.commit("pick", {
          included: this.included.map(arr => arr[1]),
          excluded: this.excluded.map(arr => arr[1])
        })
      }
    }
  }
</script>

<style>
  .ves-selector .el-cascader {
    width: 100%
  }
</style>
