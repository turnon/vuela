import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import store from './functions/store.js'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
