import React from 'react';
import { View } from 'react-native';
import SearchBar from '../components/SearchBar';
const SearchResultsScreen = () => {
  return (
    <View style={{flex:1,backgroundColor: 'black' }}>
      <SearchBar />
    </View>
  );
};

export default SearchResultsScreen;
