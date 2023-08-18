import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(307, '/login');

	if (user && user.password_updated) {
		throw redirect(303, '/');
	} else {
		return {
			userID: user.userID,
			username: user.username
		};
	}
};
