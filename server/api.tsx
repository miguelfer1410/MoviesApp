import { updateSuggestions, setSelectedMovie, setActors, setSimilarMovies, setSimilarSeries } from '../context/Actions';

const API_KEY_OMDB = 'c969c19d';
const BASE_URL_OMDB = 'https://www.omdbapi.com/';
const API_KEY_TMDB = 'fce634b6e2f52e4f649a31f8bfd6d1de';
const BASE_URL_TMDB = 'https://api.themoviedb.org/3';

export async function fetchMovies(searchInput: string, dispatch: any) {
  try {
    const response = await fetch(`${BASE_URL_OMDB}?apikey=${API_KEY_OMDB}&s=${searchInput}`);
    const data = await response.json();    
    if (data.Response === 'True') {
      dispatch(updateSuggestions(data.Search)); 
    } else {
      dispatch(updateSuggestions([])); 
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    dispatch(updateSuggestions([])); 
  }
}

export async function fetchMovieDetails(movie: string, year: string, dispatch: any) {
  try {
    const response = await fetch(`${BASE_URL_OMDB}?apikey=${API_KEY_OMDB}&t=${movie}&y=${year}`);
    const data = await response.json();

    if (data.Response === 'True') {
      dispatch(setSelectedMovie(data)); 
      fetchActors(data.Actors, dispatch); 
      if(data.Response.Type === 'Movie'){
        fetchSimilarMovies(data.imdbID,dispatch);
      }else{
        fetchSimilarSeries(data.imdbID, dispatch);
      }
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

async function fetchSimilarMovies(movie:string, dispatch: any){
  try{
    console.log(movie)
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie}/similar?api_key=${API_KEY_TMDB}`);
    const relatedMovies = await response.json();
    dispatch(setSimilarMovies(relatedMovies.results));
  }catch(error){
    console.error('Error fetching similar movies:', error);
    return null;
  }
}

async function fetchSimilarSeries(series:string, dispatch: any){
  try{
    const response = await fetch(`https://api.themoviedb.org/3/tv/${series}/similar?api_key=${API_KEY_TMDB}`);
    const relatedSeries = await response.json();
    dispatch(setSimilarSeries(relatedSeries));
  }catch(error){
    console.error('Error fetching similar movies:', error);
    return null;
  }
}


export async function fetchShowDetails(movie: string, dispatch: any) {
  try {    
    const response = await fetch(`${BASE_URL_OMDB}?apikey=${API_KEY_OMDB}&t=${movie}`);
    const data = await response.json();
    if (data.Response === 'True') {
      dispatch(setSelectedMovie(data)); 
      fetchActors(data.Actors, dispatch); 
    }    
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}


async function fetchActors(actorNames: string, dispatch: any) {
  const actorArray = actorNames.split(', ');
  const actorPromises = actorArray.map(name => searchActorsByName(name));
  try {
    const actors = await Promise.all(actorPromises);
    const flattenedActors = actors.flat();     
    dispatch(setActors(flattenedActors));
  } catch (error) {
    console.error('Error fetching actors:', error);
  }
}

async function searchActorsByName(name: string) {
  try {
    const response = await fetch(`${BASE_URL_TMDB}/search/person?api_key=${API_KEY_TMDB}&query=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error('Error fetching actors:', error);
    return [];
  }
}


const API_URL = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2U2MzRiNmUyZjUyZTRmNjQ5YTMxZjhiZmQ2ZDFkZSIsIm5iZiI6MTcyNjUwMDUzMi42NzYzNjgsInN1YiI6IjY2ZTdmYjJhOWRmYmJkZjBlNmNmZWVmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dY94hzKxCLjIauO9-Q_LIQ5Cg10T7kBBytRq-zV0kUg';

export const fetchTrendingMovies = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': API_KEY,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch trending movies');
        }

        const data = await response.json();
        return data.results; 
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
};

const APIShows_URL = 'https://api.themoviedb.org/3/trending/tv/week?language=en-US';


export const fetchTrendingShows = async () => {
  try {
      const response = await fetch(APIShows_URL, {
          method: 'GET',
          headers: {
              'Authorization': API_KEY,
              'Accept': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch trending movies');
      }

      const data = await response.json();
      
      return data.results; 
  } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
  }
};

export const translateText = async (text: string, code:string) => {
  console.log(code);
  
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(`en|${code}`)}`);
    const data = await res.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText; // Retorna o texto traduzido
    } else {
      console.error('Translation API error:', data);
      return text; // Se houver erro, retorna o texto original
    }
  } catch (error) {
    console.error('Error fetching translation:', error);
    return text; // Se houver erro, retorna o texto original
  }
};