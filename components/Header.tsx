import React from 'react';
import { View , Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '../routes/stack';

export const Header  = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'SearchResults'>>();

    const handleSearchPress = () => {
        navigation.navigate('SearchResults');
    };

    return(
        <View style={styles.header}>
            <Text style={styles.title}>Popular</Text>
            <TouchableOpacity onPress={handleSearchPress}>
                <Icon style={styles.button} name="search" size={24} color="lightgrey" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

    title:{
        fontSize:30,
        fontWeight:'bold',
        color:'white',
        marginLeft:13,
        marginBottom: 30,
        top:10,
    },

    header:{
        flexDirection:'row',
        justifyContent:'space-between',
    },

    button: {
        top:17,
        width:40,
        height:40,
    },

});
