<template>
  <div id="app">
    <input @keyup.13="get_mapping" v-model="index_type" />
    <button @click="submit_query">submit</button>
    <alarm :msg="alarm_msg" />
    <selector :aggs="aggs" @selected="refresh_query" />
    <div>{{ result }}</div>
  </div>
</template>

<script>
  import alarm from './components/alarm.vue'
  import selector from './components/selector.vue'

  import Index from './functions/index.js'

  function handle_err(err) {
    return err.response || err
  }

  export default {
    name: 'app',
    data() {
      return {
        index_type: "",
        alarm_msg: "",
        result: {},
        query: {},
        aggs: {}
      }
    },
    components: {
      alarm,
      selector
    },
    computed: {
      index() {
        return new Index(this.index_type)
      }
    },

    methods: {
      get_mapping() {
        this.index.aggs_result(this.index_type).then(res => {
          this.alarm_msg = ""
          this.aggs = res
        }).catch(err => {
          this.alarm_msg = handle_err(err)
          this.aggs = {}
        })
      },

      submit_query() {
        this.index.search(this.query).then(res => {
          this.alarm_msg = ""
          this.result = res
        }).catch(err => {
          this.alarm_msg = handle_err(err)
          this.result = {}
        })
      },

      refresh_query(body) {
        this.query = body
        console.log(JSON.stringify(body))
      }
    }
  }
</script>

<style>
</style>
