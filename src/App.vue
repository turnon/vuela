<template>
  <div id="app">
    <index @refresh-aggs="refresh_aggs" @alarm="make_alarm" />
    <alarm :msg="alarm_msg" />
    <selector :aggs="aggs" />
  </div>
</template>

<script>
  import index from './components/index.vue'
  import alarm from './components/alarm.vue'
  import selector from './components/selector.vue'

  export default {
    name: 'app',
    data() {
      return {
        alarm_msg: "",
        aggs: {}
      }
    },
    components: {
      index,
      alarm,
      selector
    },
    methods: {
      refresh_aggs(aggs) {
        this.aggs = aggs
        this.alarm_msg = ""
      },
      make_alarm(a) {
        this.aggs = {}
        this.alarm_msg = a
      }
    }
  }
</script>

<style>
</style>
