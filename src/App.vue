<template>
  <div id="app">
    <vuela :options="{namespace: 'es_backend',aggs_keyword_size: 100}" @result="handle_result" />
    <div>{{ result }}</div>
  </div>
</template>

<script>
  import vuela from './components/vuela.vue'

  export default {
    name: 'app',
    components: {
      vuela
    },
    data() {
      return {
        result: null
      }
    },
    methods: {
      handle_result(res) {
        this.result = res
      }
    }
  }
</script>

<style>
</style>
