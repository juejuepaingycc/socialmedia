import EloadScreen from '../screens/eLOAD/eLOAD';
import EpinScreen from '../screens/ePIN/ePIN';
import { BackHandler, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SplashScreen from 'react-native-splash-screen';
import React, { useEffect } from 'react';
import InnerHeader from '../components/ui/innerHeader';
import { IMLocalized } from '../Core/localization/IMLocalization';

const initialLayout = { width: Dimensions.get('window').width };

export default function TopTabNavigator(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: IMLocalized('EPIN') },
    { key: 'second', title: IMLocalized('ELOAD') },
  ]);

  function backButtonHandler() {
    props.navigation.navigate('Home')
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);


  const renderScene = SceneMap({
    first: EpinScreen,
    second: EloadScreen,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Top Up')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
        <TabView
        renderTabBar={props =>
        <TabBar
          {...props}
        // indicatorStyle={{ backgroundColor:'#ffffff' }}
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
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});