import forEach from 'lodash.foreach';
import MainHistory from './pages/Main';
import ShowHistory from './pages/History';

export const routes = {
	HISTORY: {
		name: 'history.main',
		path: '/historico',
		component: MainHistory,
		meta: {
			title: 'Histórico',
		},
	},
	SHOW_HISTORY: {
		name: 'history.show',
		path: '/historico/detalhamento/:bus',
		component: ShowHistory,
		meta: {
			title: 'Histórico',
		},
		props: true,
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
