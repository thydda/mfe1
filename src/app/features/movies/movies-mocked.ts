import type { Movie } from '@thydda/web-components';

/** Initial server data. Services clone it so writes never change this seed. */
export const MOVIES_MOCKED: readonly Movie[] = [
  {
    title: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    year: 2014,
    summary:
      'A devoted hotel concierge and his young protégé become entangled in a theft, a disputed inheritance, and the changing fortunes of a once-grand European establishment.',
    poster: '/posters/the-grand-budapest-hotel.jpg',
    id: 1,
  },
  {
    title: 'Arrival',
    director: 'Denis Villeneuve',
    year: 2016,
    summary:
      "A linguist works to communicate with mysterious visitors whose arrival challenges humanity's understanding of language, time, and cooperation.",
    poster: '/posters/arrival.jpg',
    id: 2,
  },
  {
    title: 'Spirited Away',
    director: 'Hayao Miyazaki',
    year: 2001,
    summary:
      'A young girl enters a spirit world and takes a job at a bathhouse to rescue her parents and find a way home.',
    poster: '/posters/spirited-away.jpg',
    id: 3,
  },
  {
    title: 'Moonlight',
    director: 'Barry Jenkins',
    year: 2016,
    summary:
      'Across three stages of his life, a young man in Miami searches for identity, connection, and a place where he can be himself.',
    poster: '/posters/moonlight.jpg',
    id: 4,
  },
  {
    title: 'The Truman Show',
    director: 'Peter Weir',
    year: 1998,
    summary:
      'A cheerful insurance salesman begins to suspect that his carefully managed hometown and everyday life are part of an elaborate production.',
    poster: '/posters/the-truman-show.jpg',
    id: 5,
  },
  {
    title: 'Parasite',
    director: 'Bong Joon-ho',
    year: 2019,
    summary:
      'When a struggling family finds work in a wealthy household, their plan for a better life exposes sharp divisions and unexpected consequences.',
    poster: '/posters/parasite.jpg',
    id: 6,
  },
  {
    title: 'Little Women',
    director: 'Greta Gerwig',
    year: 2019,
    summary:
      'The four March sisters navigate ambition, love, hardship, and adulthood while building lives on their own terms in post-Civil War America.',
    poster: '/posters/little-women.jpg',
    id: 7,
  },
  {
    title: 'The Apartment',
    director: 'Billy Wilder',
    year: 1960,
    summary:
      'An office worker lends his apartment to senior colleagues and must decide what matters when his career ambitions collide with his conscience.',
    poster: '/posters/the-apartment.jpg',
    id: 8,
  },
  {
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    year: 2015,
    summary:
      'A road warrior joins a rebel escape across a desert wasteland, pursued by a tyrant determined to reclaim his most valuable captives.',
    poster: '/posters/mad-max-fury-road.jpg',
    id: 9,
  },
  {
    title: 'Portrait of a Lady on Fire',
    director: 'Celine Sciamma',
    year: 2019,
    summary:
      "On an isolated island, a painter is commissioned to make a young woman's portrait, and their growing bond reshapes the work and its meaning.",
    poster: '/posters/portrait-of-a-lady-on-fire.jpg',
    id: 10,
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    year: 1994,
    summary:
      'An imprisoned banker forms a lasting friendship and quietly holds on to hope while adapting to decades behind bars.',
    poster: '/posters/the-shawshank-redemption.jpg',
    id: 11,
  },
  {
    title: 'Get Out',
    director: 'Jordan Peele',
    year: 2017,
    summary:
      "A weekend visit to meet his girlfriend's family becomes increasingly unsettling as a photographer uncovers the truth behind their hospitality.",
    poster: '/posters/get-out.jpg',
    id: 12,
  },
  {
    title: 'In the Mood for Love',
    director: 'Wong Kar-wai',
    year: 2000,
    summary:
      'Two neighbors discover that their spouses are having an affair and form a restrained, tender connection of their own.',
    poster: '/posters/in-the-mood-for-love.jpg',
    id: 13,
  },
  {
    title: 'The Iron Giant',
    director: 'Brad Bird',
    year: 1999,
    summary:
      'A boy befriends a giant robot from space and tries to protect it from fear-driven authorities during the Cold War.',
    poster: '/posters/the-iron-giant.jpg',
    id: 14,
  },
  {
    title: 'Whiplash',
    director: 'Damien Chazelle',
    year: 2014,
    summary:
      'An ambitious drummer at a demanding music conservatory pushes himself to excel under a teacher whose methods test every limit.',
    poster: '/posters/whiplash.jpg',
    id: 15,
  },
  {
    title: 'The Princess Bride',
    director: 'Rob Reiner',
    year: 1987,
    summary:
      'A farmhand sets out to reunite with his true love, crossing paths with swordfighters, schemers, and dangers in a storybook kingdom.',
    poster: '/posters/the-princess-bride.jpg',
    id: 16,
  },
  {
    title: 'Roma',
    director: 'Alfonso Cuaron',
    year: 2018,
    summary:
      'A domestic worker cares for a family in 1970s Mexico City as private upheavals and public events transform their lives.',
    poster: '/posters/roma.jpg',
    id: 17,
  },
  {
    title: 'The Social Network',
    director: 'David Fincher',
    year: 2010,
    summary:
      "A college student's creation of a social networking site brings rapid success, legal disputes, and fractures among former friends.",
    poster: '/posters/the-social-network.jpg',
    id: 18,
  },
  {
    title: 'My Neighbor Totoro',
    director: 'Hayao Miyazaki',
    year: 1988,
    summary:
      'Two sisters move to the countryside and discover gentle forest spirits while their family waits for their mother to recover in hospital.',
    poster: '/posters/my-neighbor-totoro.jpg',
    id: 19,
  },
  {
    title: 'Knives Out',
    director: 'Rian Johnson',
    year: 2019,
    summary:
      "A detective investigates a celebrated mystery writer's death, untangling the conflicting stories and motives of his eccentric family.",
    poster: '/posters/knives-out.jpg',
    id: 20,
  },
].map((movie) => ({
  ...movie,
  // Resolve assets against the remote module's origin when loaded by the shell.
  poster: new URL(movie.poster, import.meta.url).href,
}));
