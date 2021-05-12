import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, FlatList, ActivityIndicator } from 'react-native';
import IMConversationView from '../IMConversationView';
import IMConversationForwardView from '../IMConversationForwardView';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';
import { TNEmptyStateView } from '../../truly-native';

const IMConversationList = memo((props) => {
  const {
    onConversationPress,
    onConversationLongPress,
    onSendForward,
    emptyStateConfig,
    conversations,
    loading,
    appStyles,
    forwarded,
    forwardMessage
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const [conversations2, setConversations2] = useState();
  const formatMessage = (item) => {
    if (item?.lastMessage?.mime?.startsWith('video')) {
      return IMLocalized('Someone sent a video');
    } else if (item?.lastMessage?.mime?.startsWith('audio')) {
      return IMLocalized('Someone sent an audio');
    } else if (item?.lastMessage?.mime?.startsWith('image')) {
      return IMLocalized('Someone sent a photo');
    } else if (item?.lastMessage) {
      if(item.lastMessage == 'Missed call')
        return IMLocalized('Missed Call')
      else if(item.lastMessage == 'Call ended')
        return IMLocalized('Call Ended')
      else
        return item.lastMessage;
    }
    return '';
  };

  useEffect(()=> {
    setConversations2(conversations)
  },[conversations])

  const onSend = (msg, item) => {
    // let temp = conversations2;
    // for(let i=0;i<=conversations2.length;i++){
    //   if(i == conversations2.length){
    //     setConversations2(temp);
    //   }
    //   else if(conversations2[i].id == item.id){
    //     temp[i]['sent'] = true;
    //     console.log("Sent...");
    //   }
    // }
    onSendForward(msg, item);
  }

  const renderConversationView = ({ item }) => (
      <IMConversationView
      formatMessage={formatMessage}
      onChatItemPress={onConversationPress}
      onChatItemLongPress={onConversationLongPress}
      item={item}
      appStyles={appStyles}
      onSendForward={onSend}
    /> 
  );

  const renderConversationForwardView = ({ item }) => (
    <IMConversationForwardView
    formatMessage={formatMessage}
    onChatItemPress={onConversationPress}
    onChatItemLongPress={onConversationLongPress}
    item={item}
    appStyles={appStyles}
    onSendForward={onSend}
    forwardMessage={forwardMessage}
  /> 
);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.chatsChannelContainer}>
          {conversations && conversations.length > 0 && forwarded && (
            <FlatList
              vertical={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={conversations2}
              renderItem={renderConversationForwardView}
              keyExtractor={(item) => `${item.id}`}
              removeClippedSubviews={true}

              onEndReachedThreshold={0.1} // Tried 0, 0.01, 0.1, 0.7, 50, 100, 700

              onEndReached = {({distanceFromEnd})=>{ // problem
               // console.log("End Reached>>" + distanceFromEnd) // 607, 878 
                
              }}
            />
          )}
           {conversations && conversations.length > 0 && !forwarded && (
            <FlatList
              vertical={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={conversations}
              renderItem={renderConversationView}
              keyExtractor={(item) => `${item.id}`}
              removeClippedSubviews={true}

              onEndReachedThreshold={0.1} // Tried 0, 0.01, 0.1, 0.7, 50, 100, 700

              onEndReached = {({distanceFromEnd})=>{ // problem
               // console.log("End Reached>>" + distanceFromEnd) // 607, 878 
                
              }}
            />
          )}
          {conversations && conversations.length <= 0 && (
            <View style={styles.emptyViewContainer}>
              <TNEmptyStateView
                emptyStateConfig={emptyStateConfig}
                appStyles={appStyles}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
});

IMConversationList.propTypes = {
  onConversationPress: PropTypes.func,
  onConversationLongPress: PropTypes.func,
  onSendForward: PropTypes.func,
  conversations: PropTypes.array,
};

export default IMConversationList;
