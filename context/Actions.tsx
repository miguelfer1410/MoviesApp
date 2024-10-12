export const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS';
export const SET_SELECTED_MOVIE = 'SET_SELECTED_MOVIE';
export const SET_ACTORS = 'SET_ACTORS';
export const SET_SIMILAR_MOVIES = 'SET_SIMILAR_MOVIES';
export const SET_FAVORITES = 'SET_FAVORITES';
export const ADD_FAVORITES = 'ADD_FAVORITES';
export const REMOVE_FAVORITES = 'REMOVE_FAVORITES';
export const SET_WATCHLIST = 'SET_WATCHLIST';
export const ADD_WATCHLIST = 'ADD_WATCHLIST';
export const REMOVE_WATCHLIST = 'REMOVE_WATCHLIST';
export const SET_TRENDING_MOVIES = 'SET_TRENDING_MOVIES';
export const SET_TRENDING_SHOWS = 'SET_TRENDING_SHOWS';
export const SET_SORT_OPTION = 'SET_SORT_OPTION';
export const SET_SIMILAR_SERIES = 'SET_SIMILAR_SERIES';



export interface Movie {
    Title: string;
    Poster: string;
    Released: string;
}

export interface Show {
    Title: string;
    Poster: string;
    Released: string;
}

export const setSelectedMovie = (movie: any) => ({
    type: 'SET_SELECTED_MOVIE',
    payload: movie,
});

export const updateSuggestions = (suggestions: any[]) => ({
    type: 'UPDATE_SUGGESTIONS',
    payload: suggestions,
});

export const setActors = (actors: any[]) => ({
    type: 'SET_ACTORS',
    payload: actors,
});

export const setSimilarMovies = (movies: any[]) => ({
    type: 'SET_SIMILAR_MOVIES',
    payload: movies,
});

export const setSimilarSeries = (series: any[]) => ({
    type: 'SET_SIMILAR_SERIES',
    payload: series,
});

export const setFavorites = (favorites: Movie[]) => ({
    type: 'SET_FAVORITES',
    payload: favorites,
});

export const addFavorite = (favorite: Movie) => ({
    type: 'ADD_FAVORITES',
    payload: favorite,
});

export const removeFavorite = (favoriteTitle: string) => ({
    type: 'REMOVE_FAVORITES',
    payload: favoriteTitle,
});

export const setWatchlist = (watchlists: Movie[]) => ({
    type: 'SET_WATCHLIST',
    payload: watchlists,
});

export const addWatchlist = (watchlist: Movie) => ({
    type: 'ADD_WATCHLIST',
    payload: watchlist,
});

export const removeWatchlist = (watchlistTitle: string) => ({
    type: 'REMOVE_WATCHLIST',
    payload: watchlistTitle,
});

export const setTrendingMovies = (trending: any[]) => ({
    type:'SET_TRENDING_MOVIES',
    payload: trending,
})

export const setTrendingShows = (shows: Show[]) => ({
    type: 'SET_TRENDING_SHOWS',
    payload: shows,
});

export const setSortOption = (sortOption : string) => ({
    type: 'SET_SORT_OPTION',
    payload: sortOption,
});



