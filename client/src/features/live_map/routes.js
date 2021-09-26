import forEach from 'lodash.foreach';
import Main from './pages/Main';
import Home from './pages/Home';

export const routes = {
	HOME: {
		name: 'home',
		path: '/',
		component: Home,
		meta: {
			title: 'Home',
		},
		// props: true,
	},
	LIVE_MAP: {
		name: 'live-map.main',
		path: '/mapa',
		component: Main,
		meta: {
			title: 'Mapa',
		},
		// props: true,
	},
};

const buildRoutes = () => {
	let xRoutes = [];
	forEach(routes, (value) => {
		xRoutes = [
			...xRoutes,
			{
				...value,
			},
		];
	});

	return xRoutes;
};

export default [
	...buildRoutes(),
];
