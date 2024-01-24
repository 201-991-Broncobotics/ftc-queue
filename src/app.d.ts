// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: import('$lib/db.server').Database;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			lucia: import('lucia').Lucia;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: import('@cloudflare/workers-types').D1Database;
			};
		}
	}
}

export {};
