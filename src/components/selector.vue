<template>
  <div>

    <span class="selected-tag" v-for="s in $store.getters.flatten_selected" @click="pick_or_drop(s.bucket)">
      <el-tag size="mini" :type="s.picked ? 'success' : 'danger'">
        {{ s.bucket.label }}
      </el-tag>
    </span>

    <el-tree :data="$store.state.aggs" :props="{children: 'children',label: 'label'}" accordion @node-click="pick_or_drop" />

  </div>
</template>

<script>
  export default {
    name: 'selector',
    methods: {
      pick_or_drop(b) {
        if (b.children) return
        this.$store.commit("select", b)
      }
    }
  }
</script>

<style>
  .selected-tag {
    margin: 0 .25rem 0 0
  }
</style>
