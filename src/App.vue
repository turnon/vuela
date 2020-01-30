<template>
  <div id="app">

    <b-input-group>
      <b-form-input @keyup.13="get_mapping" v-model="index_type" />
      <b-input-group-append>
        <b-button @click="submit_query">submit</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-alert class="mt-3" v-model="show_alarm">
      {{ $store.state.alarm }}
    </b-alert>

    <selector :aggs="aggs" @selected="refresh_query" class="mt-3" />
    <div>{{ result }}</div>
  </div>
</template>

<script>
  import selector from './components/selector.vue'

  import Es from './functions/es.js'

  function handle_err(err) {
    return err.response || err
  }

  export default {
    name: 'app',
    data() {
      return {
        index_type: "",
        result: {},
        query: {},
      }
    },
    components: {
      selector
    },
    computed: {
      aggs(){
        return this.$store.state.aggs
      },
      show_alarm() {
        return this.$store.state.alarm !== undefined
      }
    },

    methods: {
      get_mapping() {
        this.$store.dispatch('change_index', this.index_type)
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
