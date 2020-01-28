<template>
  <div>
    <input @keyup.13="get_mapping" v-model="index_type" />
  </div>
</template>

<script>
  import mapping from '../functions/mapping.js'

  export default {
    name: 'index',

    data() {
      return {
        index_type: ""
      }
    },

    methods: {
      get_mapping() {
        mapping.get_mapping(this.index_type)
          .then(res => {
            this.$emit("refresh-aggs", res)
          })
          .catch(err => {
            let msg = err.response || err
            this.$emit("alarm", msg)
          })
      }
    }
  }
</script>

<style>
</style>
