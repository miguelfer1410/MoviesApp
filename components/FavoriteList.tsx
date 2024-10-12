import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image ,RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../context/Context';
import { fetchMovieDetails, fetchShowDetails } from '../server/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '../routes/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { Picker } from '@react-native-picker/picker';  // Importe o Picker aqui
import RNPickerSelect from 'react-native-picker-select';


interface Rating {
    Source: string;
    Value: string;
}

interface Movie {
    Title: string;
    Poster: string;
    Released: string;
    Year:string;
    Plot: string;
    Type: 'movie';
    Ratings?: Rating[];
    rating: string;
}

interface Show {
    Name: string;
    Poster: string;
    FirstAirDate: string;
    Plot: string;
    Type: 'series';
    Ratings?: Rating[];
    Year:string;
    rating: string;
}

type FavoriteItem = Movie | Show;


const sortItems = <T extends FavoriteItem>(items: T[], sortOption: string): T[] => {
    switch (sortOption) {
        case 'Title':
            return items.sort((a, b) => ('Title' in a ? a.Title : a.Name).localeCompare('Title' in b ? b.Title : b.Name));
        case 'Year':
            return items.sort((a, b) => {
                const yearA = parseInt(a.Year || '0', 10);
                const yearB = parseInt(b.Year || '0', 10);
                return yearB - yearA;
            });
        case 'Rating':
            return items.sort((a, b) => {
                const ratingA = a.Ratings?.find(rating => rating.Source === "Internet Movie Database")?.Value.split('/')[0];
                const ratingB = b.Ratings?.find(rating => rating.Source === "Internet Movie Database")?.Value.split('/')[0];
                const ratingNumberA = ratingA ? parseFloat(ratingA) : 0;
                const ratingNumberB = ratingB ? parseFloat(ratingB) : 0;
                return ratingNumberB - ratingNumberA;
            });
        case 'UserRatingHigh':
            return items.sort((a,b) => {
                const userRatingA = parseFloat(a.rating);
                const userRatingB = parseFloat(b.rating);
                console.log(userRatingA);
                console.log(userRatingB);
                return userRatingB - userRatingA;
            });
        case 'UserRatingLow':
            return items.sort((a,b) => {
                const userRatingA = parseFloat(a.rating);
                const userRatingB = parseFloat(b.rating);
                return userRatingA - userRatingB;
            });
        default:
            return items;
    }
};


const isMovie = (item: FavoriteItem): item is Movie => item.Type === 'movie';

const isShow = (item: FavoriteItem): item is Show => item.Type === 'series';

