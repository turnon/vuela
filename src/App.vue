<template>
  <div id="app">
    <vuela :options="{namespace: 'es_backend',aggs_keyword_size: 100}" :flip="page" @result="handle_result" />
    <button @click='load_more'>load more</button>
    <div>{{ result }}</div>
  </div>
</template>

<script>
  import vuela from './components/vuela.vue'

  function flip() {
    return Object.create(null)
  }

  export default {
    name: 'app',
    components: {
      vuela
    },
    data() {
      return {
        result: null,
        page: flip()
      }
    },
    methods: {
      load_more() {
        this.page = flip()
      },
      handle_result(res) {
        this.result = res
      }
    }
  }
</script>

<style>
</style>
