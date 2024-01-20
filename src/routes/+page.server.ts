import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, locals }) => {
  platform?.env.DB;

  return {
    user: locals.user
  };
};
