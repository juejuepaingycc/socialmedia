import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import InnerHeader from '../../components/ui/innerHeader';
import {Scales, Colors} from '@common';
import styles from './policies.styles';

const PoliciesScreen = (props) => {
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
        title={'Policies'}
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

export default PoliciesScreen;
