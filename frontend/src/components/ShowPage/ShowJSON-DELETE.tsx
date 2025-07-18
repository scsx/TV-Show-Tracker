import React from 'react'

const ShowJSONDelete = () => {
  const data = {
    adult: false,
    backdrop_path: '/l5jzuehwynnoEWUb9z25auHXQM.jpg',
    created_by: [
      {
        id: 1212409,
        credit_id: '67bdd41976904c59c85e9f6c',
        name: 'Clyde Phillips',
        original_name: 'Clyde Phillips',
        gender: 2,
        profile_path: '/ue6gnd9FRbl5wKZ9yHVtWp6ra4y.jpg',
      },
    ],
    episode_run_time: [],
    first_air_date: '2025-07-13',
    genres: [
      { id: 80, name: 'Crime' },
      { id: 18, name: 'Drama' },
    ],
    homepage: 'https://www.paramountplus.com/shows/dexter-resurrection/',
    id: 259909,
    in_production: true,
    languages: ['en'],
    last_air_date: '2025-07-13',
    last_episode_to_air: {
      id: 6192926,
      name: 'Camera Shy',
      overview:
        'Dexter tracks down a serial killer in NYC as Harrison spirals from guilt.',
      vote_average: 8.5,
      vote_count: 5,
      air_date: '2025-07-13',
      episode_number: 2,
      episode_type: 'standard',
      production_code: '',
      runtime: 48,
      season_number: 1,
      show_id: 259909,
      still_path: '/gxTEgknl8AequxdxtkLHOMFN5T3.jpg',
    },
    name: 'Dexter: Resurrection',
    next_episode_to_air: {
      id: 6192927,
      name: 'Backseat Driver',
      overview:
        'Dexter must carefully balance attempts to help get him acclimated.',
      vote_average: 0,
      vote_count: 0,
      air_date: '2025-07-20',
      episode_number: 3,
      episode_type: 'standard',
      production_code: '',
      runtime: 52,
      season_number: 1,
      show_id: 259909,
      still_path: '/bXYipb1dCBAod98DYU2sl1In2ci.jpg',
    },
    networks: [
      {
        id: 6631,
        logo_path: '/zFEsDBjBEj5OiM0FDRYY1NnG7a9.png',
        name: 'Paramount+ with Showtime',
        origin_country: 'US',
      },
    ],
    number_of_episodes: 10,
    number_of_seasons: 1,
    origin_country: ['US'],
    original_language: 'en',
    original_name: 'Dexter: Resurrection',
    overview:
      "Dexter Morgan awakens from a coma to find Harrison gone without a trace. Realizing the weight of what he put his son through, Dexter sets out for New York City, determined to find him and make things right. But closure won't come easy. When Miami Metro's Angel Batista arrives with questions, Dexter realizes his past is catching up to him fast. As father and son navigate their own darkness in the city that never sleeps, they soon find themselves deeper than they ever imagined - and that the only way out is together.",
    popularity: 136.2237,
    poster_path: '/jSoRKtjlqQi9Hb1hmGQ8cbDnCbj.jpg',
    production_companies: [
      {
        id: 6329,
        logo_path: '/inqnY5MWKZ2HnFR9xOUvfP7fwqk.png',
        name: 'MTV Entertainment Studios',
        origin_country: 'US',
      },
      {
        id: 238897,
        logo_path: null,
        name: 'Showtime Studios',
        origin_country: 'US',
      },
    ],
    production_countries: [
      { iso_3166_1: 'US', name: 'United States of America' },
    ],
    seasons: [
      {
        air_date: '2025-07-13',
        episode_count: 10,
        id: 403778,
        name: 'Season 1',
        overview:
          'Set a few weeks after Dexter: New Blood, Dexter Morgan chases a missing Harrison to New York City, where Captain Angel Batista is hot on their trail from way down in Miami.',
        poster_path: '/hRD9kvYLbySRvtt9Nh7QK6XECZX.jpg',
        season_number: 1,
        vote_average: 8.3,
      },
    ],
    spoken_languages: [
      { english_name: 'English', iso_639_1: 'en', name: 'English' },
    ],
    status: 'Returning Series',
    tagline: "He's alive & killing it.",
    type: 'Scripted',
    vote_average: 9,
    vote_count: 51,
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default ShowJSONDelete
