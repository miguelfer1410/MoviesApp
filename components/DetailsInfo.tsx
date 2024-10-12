import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { Context } from '../context/Context';
import Ratings from './Ratings'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { StarRating } from './StarRating';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '../routes/stack';

const { width, height } = Dimensions.get('window');

interface Actor {
    id: number;
    profile_path: string;
    name: string;
}


const DetailsInfo = () => {
    const { state, dispatch } = useContext(Context);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();


    const handleFavoritePress = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

            if (isFavorite) {
                favorites = favorites.filter((movie: any) => movie.Title !== state.selectedMovie.Title);
                dispatch({
                    type: 'REMOVE_FAVORITES',
                    payload: state.selectedMovie.Title,
                });
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
                await AsyncStorage.setItem(`rating_${state.selectedMovie.Title}`, JSON.stringify(0));
            } else {
                const movieWithRating = { ...state.selectedMovie, rating: userRating };
                favorites.push(movieWithRating);
                dispatch({
                    type: 'ADD_FAVORITES',
                    payload: state.selectedMovie,
                });
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            }

            setIsFavorite((prev) => !prev);
        } catch (error) {
            console.error('Failed to save or remove favorite:', error);
        }
    };


    useEffect(() => {
        const checkIfFavoriteOrWatchList = async () => {
            if (!state.selectedMovie) return;
            try {
                const storedFavorites = await AsyncStorage.getItem('favorites');
                const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
                const favoriteMovie = favorites.find((movie: any) => movie.Title === state.selectedMovie?.Title);

                if (favoriteMovie) {
                    setIsFavorite(true);
                    setUserRating(favoriteMovie.rating || 0);
                } else {
                    setIsFavorite(false);
                    setUserRating(0); 
                }

                const storedWatchList = await AsyncStorage.getItem('watchlist');
                const watchlists = storedWatchList ? JSON.parse(storedWatchList) : [];
                const isMovieWatchlist = watchlists.some((movie: any) => movie.Title === state.selectedMovie?.Title);
                setIsInWatchlist(isMovieWatchlist);
            } catch (error) {
                console.error('Failed to check if movie is favorite or in watchlist:', error);
            }
        };
    
        checkIfFavoriteOrWatchList();
    }, [state.selectedMovie, isFavorite]);
    

    if (!state.selectedMovie) {
        return <Text>No movie selected</Text>;
    }

    const { Title, Released, Poster, Plot, Ratings: movieRatings, Director, Writer, Genre, Runtime, Type } = state.selectedMovie;



    const uniqueActors = state.actors
        .filter((actor: Actor, index: number, self: Actor[]) =>
            index === self.findIndex((a) => a.name === actor.name)
        )
        .filter((actor: Actor) => actor.profile_path);

    const handleWatchlistPress = async() => {
        try {
            const storedWatchlist = await AsyncStorage.getItem('watchlist');
            let watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : [];

            if (isInWatchlist) {
                watchlist = watchlist.filter((movie: any) => movie.Title !== Title); 
                console.log(Title);

                dispatch({
                    type: 'REMOVE_WATCHLIST',
                    payload: Title,
                });

                await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
            } else {
                watchlist.push(state.selectedMovie);

                dispatch({
                    type:'ADD_WATCHLIST',
                    payload: state.selectedMovie,
                });

                await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
            }
            setIsInWatchlist(!isInWatchlist);
        } catch (error) {
            console.error('Failed to save or remove favorite:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: Poster }} 
                    style={styles.poster} 
                    resizeMode="cover" 
                />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.title}>
                    {Title}
                </Text>
                <View style={{flexDirection:'row', marginTop:-32, alignSelf:'center'}}>
                    <Text style={styles.releaseDate}>({Released})</Text>
                    <Text style={{color:'white', marginTop:31}}>  |  {Runtime}</Text>
                </View>
            </View>

            <Text style={{color:'white', alignSelf:'center', marginBottom:10}} numberOfLines={2} ellipsizeMode="tail">
                Genre: {Genre}
            </Text>

            <Text style={{ color: 'white' , width:350, textAlign:'center'}}>{Plot}</Text>
            <Ratings ratings={movieRatings} />

            {isFavorite ? (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.favButton, isFavorite && styles.favButtonActive]} onPress={handleFavoritePress}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon style={{ marginRight: 10 }} name="bookmark" size={24} color="tomato" />
                            <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
                                Added to My {Type === 'movie' ? 'Movies' : 'Series'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', height:60 }}>
                    {isInWatchlist ? (
                        <View>
                            <TouchableOpacity 
                                style={{ width: 220, height: 60, borderWidth: 1, borderColor: 'white', borderRadius: 30, justifyContent: 'center', marginBottom:20 }}
                                onPress={handleWatchlistPress}
                            >
                                <View style={{flexDirection:'row', alignSelf:'center'}}>
                                    <Icon style={{ marginRight:10,color:'lightgrey'}} name="bookmark" size={24}/>
                                    <Text style={{ color: 'lightgrey', alignSelf: 'center', fontSize: 18 }}>
                                        Added to Watchlist
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.favButton, isFavorite && styles.favButtonActive]} onPress={handleFavoritePress}>
                                <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
                                    Add to My {Type === 'movie' ? 'Movies' : 'Series'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ width: 180, height: 60, borderWidth: 1, borderColor: 'white', borderRadius: 30, justifyContent: 'center' }} 
                                onPress={handleWatchlistPress}
                            >
                                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 18 }}>
                                    Add to Watchlist
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}


        {userRating === 0 ? (
            <View style={styles.ratingContainer}>
                <Text style={{ color: 'white',left:10,top:1,fontSize: 18, marginBottom: 5 }}>Rate:</Text>
                <StarRating userRating={userRating} setUserRating={(rating => {
                    setUserRating(rating);
                    if(!isFavorite){
                        handleFavoritePress();
                    }
                })} movieTitle={Title} />
            </View>
        ) : (
            <View style={styles.ratingContainer}>
                <Text style={{ color: 'white',left:10, top:1,fontSize: 18, marginBottom: 5 }}>Your Rating:</Text>
                <StarRating userRating={userRating} setUserRating={(rating => {
                    setUserRating(rating);
                    if(!isFavorite){
                        handleFavoritePress();
                    }
                })} movieTitle={Title} />
            </View>
        )}



            {uniqueActors.length > 0 && (
                <View style={{ flexDirection: 'column', height: 200 }}>
                    <Text style={{ color: 'white', fontSize: 20, left: 10, fontWeight: 'bold' }}>Cast & Crew</Text>
                    <View style={styles.actorContainer}>
                        <FlatList
                            data={uniqueActors}
                            horizontal={true}
                            keyExtractor={(actor: Actor) => actor.id.toString()}
                            renderItem={({ item: actor }: { item: Actor }) => (
                                <View style={styles.actorItem}>
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }}
                                        style={styles.actorImage}
                                    />
                                    <Text style={styles.actorName}>{actor.name}</Text>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
            )}

            <View style={{ flexDirection: 'row', marginTop: 80, bottom:30 }}>
                <View style={{ flexDirection: 'column', marginHorizontal:20 }}>
                    <Text style={{ color: 'white', fontSize: 17 , fontWeight:'bold'}}>Director</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{Director}       </Text>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight:'bold' }}>Writer</Text>
                    <Text style={{ color: 'white', fontSize: 10}}>{Writer}</Text>
                </View>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'black',
    },
    imageContainer: {
        width: width,
        height: height * 0.6,
        position: 'relative',
    },
    poster: {
        width: width, 
        height: height * 0.63,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'grey',
    },
    backButton: {
        position: 'absolute',
        top: 5, 
        left: 10, 
        width:40,
        height:40,
        justifyContent:'center',
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
        textAlign: 'center',
    },
    releaseDate: {
        color: 'white',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 30,
        alignSelf:'center'
    },
    actorContainer: {
        marginTop: 5,
    },
    actorItem: {
        alignItems: 'center',
        margin: 10,
    },
    actorImage: {
        width: 85,
        height: 120,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
    },
    actorName: {
        color: 'white',
        marginTop: 5,
        textAlign: 'center',
        maxWidth:90
    },
    favButton: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 30,
        width: 180,
        padding: 15,
        marginBottom: 20,
        marginRight:10,
        height:60
    },
    favButtonActive: {
        borderColor: 'tomato',
        width:235,
        marginBottom:20,
    },
    favButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 18,
    },
    favButtonTextActive: {
        color: 'tomato', 
        right:-10,
        
    },
    directorContainer: {
        borderWidth: 2,
        height: 200,
        borderColor: 'white',
        marginTop: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    ratingContainer: {
        marginTop: 20,
        marginBottom:20,
        alignItems: 'center',
        flexDirection:'row',
        justifyContent:'space-between',
        borderWidth:1,
        borderColor:'lightgrey',
        backgroundColor:'#445566',
        width:350,
        borderRadius:10,
        height:50,
    },
    starContainer: {
        flexDirection: 'row',
    },
    similarContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    similarTitle: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
        alignSelf: 'center',
    },
    similarItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    similarImage: {
        width: 100,
        height: 150,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    similarName: {
        color: 'white',
        marginTop: 5,
        textAlign: 'center',
        width: 100,
    },
});

export default DetailsInfo;
