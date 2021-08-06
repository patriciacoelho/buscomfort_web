import forEach from 'lodash.foreach';
import About from './pages/About';
import Support from './pages/Support';

export const routes = {
	SUPPORT: {
		name: 'support.main',
		path: '/suporte',
		component: Support,
		meta: {
			title: 'Suporte',
		},
		// props: true,
	},
	ABOUT: {
		name: 'about.main',
		path: '/sobre',
		component: About,
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