const FavoriteList = () => {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [favoriteShows, setFavoriteShows] = useState<Show[]>([]);
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
    const [watchlistShows, setWatchlistShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMovies, setIsMovies] = useState(true); 
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();
    const { state, dispatch } = useContext(Context);

    const loadFavoritesAndWatchlist = useCallback(async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const favorites: FavoriteItem[] = storedFavorites ? JSON.parse(storedFavorites) : [];

            const movies = favorites.filter(isMovie);
            const shows = favorites.filter(isShow);

            setFavoriteMovies(sortItems(movies, state.sortOption));
            setFavoriteShows(sortItems(shows, state.sortOption));

            const storedWatchlist = await AsyncStorage.getItem('watchlist');
            const watchlist: FavoriteItem[] = storedWatchlist ? JSON.parse(storedWatchlist) : [];

            const watchlistMovies = watchlist.filter(isMovie);
            const watchlistShows = watchlist.filter(isShow);

            setWatchlistMovies(sortItems(watchlistMovies, state.sortOption));
            setWatchlistShows(sortItems(watchlistShows, state.sortOption));

            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load data:', error);
            setIsLoading(false);
        }
    }, [state.sortOption]);

    useEffect(() => {
        loadFavoritesAndWatchlist();
        console.log('changed');
    }, [state.favorites, state.watchlists, loadFavoritesAndWatchlist]); 

    const handleFavoritePress = async (item: FavoriteItem) => {
        if ('Title' in item) {
            const year = item.Released ? item.Released.split(' ').pop() : 'Unknown Year'; 
            await fetchMovieDetails(item.Title, year ?? 'Unknown Year', dispatch);
        } else if ('Name' in item) {
            await fetchShowDetails(item.Name, dispatch);
        }
        navigation.navigate("Details");
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadFavoritesAndWatchlist();
        setRefreshing(false); // Ensure this is called to stop the refresh animation
    };

    const handleSortOptionChange = (sortOption: string) => {
        dispatch({
            type: 'SET_SORT_OPTION',
            payload: sortOption,
        });
    };

    const renderItem = ({ item }: { item: FavoriteItem }) => {
        const imdbRating = item.Ratings?.find(rating => rating.Source === "Internet Movie Database");
        const ratingValue = imdbRating ? imdbRating.Value.split('/')[0] : 'N/A';

        return (
            <View style={styles.movieItem}>
                <TouchableOpacity style={{ flexDirection: 'row', width: 340 }} onPress={() => handleFavoritePress(item)}>
                    <Image source={{ uri: item.Poster }} style={styles.poster} />
                    <View style={styles.movieDetails}>
                        <View style={{flexDirection:'row', top:-12,right:10, position:'static', alignSelf:'flex-end'}}>
                            <Icon style={{marginRight:5, marginTop:1}} name="star" size={16} color="tomato" />
                            <Text style={{color:'white'}}>{ratingValue}</Text>
                        </View>
                        <Text style={{color:'tomato', top:-10}}>{item.Year}</Text>
                        <Text style={styles.movieTitle}>
                            {'Title' in item ? item.Title : item.Name}
                        </Text>
                        <Text style={[styles.movieReleased, styles.textEllipsis]} numberOfLines={2}>
                            {item.Plot}
                        </Text>
                        <View style={{flexDirection:'row', top:10}}>
                            <Text style={{fontWeight:'bold'}}>Your Rating: </Text>
                            <Text style={{fontWeight:'bold'}}>{item.rating} </Text>
                            <Icon name='star' style={{top:3.5}} color={"gold"} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.noFavoritesText}>Loading...</Text>
            </View>
        );
    }

    const itemsToDisplay = isWatchlist
        ? isMovies
            ? watchlistMovies
            : watchlistShows
        : isMovies
            ? favoriteMovies
            : favoriteShows;

    return (
        <FlatList
            data={itemsToDisplay}
            keyExtractor={(item) => 'Title' in item ? item.Title : item.Name}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor:'black'}}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListHeaderComponent={
                <View style={{ backgroundColor: 'black', padding: 20 }}>
                    <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', marginBottom: 10 }}>My Collection</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 8 }}>
                        <TouchableOpacity onPress={() => { setIsMovies(true); setIsWatchlist(false); }}>
                            <Text style={[styles.tabText, isMovies && styles.activeTab]}>Movies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setIsMovies(false); setIsWatchlist(false); }}>
                            <Text style={[styles.tabText, !isMovies && styles.activeTab]}>Shows</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', marginBottom:10}}>
                        {isMovies ? (
                            <>
                                <TouchableOpacity style={[styles.subTabButton, isMovies && !isWatchlist && styles.activeSubTabButton]} 
                                onPress={() => { setIsWatchlist(false); setIsMovies(true); }}>
                                    <Text style={{color:'white' , fontWeight:'bold', fontSize:20}}>My Movies</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.subTabButton, isMovies && isWatchlist && styles.activeSubTabButton]}
                                onPress={() => setIsWatchlist(true)}>
                                    <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>Watchlist</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={[styles.subTabButton, !isMovies && !isWatchlist && styles.activeSubTabButton]} 
                                onPress={() => { setIsWatchlist(false); setIsMovies(false); }}>
                                    <Text style={{color:'white'}}>My Shows</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.subTabButton, !isMovies && isWatchlist && styles.activeSubTabButton]}
                                onPress={() => setIsWatchlist(true)}>
                                    <Text style={{color:'white'}}>Watchlist</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <RNPickerSelect
                        onValueChange={(value) => handleSortOptionChange(value)}
                        items={[
                            { label: 'Title', value: 'Title' },
                            { label: 'Year', value: 'Year' },
                            { label: 'Rating', value: 'Rating' },
                            { label: 'Your Rating (Highest First)', value: 'UserRatingHigh' },
                            { label: 'Your Rating (Lowest First)', value: 'UserRatingLow' },
                        ]}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{
                            label: 'Sort by...',
                            value: null,
                            color: 'gray',
                        }}
                        style={{
                            inputAndroid: {
                                borderColor: 'white',
                                borderWidth: 1,
                                color: 'white',
                                width: 'auto',
                                minWidth:120,
                                borderRadius: 10,
                                top: 5,
                                marginVertical:15,
                                padding:10,
                                textAlign:'center',
                                alignSelf: 'flex-start',
                                fontSize: 15,
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </View>
            }
            ListEmptyComponent={
                <Text style={styles.noFavoritesText}>
                    {isWatchlist
                        ? `You have no items in your watchlist.`
                        : isMovies
                            ? `You have no favorite movies.`
                            : `You have no favorite shows.`}
                </Text>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
    },
    movieItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
        width:355,
        alignSelf:'center',
        height:171,
    },
    textEllipsis: {
        overflow: 'hidden',
    },
    tabText: {
        color: 'white',
        fontSize: 30,
        marginRight: 25, 
        marginBottom:10,
        marginLeft:-10
    },
    activeTab: {
        fontWeight: 'bold',
        color:'tomato'
    },
    activeSubTabButton: {
        borderBottomColor: 'tomato', 
    },
    subTabButton: {
        marginRight: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
    movieDetails: {
        marginLeft: 10,
        justifyContent: 'center',
        flex:1
    },
    movieTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        maxWidth:250,
        top:-10
    },
    movieReleased: {
        color: 'gray',
        maxWidth:220,
        top:-10
    },
    removeButton: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'tomato',
        borderRadius: 5,
        width:200
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noFavoritesText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});

export default FavoriteList;
