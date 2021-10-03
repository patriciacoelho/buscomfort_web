import Vue from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './core/router';

/* Vue Leaflet */
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  extend,
  ValidationProvider,
  ValidationObserver
} from 'vee-validate';
import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

// import CustomRules from './core/validators';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/pt_BR.json';

const allRules = {
  ...rules,
  // ...CustomRules,
};

Object.keys(allRules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule],
  });
});

// extend('required', {
//   ...required,
//   message: 'Esse campo é obrigatório'
// });

Vue.component('apexchart', VueApexCharts);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

Vue.config.productionTip = false;

new Vue({
  vuetify,
	router,
  render: h => h(App)
}).$mount('#app');
