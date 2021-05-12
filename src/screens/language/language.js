import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Button,
  FlatList,
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import {Scales, Colors} from '@common';
import styles from './language.styles';
import LanguageCard from '../../components/ui/languageCard';

const LanguageList = [
  {
    name: 'English',
  },
  {
    name: 'Hindi',
  },
  {
    name: 'Tamil',
  },
  {
    name: 'Telugu',
  },
  {
    name: 'Malyalam',
  },
];

const LanguageScreen = (props) => {
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
        title={'Choose Language'}
        onLeftIconPress={() => {
          props.navigation.toggleDrawer();
        }}
      />
      <View style={styles.Conatainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={LanguageList}
          renderItem={({item}) => <LanguageCard name={item.name} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default LanguageScreen;
