<template>
  <div id="app">
    <input @keyup.13="get_mapping" v-model="index_type" />
    <alarm :msg="alarm_msg" />
    <selector :aggs="aggs" @selected="refresh_query" />
  </div>
</template>

<script>
  import alarm from './components/alarm.vue'
  import selector from './components/selector.vue'

  import Index from './functions/index.js'

  export default {
    name: 'app',
    data() {
      return {
        index_type: "",
        alarm_msg: "",
        query: {},
        aggs: {}
      }
    },
    components: {
      alarm,
      selector
    },
    methods: {
      get_mapping() {
        let idx = new Index(this.index_type)
        idx.aggs_result(this.index_type).then(res => {
          this.alarm_msg = ""
          this.aggs = res
        }).catch(err => {
          let msg = err.response || err
          this.alarm_msg = msg
          this.aggs = {}
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
