import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type RecentSearch = {
    title: string;
    year: string;
};

interface RecentSearchesProps {
    searches: RecentSearch[];
    onSearchPress: (search: RecentSearch) => void;
    onClearPress: () => Promise<void>;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSearchPress, onClearPress }) => {


    return (
        <View style={styles.container}>
            <FlatList
                data={searches}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => onSearchPress(item)}>
                        <FontAwesomeIcon icon={faHistory} size={25} color="lightgrey" />
                        <Text style={styles.searchItem}>{item.title} ({item.year})</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
                <Text>CLEAR RECENT SEARCHES</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    searchItem: {
        color: 'lightgrey',
        marginVertical: 5,
        marginHorizontal:15,
    },
    itemContainer: {
        flexDirection:'row',
        marginTop:10,
        marginLeft:10,
    },
    clearButton:{
        marginTop:20,
        marginLeft:10,

    },
});

export default RecentSearches;
