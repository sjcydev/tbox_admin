import type { RequestEvent } from './$types';
import { auth } from '$lib/server/lucia';

export const POST = async ({ request, locals }: RequestEvent) => {
	let { userID, username, password } = await request.json();

	try {
		await auth.updateKeyPassword('username', username, password);
		const user = await auth.updateUserAttributes(userID, { password_updated: true });
		await auth.invalidateAllUserSessions(user.userID);
		const session = await auth.createSession(user.userID);
		locals.auth.setSession(session);
	} catch (err) {
		console.log(err);
		return new Response(
			JSON.stringify({
				message: 'Hubo un error, contacte al tecnico',
				status: 'warning'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 500
			}
		);
	}

	return new Response(
		JSON.stringify({
			message: 'Contraseña Actualizada',
			status: 'success'
		}),
		{
			headers: { 'Content-Type': 'application/json', Location: '/' },
			status: 200
		}
	);
};
