import React, { useContext, useEffect, useState,useRef  } from 'react';
import { StyleSheet,Text, TextInput, View, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchMovieDetails, fetchMovies } from '../server/api'; 
import { Context } from '../context/Context'; 
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '../routes/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecentSearches from './RecentSearches';
type RecentSearch = {
    title: string;
    year: string;
};
const SearchBar = () => {
    const { state, dispatch } = useContext(Context);
    const [searchInput, setSearchInput] = useState<string>('');
    const [recentSearches, setRecentSearches] = useState<{ title: string; year: string }[]>([]);
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();
    const back = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Home'>>();
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchInput.length > 2) { 
                fetchMovies(searchInput, dispatch);
            }
        };

        fetchSuggestions();
    }, [searchInput, dispatch]);

    useEffect(() => {

        if (textInputRef.current) {
            textInputRef.current.focus();
        }

        const loadRecentSearches = async () => {
            const storedSearches = await AsyncStorage.getItem('recentSearches');
            if (storedSearches) {
                setRecentSearches(JSON.parse(storedSearches));
            }
        };

        loadRecentSearches();
    }, []);

    const handleSuggestionPress = async (item: string, year: string) => {
        const newSearch = { title: item, year: year };
        state.suggestions = 0;
        await fetchMovieDetails(item, year, dispatch);
        setSearchInput('');
        navigation.navigate('Details');
        setRecentSearches((prev) => {
            const updatedSearches = [newSearch, ...prev.filter(search => search.title !== item)];
            const limitedSearches = updatedSearches.slice(0, 5); 
            AsyncStorage.setItem('recentSearches', JSON.stringify(limitedSearches));
            return limitedSearches;
        });
    };


    const handleRecentSearchPress = async (search: RecentSearch) => {
        await fetchMovieDetails(search.title, search.year, dispatch);
        navigation.navigate('Details');
    };


    const handleCancelPress = () => {
        back.navigate('Home');
    };

    const handleClearPress = async () => {
        setRecentSearches([]);
        await AsyncStorage.removeItem('recentSearches');
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.searchBox}>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', top: 5 }}>
                    <TouchableOpacity onPress={handleCancelPress}>
                        <Icon style={styles.button} name="times" size={24} color="lightgrey" />
                    </TouchableOpacity>
                    <TextInput
                        ref={textInputRef}
                        style={styles.input}
                        value={searchInput}
                        placeholder="Search..."
                        placeholderTextColor="lightgrey"
                        onChangeText={setSearchInput}
                    />
                </View>
            </View>

            {state.suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={state.suggestions}
                        keyExtractor={(item) => item.imdbID}
                        style={styles.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.suggestion} 
                                onPress={() => handleSuggestionPress(item.Title, item.Year)}
                            >
                                <Image 
                                    source={{ uri: item.Poster }} 
                                    style={styles.poster} 
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.Title}</Text>
                                    <Text style={styles.year}>{item.Year}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {recentSearches.length > 0 ? (
                <RecentSearches
                    searches={recentSearches}
                    onSearchPress={handleRecentSearchPress}
                    onClearPress={handleClearPress}
                />
            ):(
                <View style={styles.noRecentSearches}>
                    <Icon name="search" color="white" size={60}/>
                    <Text style={{marginTop:10}}>What are you looking for?</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
    },
    searchBox: {
        backgroundColor: '#333',
        height: 50,
        width: 350,
        borderRadius: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        justifyContent: 'space-between',
    },
    input: {
        height: 40,
        borderRadius: 20,
        marginLeft: 5,
        alignSelf: 'center',
        width: 300,
        color: 'lightgrey',
    },
    button: {
        backgroundColor: '#333',
        borderRadius: 30,
        alignSelf: 'center',
        marginLeft: 10,
        top: 6,
    },
    suggestionsContainer: {
        marginTop: 20,
        height: 500,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#2b2b2b',
    },
    suggestion: {
        padding: 10,
        backgroundColor: '#2b2b2b',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    poster: {
        width: 50,
        height: 75,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    textContainer: {
        flexShrink: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'white',
    },
    year: {
        fontSize: 14,
        color: 'white',
    },
    suggestionsList: {
        backgroundColor: 'black',
        borderRadius: 10,
        marginTop: 10,
    },
    noRecentSearches: {
        alignSelf: 'center',
        marginTop: 40,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchBar;
