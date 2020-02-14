<template>
  <div id="app">
    <vuela :options="{namespace: 'es_backend',aggs_keyword_size: 500}" :flip="page" @result="handle_result" />
    <button @click='load_more'>load more</button>

    <div v-if="result">
      <p>scollr_id: {{ result.simple_scroll_id }}</p>
      <p>total: {{ result.hits.total }}</p>
      <ul>
        <li v-for="hit in result.hits.hits" :key="hit._id">
          {{ hit }}
        </li>
      </ul>
    </div>

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
        res.replace_or_append(this, 'result')
      }
    }
  }
</script>

<style>
</style>
