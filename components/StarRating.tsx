import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStarHalfStroke, faStar as faStarO } from '@fortawesome/free-regular-svg-icons';
import {faStar as faStar} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

export const StarRating = ({ userRating, setUserRating, movieTitle }: { userRating: number, setUserRating: (rating: number) => void, movieTitle: string }) => {

    const handleStarPress = async (starIndex: number) => {
        let newRating;

        if (userRating === starIndex) {
            newRating = starIndex - 0.5;
        } else {
            newRating = starIndex;
        }

        setUserRating(newRating);

        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

            const updatedFavorites = favorites.map((movie: any) => {
                if (movie.Title === movieTitle) {
                    return { ...movie, rating: newRating };
                }
                return movie;
            });

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Failed to save rating:', error);
        }
    };
    

    const renderStar = (starIndex: number) => {
        if (userRating >= starIndex) {
            return faStar; 
        } else if (userRating >= starIndex - 0.5) {
            return faStarHalfStroke; 
        } else {
            return faStarO;
        }
    };

    return (
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                    <FontAwesomeIcon
                        icon={renderStar(star)}
                        size={30}
                        color={'lightgrey'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    ratingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        marginLeft:50,
        bottom:1,
        right:10,
    },
});
