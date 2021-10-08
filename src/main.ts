import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import Axios from 'axios';
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import './styles.scss'

Vue.use(ElementUI, { locale })
Vue.use(Vuex);
Vue.use(VueAxios, Axios)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
