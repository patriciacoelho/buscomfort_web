import Vue from 'vue';
import VueRouter from 'vue-router';
import get from 'lodash.get';

import LiveMapRoutes from '../../features/live_map/routes';
import SupportRoutes from '../../features/support/routes';
import HistoryRoutes from '../../features/history/routes';
import SettingsRoutes from '../../features/settings/routes';

Vue.use(VueRouter);

const routes = [
	...LiveMapRoutes,
	...SupportRoutes,
	...HistoryRoutes,
	...SettingsRoutes,
	{
		path: '*',
		beforeEnter (_, __, next) {
			next({ path: '/' });
		},
	}
];
const router = new VueRouter({
	mode: 'history',
	routes,
});

router.beforeEach((to, _, next) => {
	document.title = 'busComfort';

	const pageTitle = get(to, 'meta.title', false);

	if(pageTitle) {
		document.title = `${pageTitle} - ${document.title}`;
	}

	next();
});

export default router;
