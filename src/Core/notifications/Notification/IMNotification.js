import React from 'react';
import { FlatList, View, Text, Image, ActivityIndicator } from 'react-native';

import IMNotificationItem from './IMNotificationItem';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { UIActivityIndicator } from 'react-native-indicators';
import { Scales } from '@common';

function IMNotification({ notifications, onLoadMoreData, onNotificationDelete, onNotificationPress, appStyles, loading, loadingMoreData }) {
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const renderItem = ({ item, index }) => (
    <IMNotificationItem
      onNotificationPress={onNotificationPress}
      onNotificationDelete={onNotificationDelete}
      appStyles={appStyles}
      item={item}
      index={index}
    />
  );

  const renderFooter = () => {
    if(loadingMoreData)
        return (
          <ActivityIndicator style={{ margin: 10 }} size="small" />
        )
    else
        return null;
  }

  

  return (
     <View style={styles.container}>

      {
          loading?
          <View style={styles.indicatorContainer}>
            <UIActivityIndicator
              color="#f5f5f5"
              size={30}
              animationDuration={400}
            />
          </View>
          :
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
            onEndReached={() => {
              onLoadMoreData();
            }}
            onEndReachedThreshold={0.1}
            onRefresh={() => console.log("Refresh...")}
            refreshing={false}
            ListFooterComponent={renderFooter}
          />
        }
   
        
    
        
    </View>
  );
}

IMNotification.propTypes = {};

export default IMNotification;
