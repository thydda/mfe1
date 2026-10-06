import type { Movie } from '@thydda/web-components';

/** POST payload: the server assigns the identity after creation. */
export interface CreateMovie extends Omit<Movie, 'id'> {}
