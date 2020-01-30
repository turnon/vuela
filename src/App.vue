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

    <selector class="mt-3" />
    <div>{{ $store.state.result }}</div>
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
      }
    },
    components: {
      selector
    },
    computed: {
      show_alarm() {
        return this.$store.state.alarm !== undefined
      }
    },

    methods: {
      get_mapping() {
        this.$store.dispatch('change_index', this.index_type)
      },

      submit_query() {
        this.$store.dispatch('submit')
      },
    }
  }
</script>

<style>
</style>
