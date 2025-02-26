import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { actions, RichToolBar } from 'react-native-pell-rich-editor'
import Styles from "../../../../constants/styles/Styles";

export const RichTextEditor = () => {
  return (
    <View>
        <TextInput style={[Styles.richBar, {margin: 20, marginRight: 30, marginTop: -30}]}
            placeholder="Write somethings ..."
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top" 
        >

        </TextInput>
    </View>
  );
};

export default RichTextEditor;