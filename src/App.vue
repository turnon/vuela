<template>
  <div id="app">
    <index @refresh-aggs="refresh_aggs" />
    <selector :aggs="aggs" />
  </div>
</template>

<script>
  import index from './components/index.vue'
  import selector from './components/selector.vue'

  export default {
    name: 'app',
    data(){
      return {
        aggs: {}
      }
    },
    components: {
      index,
      selector
    },
    methods: {
      refresh_aggs(aggs) {
        this.aggs = aggs
      }
    }
  }
</script>

<style>
</style>
