import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import Es from './functions/es.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)

function handle_err(err) {
  return err.response || err
}

const store = new Vuex.Store({
  state: {
    es: null,
    alarm: null,
    selected: {},
    aggs: {},
  },
  mutations: {
    refresh_es(state, es) {
      state.es = es
    },
    refresh_alarm(state, alarm) {
      state.alarm = alarm
    },
    refresh_aggs(state, aggs) {
      state.aggs = aggs
    }
  },
  actions: {
    change_index({
      commit
    }, index) {
      let es = new Es(index)
      commit('refresh_es', es)
      es.aggs_result().then(res => {
        commit('refresh_aggs', res)
        commit('refresh_alarm')
      }).catch(err => {
        commit('refresh_aggs', {})
        commit('refresh_alarm', handle_err(err))
      })
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
