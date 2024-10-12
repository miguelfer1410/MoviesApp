import React from 'react';
import { View } from 'react-native';
import TrendingMovies from '../components/TrendingMovies';
import { Header } from '../components/Header';

export default function HomeScreen() {
    return (
        <View style={{backgroundColor:'black', height:'100%'}}>
            <Header />
            <TrendingMovies />
        </View>
    );
}




