import forEach from 'lodash.foreach';
import Main from './pages/Main';
import SettingsForm from './pages/SettingsForm';

export const routes = {
	SETTINGS: {
		name: 'settings.main',
		path: '/configuracoes',
		component: Main,
		meta: {
			title: 'Configurações dos ônibus',
		},
		// props: true,
	},
	CREATE_SETTINGS: {
		name: 'settings.new',
		path: '/configuracoes/novo',
		component: SettingsForm,
		meta: {
			title: 'Configuração do ônibus',
		},
		// props: true,
	},
	EDIT_SETTINGS: {
		name: 'settings.edit',
		path: '/configuracoes/editar/:bus',
		component: SettingsForm,
		meta: {
			title: 'Configuração do ônibus',
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
