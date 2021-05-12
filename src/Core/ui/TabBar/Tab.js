import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons'
import dynamicStyles from './styles';
import { IMLocalized } from '../../localization/IMLocalization';
import { useSelector } from 'react-redux';

function Tab({ route, onPress, focus, tabIcons, appStyles }) {
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const name = tabIcons[route.routeName].name;
  const notiCount = useSelector((state) => state.notifications.chatNotiCount);

  return (
    <TouchableOpacity style={styles.tabContainer} onPress={onPress}>
        {
          tabIcons[route.routeName].icon == 'chatbubble-outline' && notiCount > 0 && (
            <View>
              <View style={styles.notiCount}>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {notiCount}
                </Text>
              </View>
            </View>
          )
        }

      {
        tabIcons[route.routeName].icon == 'chatbubble-outline' ?
        <IconIonicons
        name={tabIcons[route.routeName].icon}
        size={25}
        style={
          focus
          ?
          styles.focusicon
          :
          styles.unfocusicon
        }
/>
        :
        <IconMaterialIcons
        name={tabIcons[route.routeName].icon}
        size={25}
        style={
          focus
          ?
          styles.focusicon
          :
          styles.unfocusicon
        }
/>
      }

      <View>
      {
          focus
            ? 
            <Text style={{color: '#000', fontSize: 12, paddingTop: 2, marginBottom: 8}}>
              {/* {tabIcons[route.routeName].name} */}
              {IMLocalized(name)}
            </Text>
            : 
            <Text style={{color: '#3494c7',fontSize: 12, paddingTop: 2, marginBottom: 8}}>
              {/* {tabIcons[route.routeName].name} */}
              {IMLocalized(name)}
            </Text>
        }
      </View>
    </TouchableOpacity>
  );
}

export default Tab;

