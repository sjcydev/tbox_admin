import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prisma } from './prisma';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	autoDatabaseCleanup: true,
	transformDatabaseUser: (userData) => {
		return {
			userID: userData.id,
			username: userData.username,
			correo: userData.correo,
			name: userData.nombre,
			password_updated: userData.password_updated
		};
	}
});

export type Auth = typeof auth;
