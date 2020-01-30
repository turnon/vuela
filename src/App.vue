<template>
  <div id="app">

    <b-input-group>
      <b-form-input @keyup.13="get_mapping" v-model="index_type" />
      <b-input-group-append>
        <b-button @click="$store.dispatch('submit')">submit</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-alert class="mt-3" v-model="$store.getters.has_alarm">
      {{ $store.state.alarm }}
    </b-alert>

    <selector class="mt-3" />
    <div>{{ $store.state.result }}</div>
  </div>
</template>

<script>
  import selector from './components/selector.vue'

  import Es from './functions/es.js'

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

    methods: {
      get_mapping() {
        this.$store.dispatch('change_index', this.index_type)
      },
    }
  }
</script>

<style>
</style>
