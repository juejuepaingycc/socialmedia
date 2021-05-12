import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SplashScreen from 'react-native-splash-screen';
import React, { useState, useEffect } from 'react';
import InnerHeader from '../components/ui/innerHeader';
import { InnerChatNavigator, InnerFriendsNavigator,  } from './InnerStackNavigators';
import EloadScreen from '../screens/eLOAD/eLOAD';
import EpinScreen from '../screens/ePIN/ePIN';

const initialLayout = { width: Dimensions.get('window').width };

export default function ContactTabNavigator() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Friends' },
    { key: 'second', title: 'Group' },
    { key: 'third', title: 'Contacts' },
  ]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);


  const renderScene = SceneMap({
    first: InnerFriendsNavigator,
    second: EloadScreen,
    third: EloadScreen,
  });

  return (
    <TabView
    renderTabBar={props =>
    <TabBar
      {...props}
      tabStyle={{ backgroundColor: '#3494c7' }}
      activeColor="white"
      inactiveColor="#c2c3c8"
      indicatorContainerStyle={{
        backgroundColor: 'white',
        height: 20
      }}
  />

}
  navigationState={{ index, routes }}
  renderScene={renderScene}

  onIndexChange={setIndex}
  initialLayout={initialLayout}
/>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
