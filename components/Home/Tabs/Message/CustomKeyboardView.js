import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';

const isIOS = Platform.OS === 'ios';

export default function CustomKeyboardView({ children, inChat }) {
    let kavConfig = {};
    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 90 };
    }

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={{ flex: 1 }}
            {...kavConfig}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    {children} 
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
