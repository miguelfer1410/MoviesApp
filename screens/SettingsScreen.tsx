// SettingsScreen.tsx
import LanguageOption from '../components/LanguageOptions';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {

    return (
        <View style={styles.container}>
            <Text style={{color:'tomato', left:10, top:10}}>General</Text>
            <LanguageOption />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
    title: {
        left:10,
        color:'white',
        fontSize:18
    },
    subtext:{
        color:'white',
        left:10,
        fontSize:10
    },
    button:{
        marginTop:20,
        height:70,
        width:'100%',
        borderWidth:1,
        borderColor:'white',
        justifyContent:'center'
    }
});

export default SettingsScreen;
