import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
//import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import IMConversationIconView from './IMConversationIconView/IMConversationIconView';
import { timeFormat } from '../..';
import dynamicStyles from './styles';

function IMConversationView(props) {
  const { onChatItemPress, onChatItemLongPress, formatMessage, item, appStyles } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  let title = item.name;
  if (!title) {
    if (item.participants.length > 0) {
      let friend = item.participants[0];
      title = friend.firstName + ' ' + friend.lastName;
    }
  }
  return (
    <TouchableOpacity
      onPress={() => onChatItemPress(item)}
      onLongPress={() => onChatItemLongPress(item)}
      style={styles.chatItemContainer}>
      <IMConversationIconView
        participants={item.participants}
        appStyles={appStyles}
      />
      <View style={styles.chatItemContent}>
        {
          item.seen?
          <Text style={styles.chatFriendName}>{title}</Text>
          :
          <Text style={styles.chatFriendName2}>{title}</Text>
        } 
        <View style={styles.content}>
          {
            item.seen?
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={styles.message}>
            {formatMessage(item)} {' · '}
            {timeFormat(item.lastMessageDate)}
          </Text>
            :
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={styles.unseenMessage}>
            {formatMessage(item)} {' · '}
            {timeFormat(item.lastMessageDate)}
          </Text>
          }
          
        </View>
      </View>
      {
          !item.seen && (
            <View style={styles.unseenIcon} />
          )
      }
    </TouchableOpacity>
  );
}

IMConversationView.propTypes = {
  formatMessage: PropTypes.func,
  item: PropTypes.object,
  onChatItemPress: PropTypes.func,
  onChatItemLongPress: PropTypes.func
};

export default IMConversationView;
