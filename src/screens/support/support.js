import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import {Scales, Colors} from '@common';
import styles from './support.styles';
import {WebView} from 'react-native-webview';

const SupportScreen = (props) => {
  return (
    <View style={{flex: 1}}>
      {/* <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        animated={true}
      /> */}
      <InnerHeader
        iconLeft={'menu'}
        title={'Support'}
        onLeftIconPress={() => {
          props.navigation.toggleDrawer();
        }}
      />
      <View style={styles.Conatainer}>
        <WebView
          source={{uri: 'https://demos.co.uk/privacy-policy/'}}
          style={styles.WebView}
        />
      </View>
    </View>
  );
};

export default SupportScreen;
