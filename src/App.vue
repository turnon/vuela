<template>
  <div id="app">

    <b-input-group>
      <b-form-input @keyup.13="get_mapping" v-model="index_type" />
      <b-input-group-append>
        <b-button @click="submit_query">submit</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-alert class="mt-3" v-model="show_alarm">
      {{ alarm_msg }}
    </b-alert>

    <selector :aggs="aggs" @selected="refresh_query" />
    <div>{{ result }}</div>
  </div>
</template>

<script>
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
      selector
    },
    computed: {
      index() {
        return new Index(this.index_type)
      },
      show_alarm() {
        return this.alarm_msg !== ""
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
