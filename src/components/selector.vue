<template>
  <div class='ves-selector'>
    <el-cascader v-model="picked" :options="$store.state.aggs" :props="{expandTrigger: 'hover', multiple: true}"
      @change="handle_change"></el-cascader>
  </div>
</template>

<script>
  import {
    CascaderPanel
  } from 'element-ui';
  import {
    isEmpty
  } from 'element-ui/src/utils/util';

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
        picked: null
      }
    },
    methods: {
      handle_change() {
        let nodes = this.picked.map(arr => arr[1])
        this.$store.commit("pick", nodes)
      }
    }
  }
</script>

<style>
  .ves-selector .el-cascader {
    width: 100%
  }
</style>
