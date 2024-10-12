import { SET_SIMILAR_SERIES,SET_SORT_OPTION,SET_SELECTED_MOVIE, UPDATE_SUGGESTIONS, SET_ACTORS ,SET_WATCHLIST,ADD_WATCHLIST,REMOVE_WATCHLIST, SET_FAVORITES, ADD_FAVORITES, REMOVE_FAVORITES, SET_TRENDING_SHOWS, Movie,Show, SET_TRENDING_MOVIES, SET_SIMILAR_MOVIES} from './Actions';


export interface State {
    movieTitle: string | null;
    suggestions: Movie[];
    selectedMovie: Movie | null;
    actors: string[];
    favorites: Movie[];
    watchlists: Movie[];
    trendingMovies: Movie[];
    trendingShows: Show[];
    sortOption: string | null;
    similarMovies: string [];
    similarSeries: string [];
}

export const initialState: State = {
    movieTitle: null,
    suggestions: [],
    selectedMovie: null,
    actors: [],
    favorites: [],
    watchlists:[],
    trendingMovies: [],
    trendingShows: [],
    sortOption: 'Title',
    similarMovies: [],
    similarSeries: [],
};


export const Reducer = (state = initialState, action: any): State => {
    switch (action.type) {
        case UPDATE_SUGGESTIONS:
            return {
                ...state,
                suggestions: action.payload,
            };
        case SET_SELECTED_MOVIE:
            console.log(action.payload)
            return {
                ...state,
                selectedMovie: action.payload,
            };
        case SET_ACTORS:
            return {
                ...state,
                actors: action.payload,
            };
        case SET_SIMILAR_MOVIES:
            console.log(action.payload)
            return {
                ...state,
                similarMovies: action.payload,
            };
        case SET_SIMILAR_SERIES:
            console.log(action.payload)
            return {
                ...state,
                similarSeries: action.payload,
            };
        case SET_FAVORITES:
            return {
                ...state,
                favorites: action.payload,
            };
        case ADD_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites, action.payload],
            };
        case REMOVE_FAVORITES:            
            return {
                ...state,
                favorites: state.favorites.filter(movie => movie.Title !== action.payload),
            };
        case SET_WATCHLIST:
            return {
                ...state,
                watchlists: action.payload,
            };
        case ADD_WATCHLIST:
            console.log('added');
            
            return {
                ...state,
                watchlists: [...state.watchlists, action.payload],
            };
        case REMOVE_WATCHLIST: 
            console.log('removed');
                       
            return {
                ...state,
                watchlists: state.watchlists.filter(movie => movie.Title !== action.payload),
            };
        case SET_TRENDING_MOVIES:
            return{
                ...state,
                trendingMovies: action.payload,
            }
        case SET_TRENDING_SHOWS:
            return {
                ...state,
                trendingShows: action.payload,
            };
        case SET_SORT_OPTION:
            return  {
                ...state,
                sortOption: action.payload,
            }
        default:
            return state;
    }
};
