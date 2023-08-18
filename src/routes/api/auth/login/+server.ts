import type { RequestEvent } from './$types';
import { auth } from '$lib/server/lucia';

export const POST = async ({ request, locals }: RequestEvent) => {
	let { username, password } = await request.json();

	try {
		const key = await auth.useKey('username', username, password);
		const session = await auth.createSession(key.userId);
		locals.auth.setSession(session);
	} catch (err) {
		return new Response(
			JSON.stringify({
				message: 'Nombre de Usuario o Contraseña invalida',
				status: 'warning'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 401
			}
		);
	}

	return new Response(
		JSON.stringify({
			message: 'Inicio de Sesión Exitosa',
			status: 'success'
		}),
		{
			headers: { 'Content-Type': 'application/json', Location: '/' },
			status: 200
		}
	);
};
