import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { translateText } from '../server/api';

const languages = [
    { name: 'English', code: 'en' },
    { name: 'Español', code: 'es' },
    { name: 'Français', code: 'fr' },
    { name: 'Deutsch', code: 'de' },
    { name: 'Português', code: 'pt' }
];
interface Language {
    name: string;
    code: string;
}

const LanguageSelector = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); 
    const [translatedTitle, setTranslatedTitle] = useState('Language');

    useEffect(() => {
        const fetchTranslation = async () => {
            const translated = await translateText('Language', selectedLanguage.code); 
            setTranslatedTitle(translated); 
        };

        fetchTranslation();
    }, [selectedLanguage]); 

    const handlePress = () => {
        setModalVisible(true); 
    };

    const handleLanguageSelect = (language:Language) => {
        setSelectedLanguage(language); // Set both name and code
        setModalVisible(false); 
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{translatedTitle}</Text>
                    <Text style={styles.subtext}>Select a language...</Text>
                </View>
                <Text style={styles.selectedLanguage}>{selectedLanguage.name}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <FlatList
                                    data={languages}
                                    keyExtractor={(item) => item.code}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.languageOption}
                                            onPress={() => handleLanguageSelect(item)}
                                        >
                                            <Text style={styles.languageText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        height: 70,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    subtext: {
        color: 'lightgrey',
        fontSize: 12,
    },
    selectedLanguage: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // fundo transparente escuro
    },
    modalContent: {
        backgroundColor: '#333',
        width: 300,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: 'white',
        marginBottom: 20,
    },
    languageOption: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    languageText: {
        fontSize: 16,
        color: 'white',
    },
});

export default LanguageSelector;
