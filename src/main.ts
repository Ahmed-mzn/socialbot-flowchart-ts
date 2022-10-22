import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


Vue.config.productionTip = false

import { BaklavaVuePlugin } from '@baklavajs/plugin-renderer-vue'
import '@baklavajs/plugin-renderer-vue/dist/styles.css'

Vue.use(BaklavaVuePlugin)


import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);


Vue.prototype.log = console.log

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
