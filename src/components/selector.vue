<template>
  <div class='ves-selector'>
    <div class="include">
      <el-cascader placeholder="include" filterable v-model="included" :options="$store.state.aggs" :props="props"
        @change="handle_change" />
    </div>
    <div class="exclude">
      <el-cascader placeholder="exclude" filterable v-model="excluded" :options="$store.state.aggs" :props="props"
        @change="handle_change" style="margin-top: .25rem" />
    </div>
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

    watch: {
      "$store.state.current_index": function() {
        this.included = []
        this.excluded = []
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

  .ves-selector .include .el-cascader__tags .el-tag {
    color: #67c23a;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }

  .ves-selector .include .el-cascader__tags .el-tag .el-icon-close {
    background-color: #5daf34;
  }

  .ves-selector .exclude .el-cascader__tags .el-tag {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }

  .ves-selector .exclude .el-cascader__tags .el-tag .el-icon-close {
    background-color: #f56c6c;
  }
</style>
