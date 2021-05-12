import React from 'react';
import { SafeAreaView } from 'react-native';
import dynamicStyles from './styles';
import Tab from './Tab';
import { useDispatch, useSelector } from 'react-redux';
import { setChatNotiCount } from '../../notifications/redux';
import { firebaseNotification } from '../../notifications';

export const tabBarBuilder = (tabIcons, appStyles, label) => {
  return (props) => {
    const { navigation } = props;
    const colorScheme = 'light';
    const dispatch = useDispatch();
    const notis = useSelector((state) => state.notifications.chatNotifications);
    const styles = dynamicStyles(appStyles, colorScheme);
    return (
      <SafeAreaView style={styles.tabBarContainer}>
        {navigation.state.routes.map((route, index) => {
          return (
            <Tab
              key={index + ''}
              route={route}
              tabIcons={tabIcons}
              appStyles={appStyles}
              focus={navigation.state.index === index}
              onPress={() => {
                if(index == 0){
                  dispatch(setChatNotiCount(0));
                  firebaseNotification.resetChatNotification(notis)
                }
                navigation.navigate(route.routeName)
              }}
              label={label}
            />
          );
        })}
      </SafeAreaView>
    );
  };
};

export default tabBarBuilder;
