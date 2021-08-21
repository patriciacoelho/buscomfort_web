import Vue from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './core/router';

/* Vue Leaflet */
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

Vue.config.productionTip = false;

new Vue({
  vuetify,
	router,
  render: h => h(App)
}).$mount('#app');