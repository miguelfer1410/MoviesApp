import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchMovieDetails, fetchShowDetails, fetchTrendingMovies, fetchTrendingShows } from '../server/api';
import { Context } from '../context/Context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '../routes/stack';
import { setTrendingMovies, setTrendingShows } from '../context/Actions'; 
import { useNavigation } from '@react-navigation/native';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    year:string
}

interface Show {
    id: number;
    name: string;
    poster_path: string;
    first_air_date: string;
}

const TrendingContent = () => {
    const [isMovies, setIsMovies] = useState(true);
    const { dispatch } = useContext(Context);
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();

    useEffect(() => {
        const getTrendingData = async () => {
            try {
                if (isMovies) {
                    const movies = await fetchTrendingMovies();
                    dispatch(setTrendingMovies(movies));
                } else {
                    const shows = await fetchTrendingShows();
                    dispatch(setTrendingShows(shows));
                }
            } catch (error) {
                console.error('Failed to fetch trending data:', error);
            }
        };

        getTrendingData();
    }, [isMovies, dispatch]);

    const handleTrendingClick = async (item: Movie | Show) => {
        
        if ('title' in item) {
            const year = item.release_date.split('-')[0];
            await fetchMovieDetails(item.title, year, dispatch);
        } else {
            await fetchShowDetails(item.name, dispatch);
        }
        navigation.navigate('Details');
    };

    const renderItem = ({ item }: { item: Movie | Show }) => (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => handleTrendingClick(item)}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.poster}
                />
            </TouchableOpacity>
        </View>
    );

    const { state } = useContext(Context);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15 }}>
                <TouchableOpacity onPress={() => setIsMovies(true)}>
                    <Text style={[styles.tabText, isMovies && styles.activeTab]}>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsMovies(false)}>
                    <Text style={[styles.tabText, !isMovies && styles.activeTab]}>Shows</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={isMovies ? state.trendingMovies : state.trendingShows}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        fontSize: 30,
        marginRight: 20,
        marginBottom: 5,
    },
    activeTab: {
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: 'tomato',
    },
    listContainer: {
        paddingBottom: 150,
    },
    item: {
        marginRight: 10,
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        padding: 3,
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
});

export default TrendingContent;
