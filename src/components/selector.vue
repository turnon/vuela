<template>
  <div class='ves-selector'>

    <el-cascader v-model="picked" :options="$store.state.aggs" :props="{expandTrigger: 'hover', multiple: true}"
      @change="handle_change"></el-cascader>

    <!--    <el-cascader v-model="picked" :options="JSON.parse(JSON.stringify($store.state.aggs))" :props="{expandTrigger: 'hover', multiple: true}"
      @change="handleChange"></el-cascader> -->

    <!--    <span class="selected-tag" v-for="s in $store.getters.flatten_selected" @click="pick_or_drop(s.bucket)">
      <el-tag size="mini" :type="s.picked ? 'success' : 'danger'">
        {{ s.bucket.label }}
      </el-tag>
    </span>

    <el-card shadow="never" style="margin-top: .25rem" body-style="padding: .5rem">
      <el-tree :data="$store.state.aggs" :props="{children: 'children',label: 'label'}" accordion @node-click="pick_or_drop" />
    </el-card> -->

  </div>
</template>

<script>
  export default {
    name: 'selector',
    data() {
      return {
        picked: null
      }
    },
    methods: {
      pick_or_drop(b) {
        if (b.children) return
        this.$store.commit("select", b)
      },
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

  .selected-tag {
    margin: 0 .25rem 0 0
  }
</style>
