import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import store_cfg from './functions/store.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)

new Vue({
  store: new Vuex.Store(store_cfg),
  render: h => h(App),
}).$mount('#app')
