import FavoriteList from '../components/FavoriteList';
import React from 'react';
import { View } from 'react-native';



export default function FavoriteScreen() {
    return (
      <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'steelblue' }}>
        <FavoriteList />
      </View>
    );
  }
  